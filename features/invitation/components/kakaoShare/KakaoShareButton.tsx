"use client"

import { ShareButton } from "./ShareButton";
import { MessageCircle } from "lucide-react";
import { useKakaoModal } from "./hooks/useKakaoModal";
import { KakaoShareModal } from "./KakaoShareModal";

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
  const { 
    isModalOpen, 
    isLoading, 
    error, 
    openKakaoShare, 
    closeModal 
  } = useKakaoModal();

  const handleClick = () => {
    console.log('🔄 카카오 공유 버튼 클릭:', { templateId, templateArgs });
    openKakaoShare(templateId, templateArgs);
  };

  return (
    <>
      <ShareButton
        id="kakao-share-button"
        icon={<MessageCircle className="w-6 h-6" fill="currentColor" />}
        backgroundColor="#FEE500"
        hoverColor="#FDD835"
        iconColor="#3C1E1E"
        onClick={handleClick}
        className={className}
      />
      
      <KakaoShareModal
        isOpen={isModalOpen}
        onClose={closeModal}
        templateId={templateId}
        templateArgs={templateArgs}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
