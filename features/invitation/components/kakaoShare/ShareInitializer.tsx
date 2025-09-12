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
    
    const initializeKakao = () => {
      console.log('ShareInitializer: Checking Kakao status');
      console.log('ShareInitializer: window.Kakao:', window.Kakao);
      
      if (window.Kakao) {
        console.log('ShareInitializer: Kakao object found');
        console.log('ShareInitializer: Kakao.isInitialized():', window.Kakao.isInitialized());
        
        if (!window.Kakao.isInitialized()) {
          const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
          console.log('ShareInitializer: Initializing with key:', key ? `${key.substring(0, 10)}...` : 'NO KEY');
          
          if (key) {
            try {
              window.Kakao.init(key);
              console.log('ShareInitializer: Kakao initialization successful');
              console.log('ShareInitializer: Kakao.isInitialized() after init:', window.Kakao.isInitialized());
            } catch (error) {
              console.error('ShareInitializer: Kakao initialization failed:', error);
            }
          } else {
            console.error('ShareInitializer: NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY is not set');
          }
        } else {
          console.log('ShareInitializer: Kakao already initialized');
        }
      } else {
        console.log('ShareInitializer: Kakao not loaded yet, will retry');
        return false;
      }
      return true;
    };
    
    // 즉시 시도
    if (!initializeKakao()) {
      // SDK가 아직 로드되지 않았다면 재시도
      const interval = setInterval(() => {
        console.log('ShareInitializer: Retrying Kakao initialization');
        if (initializeKakao()) {
          clearInterval(interval);
        }
      }, 100);
      
      // 10초 후 타임아웃
      setTimeout(() => {
        clearInterval(interval);
        console.error('ShareInitializer: Kakao initialization timeout');
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, []);

  return null;
}


