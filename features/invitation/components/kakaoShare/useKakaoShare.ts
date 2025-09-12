"use client"

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Kakao?: any;
  }
}

type TemplateArgs = Record<string, string | number | undefined>

export function useKakaoShare() {
  const initAttemptedRef = useRef(false);

  useEffect(() => {
    console.log('useKakaoShare: useEffect triggered');
    
    const initializeKakao = () => {
      console.log('useKakaoShare: initializeKakao called');
      
      if (initAttemptedRef.current) {
        console.log('useKakaoShare: Initialization already attempted');
        return;
      }
      
      if (!window.Kakao) {
        console.log('useKakaoShare: Kakao not available yet, will retry');
        return;
      }
      
      initAttemptedRef.current = true;
      const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
      
      console.log('useKakaoShare: Initializing with key:', key ? `${key.substring(0, 10)}...` : 'NO KEY');
      
      if (key) {
        try {
          window.Kakao.init(key);
          console.log('useKakaoShare: Kakao initialization successful');
          console.log('useKakaoShare: Kakao.isInitialized():', window.Kakao.isInitialized());
        } catch (error) {
          console.error('useKakaoShare: Kakao initialization failed:', error);
        }
      } else {
        console.error('useKakaoShare: NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY is not set');
      }
    };
    
    // 즉시 초기화 시도
    initializeKakao();
    
    // SDK가 아직 로드되지 않았다면 재시도
    if (!window.Kakao) {
      const interval = setInterval(() => {
        console.log('useKakaoShare: Retrying Kakao initialization');
        if (window.Kakao && !initAttemptedRef.current) {
          initializeKakao();
          clearInterval(interval);
        }
      }, 100);
      
      // 10초 후 타임아웃
      setTimeout(() => {
        clearInterval(interval);
        console.error('useKakaoShare: Kakao initialization timeout');
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, []);

  const getKakao = () => (typeof window !== 'undefined' ? window.Kakao : undefined);

  const isReady = () => {
    const Kakao = getKakao();
    console.log('useKakaoShare: isReady check - Kakao:', Kakao);
    console.log('useKakaoShare: isReady check - Kakao.isInitialized:', Kakao?.isInitialized);
    const ready = !!(Kakao && Kakao.isInitialized && Kakao.isInitialized());
    console.log('useKakaoShare: isReady result:', ready);
    return ready;
  };

  const tryInit = () => {
    console.log('useKakaoShare: tryInit called');
    const Kakao = getKakao();
    const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
    
    console.log('useKakaoShare: tryInit - Kakao:', Kakao);
    console.log('useKakaoShare: tryInit - key exists:', !!key);
    console.log('useKakaoShare: tryInit - Kakao.init exists:', !!Kakao?.init);
    console.log('useKakaoShare: tryInit - Kakao.isInitialized():', Kakao?.isInitialized?.());
    
    if (Kakao && Kakao.init && !Kakao.isInitialized() && key) {
      try {
        console.log('useKakaoShare: tryInit - Attempting to initialize Kakao');
        Kakao.init(key);
        console.log('useKakaoShare: tryInit - Kakao initialization successful');
      } catch (error) {
        console.error('useKakaoShare: tryInit - Kakao initialization failed:', error);
      }
    } else {
      console.log('useKakaoShare: tryInit - Conditions not met for initialization');
    }
  };

  const waitForReady = async (timeoutMs = 5000, intervalMs = 100): Promise<boolean> => {
    console.log('useKakaoShare: waitForReady started');
    const start = Date.now();
    let attempts = 0;
    
    while (Date.now() - start < timeoutMs) {
      attempts++;
      console.log(`useKakaoShare: waitForReady attempt ${attempts}`);
      
      tryInit();
      if (isReady()) {
        console.log('useKakaoShare: waitForReady - Kakao is ready!');
        return true;
      }
      
      console.log('useKakaoShare: waitForReady - Not ready yet, waiting...');
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    
    console.error('useKakaoShare: waitForReady - Timeout reached, Kakao not ready');
    return false;
  };

  const createCustomButton = async (containerId: string, templateId: number, templateArgs?: TemplateArgs): Promise<boolean> => {
    console.log('useKakaoShare: createCustomButton called with containerId:', containerId);
    console.log('useKakaoShare: createCustomButton called with templateId:', templateId);
    console.log('useKakaoShare: createCustomButton called with templateArgs:', templateArgs);
    
    const ready = await waitForReady();
    console.log('useKakaoShare: createCustomButton - ready:', ready);
    
    if (!ready) {
      console.error('useKakaoShare: createCustomButton - Kakao not ready, cannot create button');
      return false;
    }
    
    try {
      const Kakao = getKakao();
      console.log('useKakaoShare: createCustomButton - Calling Kakao.Share.createCustomButton');
      Kakao!.Share.createCustomButton({
        container: containerId,
        templateId,
        templateArgs
      });
      console.log('useKakaoShare: createCustomButton - Success!');
      return true;
    } catch (e) {
      console.error('useKakaoShare: createCustomButton - Error:', e);
      return false;
    }
  };

  const sendCustom = async (templateId: number, templateArgs?: TemplateArgs): Promise<boolean> => {
    console.log('useKakaoShare: sendCustom called with templateId:', templateId);
    console.log('useKakaoShare: sendCustom called with templateArgs:', templateArgs);
    
    const ready = await waitForReady();
    console.log('useKakaoShare: sendCustom - ready:', ready);
    
    if (!ready) {
      console.error('useKakaoShare: sendCustom - Kakao not ready, cannot send');
      return false;
    }
    
    try {
      const Kakao = getKakao();
      console.log('useKakaoShare: sendCustom - Calling Kakao.Share.sendCustom');
      Kakao!.Share.sendCustom({ templateId, templateArgs });
      console.log('useKakaoShare: sendCustom - Success!');
      return true;
    } catch (e) {
      console.error('useKakaoShare: sendCustom - Error:', e);
      return false;
    }
  };

  return { isReady, createCustomButton, sendCustom };
}