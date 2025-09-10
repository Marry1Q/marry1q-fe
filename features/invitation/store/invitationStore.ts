import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  invitationApi, 
  InvitationResponse, 
  CreateInvitationRequest, 
  UpdateInvitationRequest 
} from '../api/invitationApi';
import { Invitation } from '../types';
import { mapApiResponseToInvitation } from '../utils/invitationMapper';
import { toast } from 'sonner';

interface InvitationState {
  // 상태
  invitations: Invitation[];
  currentInvitation: Invitation | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;

  // 액션
  fetchInvitations: () => Promise<void>;
  fetchInvitation: (id: number) => Promise<void>;
  createInvitation: (data: CreateInvitationRequest, mainImage?: File) => Promise<boolean>;
  updateInvitation: (id: number, data: UpdateInvitationRequest) => Promise<boolean>;
  deleteInvitation: (id: number) => Promise<boolean>;
  setRepresentative: (id: number) => Promise<boolean>;
  uploadMainImage: (id: number, file: File) => Promise<boolean>;
  deleteMainImage: (id: number) => Promise<boolean>;
  clearError: () => void;
  resetState: () => void;
}

const initialState = {
  invitations: [] as Invitation[],
  currentInvitation: null as Invitation | null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

export const useInvitationStore = create<InvitationState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // 청첩장 목록 조회
      fetchInvitations: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await invitationApi.getInvitations();
          
          console.log('API Response:', response); // 디버깅용 로그
          
          if (response.success && response.data) {
            // 백엔드에서 List<InvitationResponse>를 직접 반환
            const invitations = Array.isArray(response.data) ? response.data : [];
            set({ 
              invitations: invitations.map(mapApiResponseToInvitation),
              isLoading: false 
            });
          } else {
            set({ 
              error: response.error?.message || '청첩장 목록을 불러오는데 실패했습니다.',
              isLoading: false 
            });
            toast.error('청첩장 목록을 불러오는데 실패했습니다.');
          }
        } catch (error) {
          console.error('Fetch invitations error:', error);
          set({ 
            error: '청첩장 목록을 불러오는데 실패했습니다.',
            isLoading: false 
          });
          toast.error('청첩장 목록을 불러오는데 실패했습니다.');
        }
      },

      // 청첩장 상세 조회
      fetchInvitation: async (id: number) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await invitationApi.getInvitation(id);
          
          if (response.success && response.data) {
            set({ 
              currentInvitation: mapApiResponseToInvitation(response.data),
              isLoading: false 
            });
          } else {
            set({ 
              error: response.error?.message || '청첩장을 불러오는데 실패했습니다.',
              isLoading: false 
            });
            toast.error('청첩장을 불러오는데 실패했습니다.');
          }
        } catch (error) {
          console.error('Fetch invitation error:', error);
          set({ 
            error: '청첩장을 불러오는데 실패했습니다.',
            isLoading: false 
          });
          toast.error('청첩장을 불러오는데 실패했습니다.');
        }
      },

      // 청첩장 생성
      createInvitation: async (data: CreateInvitationRequest, mainImage?: File) => {
        set({ isCreating: true, error: null });
        
        try {
          // 백엔드 API에 맞게 multipart/form-data로 한 번에 전송
          const response = await invitationApi.createInvitation(data, mainImage);
          
          if (response.success && response.data) {
            const newInvitation = mapApiResponseToInvitation(response.data);
            set(state => ({
              invitations: [newInvitation, ...state.invitations],
              isCreating: false
            }));
            return true;
          } else {
            set({ 
              error: response.error?.message || '청첩장 생성에 실패했습니다.',
              isCreating: false 
            });
            return false;
          }
        } catch (error) {
          console.error('Create invitation error:', error);
          set({ 
            error: '청첩장 생성에 실패했습니다.',
            isCreating: false 
          });
          return false;
        }
      },

      // 청첩장 수정
      updateInvitation: async (id: number, data: UpdateInvitationRequest) => {
        set({ isUpdating: true, error: null });
        
        try {
          const response = await invitationApi.updateInvitation(id, data);
          
          if (response.success && response.data) {
            const updatedInvitation = mapApiResponseToInvitation(response.data);
            set(state => ({
              invitations: state.invitations.map(inv => 
                inv.id === id ? updatedInvitation : inv
              ),
              currentInvitation: state.currentInvitation?.id === id ? updatedInvitation : state.currentInvitation,
              isUpdating: false
            }));
            toast.success('청첩장이 수정되었습니다.');
            return true;
          } else {
            set({ 
              error: response.error?.message || '청첩장 수정에 실패했습니다.',
              isUpdating: false 
            });
            toast.error('청첩장 수정에 실패했습니다.');
            return false;
          }
        } catch (error) {
          console.error('Update invitation error:', error);
          set({ 
            error: '청첩장 수정에 실패했습니다.',
            isUpdating: false 
          });
          toast.error('청첩장 수정에 실패했습니다.');
          return false;
        }
      },

      // 청첩장 삭제
      deleteInvitation: async (id: number) => {
        set({ isDeleting: true, error: null });
        
        try {
          const response = await invitationApi.deleteInvitation(id);
          
          if (response.success) {
            set(state => ({
              invitations: state.invitations.filter(inv => inv.id !== id),
              currentInvitation: state.currentInvitation?.id === id ? null : state.currentInvitation,
              isDeleting: false
            }));
            return true;
          } else {
            set({ 
              error: response.error?.message || '청첩장 삭제에 실패했습니다.',
              isDeleting: false 
            });
            return false;
          }
        } catch (error) {
          console.error('Delete invitation error:', error);
          set({ 
            error: '청첩장 삭제에 실패했습니다.',
            isDeleting: false 
          });
          return false;
        }
      },

      // 대표 청첩장 설정
      setRepresentative: async (id: number) => {
        set({ isUpdating: true, error: null });
        
        try {
          const response = await invitationApi.setRepresentative(id);
          
          if (response.success) {
            // 모든 청첩장의 isRepresentative를 false로 설정하고, 선택된 청첩장만 true로 설정
            set(state => ({
              invitations: state.invitations.map(inv => ({
                ...inv,
                isRepresentative: inv.id === id,
                isPrimary: inv.id === id // 호환성을 위해 isPrimary도 함께 설정
              })),
              currentInvitation: state.currentInvitation ? {
                ...state.currentInvitation,
                isRepresentative: state.currentInvitation.id === id,
                isPrimary: state.currentInvitation.id === id
              } : null,
              isUpdating: false
            }));
            return true;
          } else {
            set({ 
              error: response.error?.message || '대표 청첩장 설정에 실패했습니다.',
              isUpdating: false 
            });
            return false;
          }
        } catch (error) {
          console.error('Set representative error:', error);
          set({ 
            error: '대표 청첩장 설정에 실패했습니다.',
            isUpdating: false 
          });
          return false;
        }
      },

      // 메인 이미지 업로드
      uploadMainImage: async (id: number, file: File) => {
        set({ isUpdating: true, error: null });
        
        try {
          const response = await invitationApi.uploadMainImage(file);
          
          if (response.success && response.data) {
            const imageUrl = response.data; // response.data가 직접 URL 문자열
            set(state => ({
              invitations: state.invitations.map(inv => 
                inv.id === id ? { ...inv, mainImageUrl: imageUrl } : inv
              ),
              currentInvitation: state.currentInvitation?.id === id 
                ? { ...state.currentInvitation, mainImageUrl: imageUrl }
                : state.currentInvitation,
              isUpdating: false
            }));
            toast.success('이미지가 업로드되었습니다.');
            return true;
          } else {
            set({ 
              error: response.error?.message || '이미지 업로드에 실패했습니다.',
              isUpdating: false 
            });
            toast.error('이미지 업로드에 실패했습니다.');
            return false;
          }
        } catch (error) {
          console.error('Upload main image error:', error);
          set({ 
            error: '이미지 업로드에 실패했습니다.',
            isUpdating: false 
          });
          toast.error('이미지 업로드에 실패했습니다.');
          return false;
        }
      },

      // 메인 이미지 삭제
      deleteMainImage: async (id: number) => {
        set({ isUpdating: true, error: null });
        
        try {
          const response = await invitationApi.deleteMainImage();
          
          if (response.success) {
            set(state => ({
              invitations: state.invitations.map(inv => 
                inv.id === id ? { ...inv, mainImageUrl: undefined } : inv
              ),
              currentInvitation: state.currentInvitation?.id === id 
                ? { ...state.currentInvitation, mainImageUrl: undefined }
                : state.currentInvitation,
              isUpdating: false
            }));
            toast.success('이미지가 삭제되었습니다.');
            return true;
          } else {
            set({ 
              error: response.error?.message || '이미지 삭제에 실패했습니다.',
              isUpdating: false 
            });
            toast.error('이미지 삭제에 실패했습니다.');
            return false;
          }
        } catch (error) {
          console.error('Delete main image error:', error);
          set({ 
            error: '이미지 삭제에 실패했습니다.',
            isUpdating: false 
          });
          toast.error('이미지 삭제에 실패했습니다.');
          return false;
        }
      },

      // 에러 초기화
      clearError: () => set({ error: null }),

      // 상태 초기화
      resetState: () => set(initialState),
    }),
    {
      name: 'invitation-store',
    }
  )
);
