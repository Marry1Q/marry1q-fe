import { InvitationResponse, CreateInvitationRequest, UpdateInvitationRequest } from '../api/invitationApi';
import { Invitation } from '../types';

// 백엔드 API 응답을 프론트엔드 타입으로 변환
export const mapApiResponseToInvitation = (apiResponse: InvitationResponse): Invitation => {
  // 시간 형식 변환 (HH:mm:ss -> HH:mm)
  const formatWeddingTime = (timeStr: string) => {
    if (!timeStr) return '';
    return timeStr.substring(0, 5); // HH:mm:ss에서 HH:mm만 추출
  };

  return {
    // 기본 정보 (백엔드와 일치)
    id: apiResponse.invitationId, // invitationId를 id로 매핑
    coupleId: apiResponse.coupleId,
    title: apiResponse.title,
    invitationMessage: apiResponse.invitationMessage,
    weddingDate: apiResponse.weddingDate,
    weddingTime: formatWeddingTime(apiResponse.weddingTime),
    weddingHall: apiResponse.weddingHall,
    venueAddress: apiResponse.venueAddress,
    mainImageUrl: apiResponse.mainImageUrl,
    accountMessage: apiResponse.accountMessage,
    totalViews: apiResponse.totalViews || 0, // 백엔드에서 제공하는 조회수 사용
    isRepresentative: apiResponse.isRepresentative,
    createdAt: apiResponse.createdAt,
    updatedAt: apiResponse.updatedAt,
    
    // 신랑 정보
    groomName: apiResponse.groomName,
    groomPhone: apiResponse.groomPhone,
    groomFatherName: apiResponse.groomFatherName,
    groomMotherName: apiResponse.groomMotherName,
    groomAccount: apiResponse.groomAccount,
    
    // 신부 정보
    brideName: apiResponse.brideName,
    bridePhone: apiResponse.bridePhone,
    brideFatherName: apiResponse.brideFatherName,
    brideMotherName: apiResponse.brideMotherName,
    brideAccount: apiResponse.brideAccount,
    
    // 프론트엔드 전용 필드들 (기본값 설정)
    status: '완료', // 기본값, API에서 제공하지 않음
    views: apiResponse.totalViews || 0, // totalViews와 동일하게 설정
    todayViews: apiResponse.totalViews || 0, // 임시로 totalViews 사용 (백엔드에서 todayViews 제공 시 변경 필요)
    template: '기본', // API에서 제공하지 않음
    isPrimary: apiResponse.isRepresentative, // 호환성을 위해 유지
    
    // 편의를 위한 파생 필드들
    groomParents: `${apiResponse.groomFatherName || ''} · ${apiResponse.groomMotherName || ''}`.trim(),
    brideParents: `${apiResponse.brideFatherName || ''} · ${apiResponse.brideMotherName || ''}`.trim(),
    venue: apiResponse.weddingHall,
    weddingLocation: apiResponse.weddingHall,
    message: apiResponse.invitationMessage || '',
    
    // 부모님 상세 정보 (편의를 위한 구조화)
    groomParentsDetail: {
      father: apiResponse.groomFatherName || '',
      mother: apiResponse.groomMotherName || '',
    },
    brideParentsDetail: {
      father: apiResponse.brideFatherName || '',
      mother: apiResponse.brideMotherName || '',
    },
    
    // 연락처 정보 (편의를 위한 구조화)
    contact: {
      groom: apiResponse.groomPhone || '',
      bride: apiResponse.bridePhone || '',
    },
    
    // 계좌 정보 (편의를 위한 구조화) - 백엔드 필드와 정확히 매핑
    accountInfo: {
      groom: {
        name: apiResponse.groomName,
        accountNumber: apiResponse.groomAccount || '', // groomAccount 필드 사용
        bankName: '', // 사용하지 않음 (계좌번호에 포함)
        fieldId: 'groom-account'
      },
      bride: {
        name: apiResponse.brideName,
        accountNumber: apiResponse.brideAccount || '', // brideAccount 필드 사용
        bankName: '', // 사용하지 않음 (계좌번호에 포함)
        fieldId: 'bride-account'
      }
    },
    
    // UI 관련 필드들 (기본값 설정)
    uploadedPhotos: [],
    selectedTemplate: 1,
    selectedColor: '#F0426B',
    shareImage: apiResponse.mainImageUrl, // mainImageUrl과 일치하도록 수정
  };
};

// 프론트엔드 타입을 백엔드 생성 요청으로 변환
export const mapInvitationToCreateRequest = async (invitation: Partial<Invitation>): Promise<CreateInvitationRequest> => {
  // coupleId는 백엔드에서 토큰에서 자동으로 가져오므로 제거
  return {
    title: invitation.title || '',
    invitationMessage: invitation.invitationMessage || invitation.message,
    weddingDate: invitation.weddingDate || '',
    weddingTime: invitation.weddingTime || '',
    weddingHall: invitation.weddingHall || invitation.venue || '',
    venueAddress: invitation.venueAddress || '',
    accountMessage: invitation.accountMessage || '',
    groomName: invitation.groomName || '',
    groomPhone: invitation.groomPhone || invitation.contact?.groom || '',
    groomFatherName: invitation.groomFatherName || invitation.groomParentsDetail?.father || '',
    groomMotherName: invitation.groomMotherName || invitation.groomParentsDetail?.mother || '',
    groomAccount: invitation.groomAccount || invitation.accountInfo?.groom?.accountNumber || '', // 계좌번호 매핑 수정
    brideName: invitation.brideName || '',
    bridePhone: invitation.bridePhone || invitation.contact?.bride || '',
    brideFatherName: invitation.brideFatherName || invitation.brideParentsDetail?.father || '',
    brideMotherName: invitation.brideMotherName || invitation.brideParentsDetail?.mother || '',
    brideAccount: invitation.brideAccount || invitation.accountInfo?.bride?.accountNumber || '', // 계좌번호 매핑 수정
  };
};

// 프론트엔드 타입을 백엔드 수정 요청으로 변환
export const mapInvitationToUpdateRequest = async (invitation: Partial<Invitation>): Promise<UpdateInvitationRequest> => {
  return {
    title: invitation.title,
    invitationMessage: invitation.invitationMessage || invitation.message,
    weddingDate: invitation.weddingDate,
    weddingTime: invitation.weddingTime,
    weddingHall: invitation.weddingHall || invitation.venue,
    venueAddress: invitation.venueAddress,
    accountMessage: invitation.accountMessage,
    groomName: invitation.groomName,
    groomPhone: invitation.groomPhone || invitation.contact?.groom,
    groomFatherName: invitation.groomFatherName || invitation.groomParentsDetail?.father,
    groomMotherName: invitation.groomMotherName || invitation.groomParentsDetail?.mother,
    groomAccount: invitation.groomAccount || invitation.accountInfo?.groom?.accountNumber, // 계좌번호 매핑 수정
    brideName: invitation.brideName,
    bridePhone: invitation.bridePhone || invitation.contact?.bride,
    brideFatherName: invitation.brideFatherName || invitation.brideParentsDetail?.father,
    brideMotherName: invitation.brideMotherName || invitation.brideParentsDetail?.mother,
    brideAccount: invitation.brideAccount || invitation.accountInfo?.bride?.accountNumber, // 계좌번호 매핑 수정
  };
};

// 기존 함수명 호환성을 위한 별칭
export const mapInvitationToApiRequest = mapInvitationToCreateRequest;
