"use client"

import { copyToClipboard } from "./shareUtils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Copy } from "lucide-react"
import { showErrorToast, showSuccessToast } from "@/components/ui/toast"
import { ShareOptions } from "./ShareOptions"

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  templateId: number;
  templateArgs?: Record<string, string | number | undefined>;
  linkUrl: string;
}

export function ShareModal({ isOpen, onClose, templateId, templateArgs, linkUrl }: ShareModalProps) {
  const onCopy = async () => {
    const ok = await copyToClipboard(linkUrl);
    if (ok) showSuccessToast("링크가 복사되었습니다.");
    else showErrorToast("링크 복사에 실패했습니다.");
    onClose();
  };

  const onInstagramShare = () => {
    // 인스타그램 공유 로직 (예: 스토리 공유)
    const instagramUrl = `https://www.instagram.com/`;
    window.open(instagramUrl, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "Hana2-CM" }}>
            공유하기
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Share Options */}
          <ShareOptions
            templateId={templateId}
            templateArgs={templateArgs}
            linkUrl={linkUrl}
            onInstagramShare={onInstagramShare}
            onCopyLink={onCopy}
          />

          {/* URL Input */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={linkUrl}
                readOnly
                className="flex-1 text-sm text-gray-700 font-hana"
              />
              <Button
                size="sm"
                onClick={onCopy}
                className="bg-[#008485] hover:bg-[#e05274] text-white font-hana"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}