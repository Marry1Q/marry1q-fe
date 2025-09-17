"use client"

import { useEffect } from "react";

declare global {
  interface Window {
    Kakao?: any;
  }
}

type TemplateArgs = Record<string, string | number | undefined>

export function useKakaoShare() {

  // 카카오 SDK 준비 상태 확인 (초기화는 KakaoScriptLoader에서 담당)
  useEffect(() => {
    const checkKakaoReady = () => {
      if (typeof window !== 'undefined' && window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) {
        console.log('✅ 카카오 SDK 준비 완료');
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

    // 타임아웃 제거 - SDK가 이미 준비되었으므로 불필요
    return () => {
      clearInterval(interval);
    };
  }, []);

  const getKakao = () => (typeof window !== 'undefined' ? window.Kakao : undefined);

  const isReady = () => {
    const Kakao = getKakao();
    return !!(Kakao && Kakao.isInitialized && Kakao.isInitialized());
  };

  // 초기화는 KakaoScriptLoader에서 담당하므로 제거

  const waitForReady = async (timeoutMs = 5000, intervalMs = 100): Promise<boolean> => {
    const start = Date.now();
    
    while (Date.now() - start < timeoutMs) {
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
        REGI_WEB_DOMAIN: templateArgs?.coupleSlug,
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
        REGI_WEB_DOMAIN: templateArgs?.coupleSlug,
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