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
    const initializeKakao = () => {
      if (initAttemptedRef.current) {
        return;
      }
      
      if (!window.Kakao) {
        return;
      }
      
      initAttemptedRef.current = true;
      const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
      
      if (key) {
        try {
          window.Kakao.init(key);
          console.log('✅ 카카오 SDK 초기화 완료');
        } catch (error) {
          console.error('❌ 카카오 SDK 초기화 실패:', error);
        }
      } else {
        console.error('❌ NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY가 설정되지 않음');
      }
    };
    
    // 즉시 초기화 시도
    initializeKakao();
    
    // SDK가 아직 로드되지 않았다면 재시도
    if (!window.Kakao) {
      const interval = setInterval(() => {
        if (window.Kakao && !initAttemptedRef.current) {
          initializeKakao();
          clearInterval(interval);
        }
      }, 100);
      
      // 10초 후 타임아웃
      setTimeout(() => {
        clearInterval(interval);
        console.error('❌ 카카오 SDK 초기화 타임아웃');
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, []);

  const getKakao = () => (typeof window !== 'undefined' ? window.Kakao : undefined);

  const isReady = () => {
    const Kakao = getKakao();
    return !!(Kakao && Kakao.isInitialized && Kakao.isInitialized());
  };

  const tryInit = () => {
    const Kakao = getKakao();
    const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
    
    if (Kakao && Kakao.init && !Kakao.isInitialized() && key) {
      try {
        Kakao.init(key);
      } catch (error) {
        console.error('❌ 카카오 SDK 재초기화 실패:', error);
      }
    }
  };

  const waitForReady = async (timeoutMs = 5000, intervalMs = 100): Promise<boolean> => {
    const start = Date.now();
    
    while (Date.now() - start < timeoutMs) {
      tryInit();
      if (isReady()) {
        return true;
      }
      
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    
    console.error('❌ 카카오 SDK 준비 타임아웃');
    return false;
  };

  const createCustomButton = async (containerId: string, templateId: number, templateArgs?: TemplateArgs): Promise<boolean> => {
    console.log('📤 카카오 공유 요청:', {
      templateId,
      templateArgs: {
        title: templateArgs?.title,
        date: templateArgs?.date,
        venue: templateArgs?.venue,
        THU: templateArgs?.THU ? '이미지 설정됨' : '이미지 없음',
        REGI_WEB_DOMAIN: templateArgs?.REGI_WEB_DOMAIN,
        groomName: templateArgs?.groomName,
        brideName: templateArgs?.brideName
      }
    });
    
    const ready = await waitForReady();
    
    if (!ready) {
      console.error('❌ 카카오 SDK가 준비되지 않음');
      return false;
    }
    
    try {
      const Kakao = getKakao();
      Kakao!.Share.createCustomButton({
        container: containerId,
        templateId,
        templateArgs
      });
      console.log('✅ 카카오 공유 버튼 생성 완료');
      return true;
    } catch (e) {
      console.error('❌ 카카오 공유 버튼 생성 실패:', e);
      return false;
    }
  };

  const sendCustom = async (templateId: number, templateArgs?: TemplateArgs): Promise<boolean> => {
    console.log('📤 카카오 공유 전송:', {
      templateId,
      templateArgs: {
        title: templateArgs?.title,
        date: templateArgs?.date,
        venue: templateArgs?.venue,
        THU: templateArgs?.THU ? '이미지 설정됨' : '이미지 없음',
        REGI_WEB_DOMAIN: templateArgs?.REGI_WEB_DOMAIN,
        groomName: templateArgs?.groomName,
        brideName: templateArgs?.brideName
      }
    });
    
    const ready = await waitForReady();
    
    if (!ready) {
      console.error('❌ 카카오 SDK가 준비되지 않음');
      return false;
    }
    
    try {
      const Kakao = getKakao();
      Kakao!.Share.sendCustom({ templateId, templateArgs });
      console.log('✅ 카카오 공유 전송 완료');
      return true;
    } catch (e) {
      console.error('❌ 카카오 공유 전송 실패:', e);
      return false;
    }
  };

  return { isReady, createCustomButton, sendCustom };
}