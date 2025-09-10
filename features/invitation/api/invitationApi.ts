import { apiClient } from '@/lib/api/client';

// 청첩장 생성 요청 타입 (백엔드 CreateInvitationRequest와 일치)
export interface CreateInvitationRequest {
  title: string;
  invitationMessage?: string;
  weddingDate: string; // "yyyy-MM-dd" 형식
  weddingTime: string; // "HH:mm" 형식
  weddingHall: string;
  venueAddress: string;
  accountMessage?: string;
  groomName: string;
  groomPhone?: string;
  groomFatherName?: string;
  groomMotherName?: string;
  groomAccount?: string;
  brideName: string;
  bridePhone?: string;
  brideFatherName?: string;
  brideMotherName?: string;
  brideAccount?: string;
  mainImageUrl?: string; // 이미지 URL 추가
}

// 청첩장 수정 요청 타입 (백엔드 UpdateInvitationRequest와 일치)
export interface UpdateInvitationRequest {
  title?: string;
  invitationMessage?: string;
  weddingDate?: string; // "yyyy-MM-dd" 형식
  weddingTime?: string; // "HH:mm" 형식
  weddingHall?: string;
  venueAddress?: string;
  accountMessage?: string;
  groomName?: string;
  groomPhone?: string;
  groomFatherName?: string;
  groomMotherName?: string;
  groomAccount?: string;
  brideName?: string;
  bridePhone?: string;
  brideFatherName?: string;
  brideMotherName?: string;
  brideAccount?: string;
}

// 청첩장 응답 타입 (백엔드 InvitationResponse와 일치)
export interface InvitationResponse {
  invitationId: number; // 백엔드에서 invitationId로 반환
  coupleId: number;
  title: string;
  invitationMessage?: string;
  weddingDate: string; // "yyyy-MM-dd" 형식 (LocalDate)
  weddingTime: string; // "HH:mm:ss" 형식 (LocalTime)
  weddingHall: string;
  venueAddress: string;
  mainImageUrl?: string;
  accountMessage?: string;
  totalViews: number;
  isRepresentative: boolean;
  createdAt: string; // ISO 8601 형식 (LocalDateTime)
  updatedAt: string; // ISO 8601 형식 (LocalDateTime)
  groomName: string;
  groomPhone?: string;
  groomFatherName?: string;
  groomMotherName?: string;
  groomAccount?: string;
  brideName: string;
  bridePhone?: string;
  brideFatherName?: string;
  brideMotherName?: string;
  brideAccount?: string;
}

// 공개 청첩장 응답 타입 (InvitationResponse와 동일)
export interface PublicInvitationResponse extends InvitationResponse {}

// 청첩장 목록 응답 타입 (백엔드에서 List<InvitationResponse>를 직접 반환)
export type InvitationListResponse = InvitationResponse[];

// 청첩장 API 함수들
export const invitationApi = {
  // 청첩장 목록 조회
  async getInvitations() {
    return apiClient.get<InvitationListResponse>('/api/invitations');
  },

  // 청첩장 상세 조회
  async getInvitation(id: number) {
    return apiClient.get<InvitationResponse>(`/api/invitations/${id}`);
  },

  // 청첩장 생성 (multipart/form-data 방식으로 수정)
  async createInvitation(data: CreateInvitationRequest, mainImage?: File) {
    // request를 data 객체에 포함
    const formData = { request: JSON.stringify(data) };
    
    // mainImage가 있을 때만 files 객체에 포함
    const files = mainImage ? { mainImage } : undefined;
    
    return apiClient.postMultipart<InvitationResponse>('/api/invitations', formData, files);
  },

  // 청첩장 수정 (multipart/form-data 방식으로 수정)
  async updateInvitation(id: number, data: UpdateInvitationRequest, mainImage?: File) {
    // request를 data 객체에 포함
    const formData = { request: JSON.stringify(data) };
    
    // mainImage가 있을 때만 files 객체에 포함
    const files = mainImage ? { mainImage } : undefined;
    
    return apiClient.putMultipart<InvitationResponse>(`/api/invitations/${id}`, formData, files);
  },

  // 청첩장 삭제
  async deleteInvitation(id: number) {
    return apiClient.delete(`/api/invitations/${id}`);
  },

  // 대표 청첩장 설정
  async setRepresentative(id: number) {
    return apiClient.put(`/api/invitations/${id}/representative`);
  },

  // 공개 청첩장 조회
  async getPublicInvitation(coupleSlug: string) {
    return apiClient.get<PublicInvitationResponse>(`/api/invitations/public/${coupleSlug}`);
  },

  // 내 청첩장 미리보기 (사용자 정보에서 coupleSlug 가져와서 조회)
  async getMyInvitationPreview() {
    // 1. 사용자 정보 조회하여 coupleSlug 가져오기
    const userInfo = await apiClient.getUserInfo();
    if (!userInfo.success || !userInfo.data?.coupleSlug) {
      throw new Error('커플 정보를 찾을 수 없습니다.');
    }
    
    // 2. coupleSlug로 공개 청첩장 조회
    return this.getPublicInvitation(userInfo.data.coupleSlug);
  },

  // 메인 이미지 업로드
  async uploadMainImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<string>('/api/invitations/main-image', formData);
  },

  // 메인 이미지 삭제
  async deleteMainImage() {
    return apiClient.delete('/api/invitations/main-image');
  }
};
