"use client"

import Script from "next/script"
import { useState, useEffect, useRef } from "react"

declare global {
  interface Window {
    Kakao?: any;
  }
}

export function KakaoScriptLoader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initAttemptsRef = useRef(0);
  const maxAttempts = 3;

  // 카카오 SDK 로드 상태 확인
  useEffect(() => {
    const checkKakaoLoaded = () => {
      if (typeof window !== 'undefined' && window.Kakao) {
        console.log('✅ 카카오 SDK 로드 완료 (이미 로드됨)');
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    // 즉시 확인 (이미 로드된 경우)
    if (checkKakaoLoaded()) return;

    // 주기적으로 확인 (새로 로드되는 경우)
    const interval = setInterval(() => {
      if (checkKakaoLoaded()) {
        clearInterval(interval);
      }
    }, 100);

    // 5초 후 타임아웃
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!isLoaded) {
        console.warn('⚠️ 카카오 SDK 로드 타임아웃');
        setError('카카오 SDK 로드 타임아웃');
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isLoaded]);

  // SDK 로드 후 초기화 시도
  useEffect(() => {
    if (!isLoaded || isInitialized) return;

    const initializeKakao = () => {
      if (initAttemptsRef.current >= maxAttempts) {
        console.error('❌ 카카오 SDK 초기화 최대 시도 횟수 초과');
        setError('카카오 SDK 초기화 실패 (최대 시도 횟수 초과)');
        return;
      }

      if (!window.Kakao) {
        console.log('🔄 카카오 SDK 초기화 재시도 중...', initAttemptsRef.current + 1);
        console.log('🔍 window.Kakao 상태:', {
          exists: !!window.Kakao,
          type: typeof window.Kakao,
          keys: window.Kakao ? Object.keys(window.Kakao) : 'N/A'
        });
        initAttemptsRef.current++;
        return;
      }

      const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
      console.log('🔧 카카오 SDK 초기화 시도:', {
        attempt: initAttemptsRef.current + 1,
        hasKey: !!key,
        keyPreview: key ? `${key.substring(0, 10)}...` : 'NO KEY'
      });

      if (!key) {
        console.error('❌ NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY가 설정되지 않음');
        setError('카카오 JavaScript 키가 설정되지 않음');
        return;
      }

      try {
        console.log('🔧 window.Kakao.init 호출 전:', {
          Kakao: !!window.Kakao,
          init: !!window.Kakao?.init,
          isInitialized: window.Kakao?.isInitialized ? window.Kakao.isInitialized() : 'N/A'
        });
        
        window.Kakao.init(key);
        console.log('✅ 카카오 SDK 초기화 완료');
        console.log('✅ Kakao.isInitialized():', window.Kakao.isInitialized());
        setIsInitialized(true);
      } catch (error) {
        console.error('❌ 카카오 SDK 초기화 실패:', error);
        console.error('❌ 에러 상세:', {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : 'N/A',
          Kakao: !!window.Kakao,
          init: !!window.Kakao?.init
        });
        initAttemptsRef.current++;
        if (initAttemptsRef.current < maxAttempts) {
          console.log('🔄 카카오 SDK 초기화 재시도 예정...');
        } else {
          setError('카카오 SDK 초기화 실패');
        }
      }
    };

    // 즉시 초기화 시도
    initializeKakao();

    // 초기화 실패 시 재시도
    if (!isInitialized && initAttemptsRef.current < maxAttempts) {
      const interval = setInterval(() => {
        if (isInitialized || initAttemptsRef.current >= maxAttempts) {
          clearInterval(interval);
          return;
        }
        initializeKakao();
      }, 100);

      // 5초 후 타임아웃
      const timeout = setTimeout(() => {
        clearInterval(interval);
        if (!isInitialized) {
          console.error('❌ 카카오 SDK 초기화 타임아웃');
          setError('카카오 SDK 초기화 타임아웃');
        }
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isLoaded, isInitialized]);

  return (
    <Script
      src={`https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js?v=${Date.now()}`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
      onLoad={() => {
        console.log('✅ 카카오 SDK 로드 완료 (새로 로드됨)');
        console.log('🔍 로드 후 window.Kakao 상태:', {
          exists: !!window.Kakao,
          type: typeof window.Kakao,
          keys: window.Kakao ? Object.keys(window.Kakao) : 'N/A',
          init: !!window.Kakao?.init,
          isInitialized: window.Kakao?.isInitialized ? window.Kakao.isInitialized() : 'N/A'
        });
        setIsLoaded(true);
      }}
      onError={(error) => {
        console.error('❌ 카카오 SDK 로드 실패:', error);
        setError('카카오 SDK 로드 실패');
      }}
    />
  );
}
