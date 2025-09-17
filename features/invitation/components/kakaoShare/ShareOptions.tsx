"use client"

import { useRef, useEffect } from "react"
import { ShareButton } from "./ShareButton"
import { useKakaoShare } from "./useKakaoShare"
import { KakaoScriptLoader } from "./KakaoScriptLoader"
import { MessageCircle, Instagram, Link } from "lucide-react"

type ShareOptionsProps = {
  templateId: number;
  templateArgs?: Record<string, string | number | undefined>;
  linkUrl: string;
  onInstagramShare?: () => void;
  onCopyLink?: () => void;
}

export function ShareOptions({ 
  templateId, 
  templateArgs, 
  linkUrl, 
  onInstagramShare, 
  onCopyLink 
}: ShareOptionsProps) {
  const { isReady, sendCustom } = useKakaoShare();

  const handleKakaoShare = async () => {
    if (isReady()) {
      const success = await sendCustom(templateId, templateArgs);
      if (success) {
        console.log('✅ 카카오 공유 성공');
      } else {
        console.error('❌ 카카오 공유 실패');
      }
    } else {
      console.error('❌ 카카오 SDK가 준비되지 않음');
    }
  };

  return (
    <>
      <KakaoScriptLoader />
      <div className="flex items-center justify-center space-x-4">
        {/* 카카오톡 */}
        <ShareButton
          id="kakao-share-button-modal"
          icon={<MessageCircle className="w-6 h-6" fill="currentColor" />}
          backgroundColor="#EFEFEF"
          hoverColor="#E0E0E0"
          iconColor="#323232"
          onClick={handleKakaoShare}
        />

        {/* 인스타그램 */}
        <ShareButton
          id="instagram-share-button"
          icon={<Instagram className="w-6 h-6" />}
          backgroundColor="#EFEFEF"
          hoverColor="#E0E0E0"
          iconColor="#323232"
          onClick={onInstagramShare}
        />
      </div>
    </>
  )
}
