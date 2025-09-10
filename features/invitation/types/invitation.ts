// 이미지 상태 관리 타입
export interface ImageState {
  file: File | null;        // 실제 파일 객체
  previewUrl: string;       // 미리보기용 URL
  uploadedUrl: string;      // 업로드된 S3 URL
  isUploaded: boolean;      // 업로드 완료 여부
}

export interface InvitationData {
  title: string
  groomName: string
  brideName: string
  weddingDate: Date
  weddingTime: string
  venue: string
  venueAddress: string
  groomParents: {
    father: string
    mother: string
  }
  brideParents: {
    father: string
    mother: string
  }
  contact: {
    groom: string
    bride: string
  }
  message: string
  accountMessage: string
  accountInfo: {
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
  }
}

export interface Template {
  id: number
  name: string
  preview: string
}

export interface ColorOption {
  name: string
  value: string
} 