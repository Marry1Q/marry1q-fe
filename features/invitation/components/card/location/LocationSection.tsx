import React from "react";
import dynamic from "next/dynamic";
const KakaoMap = dynamic(() => import("./KakaoMap"), { ssr: false });

interface LocationSectionProps {
  venue: string;
  venueAddress: string;
  venueLatitude?: number;
  venueLongitude?: number;
  isPreview?: boolean;
}

export function LocationSection({ 
  venue, 
  venueAddress, 
  venueLatitude, 
  venueLongitude, 
  isPreview = false 
}: LocationSectionProps) {
  return (
    <div className="mb-12">
      <p className="text-lg mb-4 text-center" style={{ fontFamily: 'Bona Nova SC', color: '#d099a1' }}>
        LOCATION
      </p>
      
      {/* 장소 텍스트 정보 */}
      <div className="mb-6">
        <p className="text-base text-gray-600 mb-2 text-center font-semibold">
          {venue || "장소 미정"}
        </p>
        <p className="text-base text-gray-600 text-center">
          {venueAddress || "주소 미정"}
        </p>
      </div>
      
      {/* 카카오 지도 */}
      <div className="flex justify-center">
        <KakaoMap 
          latitude={venueLatitude}
          longitude={venueLongitude}
          venue={venue}
          venueAddress={venueAddress}
        />
      </div>
    </div>
  );
}
