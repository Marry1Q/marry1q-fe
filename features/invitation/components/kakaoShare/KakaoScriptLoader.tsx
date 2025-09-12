"use client"

import Script from "next/script"

declare global {
  interface Window {
    Kakao?: any;
  }
}

export function KakaoScriptLoader() {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      integrity="sha384-2Q+3BK1MzklJic7TFQdoylWYPwnr5sL6u7XxX+OG65IR7Xba9ubiW8ai4gVkBxFX"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('KakaoScriptLoader: Kakao SDK loaded via Script');
        if (window.Kakao && !window.Kakao.isInitialized()) {
          const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
          console.log('KakaoScriptLoader: Initializing Kakao with key:', key ? `${key.substring(0, 10)}...` : 'NO KEY');
          if (key) {
            try {
              window.Kakao.init(key);
              console.log('KakaoScriptLoader: Kakao initialization successful');
              console.log('KakaoScriptLoader: Kakao.isInitialized():', window.Kakao.isInitialized());
            } catch (error) {
              console.error('KakaoScriptLoader: Kakao initialization failed:', error);
            }
          }
        }
      }}
      onError={(error) => {
        console.error('KakaoScriptLoader: Failed to load Kakao SDK:', error);
      }}
    />
  );
}
