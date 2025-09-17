import React from "react";
import { CardHero } from "./CardHero";
import { CardInfo } from "./CardInfo";
import { CardContact } from "./CardContact";
import { CardGallery } from "./CardGallery";
import { CardShare } from "./CardShare";
import { Invitation } from "@/features/invitation/types";

interface CardLayoutProps {
  invitationData: Invitation & {
    weddingTime?: string;
    venue?: string;
    venueAddress?: string;
    venueLatitude?: number;
    venueLongitude?: number;
    message?: string;
    accountMessage?: string;
    contact?: {
      groom: string;
      bride: string;
    };
    accountInfo?: {
      groom: {
        name: string;
        accountNumber: string;
        bankName: string;
        fieldId: string;
      };
      bride: {
        name: string;
        accountNumber: string;
        bankName: string;
        fieldId: string;
      };
    };
  };
  uploadedPhotos: string[];
  shareImage?: string;
  isPreview?: boolean;
}

export function CardLayout({ invitationData, uploadedPhotos, shareImage, isPreview = false }: CardLayoutProps) {
  // 데이터 변환 함수들
  const parseWeddingDate = (dateString: string): Date => {
    try {
      // "yyyy-MM-dd" 형식의 문자열을 Date로 변환
      if (dateString && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return new Date(dateString);
      }
      
      // 기존 한국어 형식도 지원 (하위 호환성)
      const match = dateString.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
      if (match) {
        const [, year, month, day] = match;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      
      return new Date();
    } catch {
      return new Date();
    }
  };

  const getCurrentTimeString = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const parseParents = (parentsString: string): { father: string; mother: string } => {
    const parts = parentsString.split(" · ");
    return {
      father: parts[0] || "",
      mother: parts[1] || "",
    };
  };

  return (
    <div className={`min-h-screen bg-white w-full max-w-sm mx-auto font-gowun ${isPreview ? 'preview-mode' : 'view-mode'}`} style={{ fontFamily: '"Gowun Dodum", sans-serif' }}>
      {/* Hero Section */}
      <CardHero 
        invitation={invitationData}
        uploadedPhotos={uploadedPhotos}
        isPreview={isPreview}
      />
      
      {/* Info Section */}
      <CardInfo 
        weddingDate={parseWeddingDate(invitationData.weddingDate || "")}
        weddingTime={invitationData.weddingTime || getCurrentTimeString()}
        venue={invitationData.venue || invitationData.weddingLocation || ""}
        venueAddress={invitationData.venueAddress || ""}
        message={invitationData.message || "저희 두 사람이 평생을 함께하기 위해 서로의 반려자가 되려 합니다."}
        venueLatitude={invitationData.venueLatitude}
        venueLongitude={invitationData.venueLongitude}
        isPreview={isPreview}
      />
      
      {/* Contact Section */}
      <CardContact 
        contact={invitationData.contact || { groom: invitationData.groomPhone || "", bride: invitationData.bridePhone || "" }}
        accountMessage={invitationData.accountMessage}
        accountInfo={invitationData.accountInfo || {
          groom: {
            name: "신랑",
            accountNumber: invitationData.groomAccount || "",
            bankName: "",
            fieldId: "groom-account"
          },
          bride: {
            name: "신부",
            accountNumber: invitationData.brideAccount || "",
            bankName: "",
            fieldId: "bride-account"
          }
        }}
        isPreview={isPreview}
      />

    </div>
  );
}