"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    Kakao?: any;
  }
}

export function ShareInitializer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const existing = document.getElementById('kakao-sdk');
    if (existing) return;

    const script = document.createElement('script');
    script.id = 'kakao-sdk';
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
    script.integrity = 'sha384-2Q+3BK1MzklJic7TFQdoylWYPwnr5sL6u7XxX+OG65IR7Xba9ubiW8ai4gVkBxFX';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      const Kakao = window.Kakao;
      if (Kakao && !Kakao.isInitialized()) {
        Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
      }
    };
    document.head.appendChild(script);
  }, []);

  return null;
}


