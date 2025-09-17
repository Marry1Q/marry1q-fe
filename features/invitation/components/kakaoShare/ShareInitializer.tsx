"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    Kakao?: any;
  }
}

export function ShareInitializer() {
  console.log('ShareInitializer: Component rendered');
  
  useEffect(() => {
    console.log('ShareInitializer: useEffect triggered');
    
    // 카카오 SDK 준비 상태 확인 (초기화는 KakaoScriptLoader에서 담당)
    const checkKakaoReady = () => {
      if (typeof window !== 'undefined' && window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) {
        console.log('✅ ShareInitializer: 카카오 SDK 준비 완료');
        return true;
      }
      return false;
    };

    // 즉시 확인
    if (checkKakaoReady()) return;

    // 주기적으로 확인
    const interval = setInterval(() => {
      if (checkKakaoReady()) {
        clearInterval(interval);
      }
    }, 100);

    // 5초 후 타임아웃
    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.warn('⚠️ ShareInitializer: 카카오 SDK 준비 타임아웃');
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return null;
}


