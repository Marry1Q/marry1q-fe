"use client"

import { useRef, useEffect } from "react"
import { ShareButton } from "./ShareButton"
import { useKakaoShare } from "./useKakaoShare"
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
  const { isReady, createCustomButton } = useKakaoShare();
  const kakaoButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReady() && kakaoButtonRef.current) {
      createCustomButton('#kakao-share-button-modal', templateId, templateArgs);
    }
  }, [isReady, createCustomButton, templateId, templateArgs]);

  return (
    <div className="flex items-center justify-center space-x-4">
      {/* 카카오톡 */}
      <ShareButton
        id="kakao-share-button-modal"
        icon={<MessageCircle className="w-6 h-6" fill="currentColor" />}
        backgroundColor="#EFEFEF"
        hoverColor="#E0E0E0"
        iconColor="#323232"
        ref={kakaoButtonRef}
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
  )
}
