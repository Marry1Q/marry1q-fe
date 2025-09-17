"use client"

import { ShareButton } from "./ShareButton"
import { KakaoScriptLoader } from "./KakaoScriptLoader"
import { KakaoShareButton } from "./KakaoShareButton"
import { Instagram } from "lucide-react"

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
  return (
    <>
      <KakaoScriptLoader />
      <div className="flex items-center justify-center space-x-4">
        {/* 카카오톡 - 새로운 모달 방식 */}
        <KakaoShareButton
          templateId={templateId}
          templateArgs={templateArgs}
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
