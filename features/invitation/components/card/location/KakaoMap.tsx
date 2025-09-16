"use client";
import Script from 'next/script';
import { Map } from 'react-kakao-maps-sdk';
import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false`;

interface KakaoMapProps {
  latitude?: number;
  longitude?: number;
  venue?: string;
  venueAddress?: string;
}

const KakaoMap = ({ latitude, longitude, venue, venueAddress }: KakaoMapProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const infoRef = useRef<any>(null);

  // 기본 좌표 (요청 기본값)
  const defaultLatitude = 37.5561010650993;
  const defaultLongitude = 126.628731548188;
  
  // 실제 사용할 좌표
  const mapLatitude = latitude || defaultLatitude;
  const mapLongitude = longitude || defaultLongitude;
  
  // 좌표가 유효한지 확인
  const hasValidCoordinates = latitude && longitude && 
    latitude >= -90 && latitude <= 90 && 
    longitude >= -180 && longitude <= 180;

  useEffect(() => {
    // 환경변수 확인
    console.log('🔍 환경변수 확인:', {
      NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY: process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY,
      KAKAO_SDK_URL: KAKAO_SDK_URL,
      latitude,
      longitude,
      hasValidCoordinates
    });

    if (!process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY) {
      console.error('❌ NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY가 설정되지 않았습니다.');
      setError('카카오맵 API 키가 설정되지 않았습니다.');
    }
  }, [latitude, longitude]);

  // 좌표 변경 시 마커 동기화 (기본 좌표 포함 항상 마커 표시)
  useEffect(() => {
    if (!isLoaded) return;
    if (!mapRef.current) return;
    if (!(typeof window !== 'undefined' && window.kakao)) return;

    try {
      if (infoRef.current) { infoRef.current.close?.(); infoRef.current = null; }
      if (markerRef.current) { markerRef.current.setMap?.(null); markerRef.current = null; }

      const position = new window.kakao.maps.LatLng(mapLatitude, mapLongitude);
      const marker = new window.kakao.maps.Marker({ position });
      marker.setMap(mapRef.current);
      markerRef.current = marker;

      if (venue || venueAddress) {
        const content = `<div style=\"width:220px;text-align:center;padding:6px 0;\">${(venue || venueAddress || '').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;
        const info = new window.kakao.maps.InfoWindow({ content });
        info.open(mapRef.current, marker);
        infoRef.current = info;
      }

      mapRef.current.setCenter(position);
    } catch (e) {
      console.error('좌표 변경에 따른 마커 업데이트 실패', e);
    }
  }, [isLoaded, mapLatitude, mapLongitude, venue, venueAddress]);

  if (error) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Script 
        src={KAKAO_SDK_URL} 
        strategy="lazyOnload"
        onLoad={() => {
          console.log('✅ 카카오맵 SDK 로드 완료');
          setIsLoaded(true);
        }}
        onError={(e) => {
          console.error('❌ 카카오맵 SDK 로드 실패:', e);
          setError('카카오맵 로드에 실패했습니다.');
        }}
      />
      <div className="w-full h-64">
        {isLoaded ? (
          <Map 
            center={{ lat: mapLatitude, lng: mapLongitude }} 
            style={{ width: '100%', height: '100%' }}
            level={3}
            onCreate={(map) => {
              mapRef.current = map;
              // 최초 생성 시에도 현재 좌표로 마커 동기화
              if (typeof window !== 'undefined' && window.kakao) {
                try {
                  // 기존 마커/인포윈도우 정리
                  if (infoRef.current) { infoRef.current.close?.(); infoRef.current = null; }
                  if (markerRef.current) { markerRef.current.setMap?.(null); markerRef.current = null; }

                  const position = new window.kakao.maps.LatLng(mapLatitude, mapLongitude);
                  const marker = new window.kakao.maps.Marker({ position });
                  marker.setMap(map);
                  markerRef.current = marker;

                  if (venue || venueAddress) {
                    const content = `<div style="width:220px;text-align:center;padding:6px 0;">${(venue || venueAddress || '').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;
                    const info = new window.kakao.maps.InfoWindow({ content });
                    info.open(map, marker);
                    infoRef.current = info;
                  }
                  map.setCenter(position);
                } catch (e) {
                  console.error('마커 초기화 실패', e);
                }
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">지도를 불러오는 중...</p>
          </div>
        )}
      </div>
    </>
  );
};

export default KakaoMap;