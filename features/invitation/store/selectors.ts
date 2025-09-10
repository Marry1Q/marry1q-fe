import { useInvitationStore } from './invitationStore';

// 기본 상태 선택자들
export const useInvitations = () => useInvitationStore(state => state.invitations);
export const useCurrentInvitation = () => useInvitationStore(state => state.currentInvitation);
export const useIsLoading = () => useInvitationStore(state => state.isLoading);
export const useIsCreating = () => useInvitationStore(state => state.isCreating);
export const useIsUpdating = () => useInvitationStore(state => state.isUpdating);
export const useIsDeleting = () => useInvitationStore(state => state.isDeleting);
export const useError = () => useInvitationStore(state => state.error);

// 액션 선택자들 - 개별 함수로 분리하여 무한 루프 방지
export const useFetchInvitations = () => useInvitationStore(state => state.fetchInvitations);
export const useFetchInvitation = () => useInvitationStore(state => state.fetchInvitation);
export const useCreateInvitation = () => useInvitationStore(state => state.createInvitation);
export const useUpdateInvitation = () => useInvitationStore(state => state.updateInvitation);
export const useDeleteInvitation = () => useInvitationStore(state => state.deleteInvitation);
export const useSetRepresentative = () => useInvitationStore(state => state.setRepresentative);
export const useUploadMainImage = () => useInvitationStore(state => state.uploadMainImage);
export const useDeleteMainImage = () => useInvitationStore(state => state.deleteMainImage);
export const useClearError = () => useInvitationStore(state => state.clearError);
export const useResetState = () => useInvitationStore(state => state.resetState);

// 모든 액션을 한 번에 가져오는 선택자 (필요한 경우에만 사용)
export const useInvitationActions = () => useInvitationStore(state => ({
  fetchInvitations: state.fetchInvitations,
  fetchInvitation: state.fetchInvitation,
  createInvitation: state.createInvitation,
  updateInvitation: state.updateInvitation,
  deleteInvitation: state.deleteInvitation,
  setRepresentative: state.setRepresentative,
  uploadMainImage: state.uploadMainImage,
  deleteMainImage: state.deleteMainImage,
  clearError: state.clearError,
  resetState: state.resetState,
}));

// 파생 상태 선택자들
export const useInvitationCount = () => useInvitationStore(state => state.invitations.length);

export const useInvitationById = (id: number) => 
  useInvitationStore(state => state.invitations.find(inv => inv.id === id));

export const useHasInvitations = () => 
  useInvitationStore(state => state.invitations.length > 0);

export const useInvitationStats = () => 
  useInvitationStore(state => {
    const invitations = state.invitations;
    const total = invitations.length;
    const withImages = invitations.filter(inv => inv.mainImageUrl).length;
    const withoutImages = total - withImages;
    
    return {
      total,
      withImages,
      withoutImages,
      imagePercentage: total > 0 ? Math.round((withImages / total) * 100) : 0
    };
  });

// 로딩 상태 통합 선택자
export const useAnyLoading = () => 
  useInvitationStore(state => 
    state.isLoading || state.isCreating || state.isUpdating || state.isDeleting
  );
