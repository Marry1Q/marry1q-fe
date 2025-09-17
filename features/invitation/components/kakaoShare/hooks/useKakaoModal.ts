"use client"

import { useState, useCallback } from "react";
import { useKakaoShare } from "../useKakaoShare";

export function useKakaoModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendCustom, isReady } = useKakaoShare();

  const openKakaoShare = useCallback(async (
    templateId: number, 
    templateArgs?: Record<string, string | number | undefined>
  ) => {
    if (!isReady()) {
      setError('카카오 SDK가 준비되지 않았습니다.');
      return;
    }

    setIsModalOpen(true);
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 카카오 공유 모달에서 실행 시작:', { templateId, templateArgs });
      
      // 카카오 공유 실행
      const success = await sendCustom(templateId, templateArgs);
      
      if (success) {
        console.log('✅ 카카오 공유 모달에서 실행 완료');
        // 공유 완료 후 모달 닫기 (약간의 지연 후)
        setTimeout(() => {
          setIsModalOpen(false);
        }, 2000);
      } else {
        setError('카카오 공유에 실패했습니다.');
      }
    } catch (err) {
      setError('카카오 공유 중 오류가 발생했습니다.');
      console.error('❌ 카카오 공유 오류:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sendCustom, isReady]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isModalOpen,
    isLoading,
    error,
    openKakaoShare,
    closeModal
  };
}
