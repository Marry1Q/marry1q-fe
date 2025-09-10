import React from "react";
import { CardLayout } from "../card";

interface CardPreviewProps {
  invitationData: any;
  uploadedPhotos: string[];
  shareImage?: string;
  isPreview?: boolean;
}

export function CardPreview({ invitationData, uploadedPhotos, shareImage, isPreview = true }: CardPreviewProps) {
  // shareImage를 invitationData에 포함시켜 전달
  const invitationDataWithShareImage = {
    ...invitationData,
    shareImage: shareImage,
    mainImageUrl: shareImage || invitationData.mainImageUrl
  };
  
  return (
    <CardLayout
      invitationData={invitationDataWithShareImage}
      uploadedPhotos={uploadedPhotos}
      shareImage={shareImage}
      isPreview={isPreview}
    />
  );
}