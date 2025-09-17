export interface Invitation {
  // 기본 정보 (백엔드와 일치)
  id: number; // invitationId를 id로 매핑
  coupleId: number;
  title: string;
  invitationMessage?: string;
  weddingDate: string; // "yyyy-MM-dd" 형식 (LocalDate)
  weddingTime: string; // "HH:mm:ss" 형식 (LocalTime)
  weddingHall: string;
  venueAddress: string;
  venueLatitude?: number; // 장소 위도
  venueLongitude?: number; // 장소 경도
  mainImageUrl?: string; // 백엔드 DTO와 일치
  accountMessage?: string;
  totalViews: number;
  isRepresentative: boolean;
  createdAt: string; // ISO 8601 형식 (LocalDateTime)
  updatedAt: string; // ISO 8601 형식 (LocalDateTime)
  
  // 신랑 정보
  groomName: string;
  groomPhone?: string;
  groomFatherName?: string;
  groomMotherName?: string;
  groomAccount?: string;
  
  // 신부 정보
  brideName: string;
  bridePhone?: string;
  brideFatherName?: string;
  brideMotherName?: string;
  brideAccount?: string;
  
  // 프론트엔드 전용 필드들 (백엔드에서 제공하지 않는 필드)
  status?: string; // '완료', '초안' 등
  views?: number; // 일일 조회수
  todayViews?: number; // 오늘 조회수
  template?: string; // 템플릿명
  isPrimary?: boolean; // isRepresentative와 동일하지만 호환성을 위해 유지
  
  // 편의를 위한 파생 필드들
  groomParents?: string; // groomFatherName + groomMotherName
  brideParents?: string; // brideFatherName + brideMotherName
  venue?: string; // weddingHall과 동일
  weddingLocation?: string; // weddingHall과 동일
  message?: string; // invitationMessage와 동일
  
  // 부모님 상세 정보 (편의를 위한 구조화)
  groomParentsDetail?: {
    father: string;
    mother: string;
  };
  brideParentsDetail?: {
    father: string;
    mother: string;
  };
  
  // 연락처 정보 (편의를 위한 구조화)
  contact?: {
    groom: string;
    bride: string;
  };
  
  // 계좌 정보 (편의를 위한 구조화)
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
  
  // UI 관련 필드들 (기본값 설정)
  uploadedPhotos?: string[];
  selectedTemplate?: number;
  selectedColor?: string;
  shareImage?: string; // mainImageUrl과 동일하지만 호환성을 위해 유지
}

export interface InvitationStats {
  totalInvitations: number;
  completedInvitations: number;
  draftInvitations: number;
  totalViews: number;
  primaryInvitation?: {
    id: number;
    title: string;
    totalViews: number;
    todayViews: number;
    mainImageUrl?: string;
    // 대표 청첩장 통계에도 상세 정보 추가
    weddingDate?: string;
    weddingLocation?: string;
    groomName?: string;
    brideName?: string;
  };
}

export type SortOption = 'recent' | 'oldest' | 'title' | 'views'; 