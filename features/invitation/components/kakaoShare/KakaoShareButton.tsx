"use client"

import { ShareButton } from "./ShareButton";
import { MessageCircle } from "lucide-react";
import { useKakaoShare } from "./useKakaoShare";

interface KakaoShareButtonProps {
  templateId: number;
  templateArgs?: Record<string, string | number | undefined>;
  className?: string;
}

export function KakaoShareButton({ 
  templateId, 
  templateArgs, 
  className 
}: KakaoShareButtonProps) {
  const { sendCustom, isReady } = useKakaoShare();

  const handleClick = async () => {
    console.log('🔄 카카오 공유 버튼 클릭:', { templateId, templateArgs });
    
    if (!isReady()) {
      console.error('❌ 카카오 SDK가 준비되지 않음');
      return;
    }

    try {
      const success = await sendCustom(templateId, templateArgs);
      if (success) {
        console.log('✅ 카카오 공유 성공');
      } else {
        console.error('❌ 카카오 공유 실패');
      }
    } catch (error) {
      console.error('❌ 카카오 공유 오류:', error);
    }
  };

  return (
    <ShareButton
      id="kakao-share-button"
      icon={<MessageCircle className="w-6 h-6" fill="currentColor" />}
      backgroundColor="#FEE500"
      hoverColor="#FDD835"
      iconColor="#3C1E1E"
      onClick={handleClick}
      className={className}
    />
  );
}
