"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { coupleApi } from "@/lib/api/coupleApi";

interface CardShareProps {
  invitationId?: number;
  coupleSlug?: string;
  isPreview?: boolean;
}

export function CardShare({ invitationId, coupleSlug: propCoupleSlug, isPreview }: CardShareProps) {
  const [copied, setCopied] = useState(false);
  const { coupleSlug: authCoupleSlug, coupleInfo } = useAuth();

  // coupleInfo에서 urlSlug를 우선 사용, 없으면 useAuth의 coupleSlug 사용
  const shareUrl = `https://marry1q.com/invitation/${coupleInfo?.urlSlug || authCoupleSlug || propCoupleSlug || invitationId || 1}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <section className="py-16 px-6 bg-white w-full max-w-sm mx-auto">
      <div className="w-full">
        {/* 공유 버튼 */}
        <div className="text-center">
          <button
            onClick={handleCopy}
            className="px-8 py-3 border border-gray-300 rounded-lg text-gray-900 Pretendard hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                복사됨
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                청첩장 링크 복사
              </div>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}