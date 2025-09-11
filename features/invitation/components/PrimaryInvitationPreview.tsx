"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Eye, Users, Copy, ImageIcon, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { colors } from "@/constants/colors";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { ShareMenu } from "./kakaoShare";

interface PrimaryInvitation {
  id: number;
  title: string;
  totalViews: number; // 백엔드에서 제공하는 총 조회수
  todayViews?: number; // 임시로 optional로 변경 (백엔드에서 제공하지 않음)
  mainImageUrl?: string; // 백엔드 DTO 기준으로 mainImageUrl 사용
  coupleSlug?: string;
  // 추가된 상세 정보
  weddingDate?: string;
  weddingLocation?: string;
  groomName?: string;
  brideName?: string;
  groomPhone?: string;
  bridePhone?: string;
  groomParents?: string;
  brideParents?: string;
}

interface PrimaryInvitationPreviewProps {
  invitation: PrimaryInvitation;
}

export function PrimaryInvitationPreview({ invitation }: PrimaryInvitationPreviewProps) {
  const [copied, setCopied] = useState(false);
  const { coupleSlug, coupleInfo } = useAuth();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${origin}/invitation/${coupleInfo?.urlSlug || coupleSlug || invitation.coupleSlug || invitation.id}`;
  const templateArgs = {
    title: invitation.title,
    date: invitation.weddingDate,
    venue: invitation.weddingLocation,
    imageUrl: invitation.mainImageUrl,
    linkUrl: shareUrl,
  } as Record<string, string | number | undefined>;

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle style={{fontFamily: "Hana2-CM"}}>
            대표 청첩장
          </CardTitle>
          <div className="flex items-center gap-4 ">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">조회수 {invitation.totalViews || 0}</span>
            </div>
            <ShareMenu templateId={124176} templateArgs={templateArgs} linkUrl={shareUrl} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 메신저 공유 미리보기 */}
          <div className="bg-white rounded-lg p-4 shadow-lg border max-w-sm mx-auto">
            {/* 대표 이미지 */}
            <div className="aspect-[3/4] bg-gradient-to-b from-pink-100 to-white rounded-lg mb-4 overflow-hidden">
              {invitation.mainImageUrl ? (
                <img
                  src={invitation.mainImageUrl}
                  alt="청첩장 대표 이미지"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // 이미지 로드 실패 시 기본 이미지로 대체
                    const target = e.target as HTMLImageElement;
                    target.src = "/invitation/invitationMainImage1.jpeg";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">메인 이미지가 없습니다</p>
                  </div>
                </div>
              )}
            </div>

            {/* 청첩장 정보 */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-gray-800 text-center">
                {invitation.title || "제목이 없습니다"}
              </h3>
              <p className="text-sm text-gray-600 text-center">
                {invitation.weddingDate || "날짜 미정"}
                <br />
                {invitation.weddingLocation || "장소 미정"}
              </p>

              {/* 버튼들 */}
              <div className="flex gap-2 pt-3">
                <Link href={`/invitation/${coupleInfo?.urlSlug || coupleSlug || invitation.coupleSlug || invitation.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    초대장 보기
                  </Button>
                </Link>
              </div>

              {/* 출처 */}
              <div className="flex items-center gap-1 pt-1">
                <div className="w-4 h-4 rounded-sm flex items-center justify-center overflow-hidden">
                  <img 
                    src="/Marry1Q_logo.png" 
                    alt="Marry1Q" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-gray-500">Marry1Q</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 