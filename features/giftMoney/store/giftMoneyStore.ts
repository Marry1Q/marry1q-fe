import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  giftMoneyApi, 
  CreateGiftMoneyRequest, 
  UpdateGiftMoneyRequest,
  UpdateThanksStatusRequest
} from '../api/giftMoneyApi';
import { GiftMoney, GiftMoneySummary, GiftMoneyStatistics, PaginationInfo, FetchGiftMoneyParams } from '../types';
import { 
  mapGiftMoneyListApiResponse, 
  mapGiftMoneySummaryApiResponse, 
  mapGiftMoneyStatisticsApiResponse 
} from '../utils/giftMoneyMapper';
import { toast } from 'sonner';
import { colors } from '@/constants/colors';



interface GiftMoneyState {
  // 상태
  giftMoneyList: GiftMoney[];
  summaryStatistics: GiftMoneySummary | null;
  fullStatistics: GiftMoneyStatistics | null;
  pagination: PaginationInfo;
  isLoading: boolean;
  isStatisticsLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;

  // 액션
  fetchGiftMoneyList: (params?: FetchGiftMoneyParams) => Promise<void>;
  fetchSummaryStatistics: () => Promise<void>;
  fetchFullStatistics: () => Promise<void>;
  createGiftMoney: (data: CreateGiftMoneyRequest) => Promise<boolean>;
  updateGiftMoney: (id: number, data: UpdateGiftMoneyRequest) => Promise<boolean>;
  deleteGiftMoney: (id: number) => Promise<boolean>;
  updateThanksStatus: (id: number, data: UpdateThanksStatusRequest) => Promise<boolean>;
  clearError: () => void;
  resetState: () => void;
}

const initialState = {
  giftMoneyList: [] as GiftMoney[],
  summaryStatistics: null as GiftMoneySummary | null,
  fullStatistics: null as GiftMoneyStatistics | null,
  pagination: {
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    size: 10,
    first: true,
    last: true,
  } as PaginationInfo,
  isLoading: false,
  isStatisticsLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

export const useGiftMoneyStore = create<GiftMoneyState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // 축의금 목록 조회
      fetchGiftMoneyList: async (params?: FetchGiftMoneyParams) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🎁 축의금 목록 API 호출 시작');
          const response = await giftMoneyApi.getGiftMoneyList(params);
          
          console.log('📥 축의금 목록 API 원본 응답:', response);
          
          if (response.success && response.data) {
            const { giftMoneyList, pagination } = mapGiftMoneyListApiResponse(response.data);
            set({ 
              giftMoneyList,
              pagination,
              isLoading: false 
            });
          } else {
            set({ 
              error: response.error?.message || '축의금 목록을 불러오는데 실패했습니다.',
              isLoading: false 
            });
            toast.error('축의금 목록을 불러오는데 실패했습니다.', {
              style: {
                background: colors.danger.light,
                color: colors.danger.main,
                border: `1px solid ${colors.danger.main}`,
                fontFamily: "Hana2-Medium",
              },
            });
          }
        } catch (error) {
          console.error('Fetch gift money list error:', error);
          set({ 
            error: '축의금 목록을 불러오는데 실패했습니다.',
            isLoading: false 
          });
          toast.error('축의금 목록을 불러오는데 실패했습니다.', {
            style: {
              background: colors.danger.light,
              color: colors.danger.main,
              border: `1px solid ${colors.danger.main}`,
              fontFamily: "Hana2-Medium",
            },
          });
        }
      },

      // 요약 통계 조회
      fetchSummaryStatistics: async () => {
        console.log('🚀 fetchSummaryStatistics 함수 호출됨');
        
        // 인증 상태 확인
        const accessToken = localStorage.getItem('accessToken');
        console.log('🔐 인증 토큰 존재 여부:', !!accessToken);
        
        set({ isStatisticsLoading: true, error: null });
        
        try {
          console.log('📊 축의금 요약 통계 API 호출 시작');
          console.log('🔗 API 엔드포인트: /api/gift-money/statistics/summary');
          const response = await giftMoneyApi.getSummaryStatistics();
          
          console.log('📥 축의금 요약 통계 API 원본 응답:', response);
          
          if (response.success && response.data) {
            console.log('📊 축의금 요약 통계 API 데이터:', response.data);
            const summaryStatistics = mapGiftMoneySummaryApiResponse(response.data);
            console.log('🔄 변환된 요약 통계 데이터:', summaryStatistics);
            set({ 
              summaryStatistics,
              isStatisticsLoading: false 
            });
            console.log('✅ 요약 통계 저장 완료');
          } else {
            console.error('❌ 축의금 요약 통계 API 실패:', response.error);
            set({ 
              error: response.error?.message || '축의금 통계를 불러오는데 실패했습니다.',
              isStatisticsLoading: false 
            });
            toast.error('축의금 통계를 불러오는데 실패했습니다.', {
              style: {
                background: colors.danger.light,
                color: colors.danger.main,
                border: `1px solid ${colors.danger.main}`,
                fontFamily: "Hana2-Medium",
              },
            });
          }
        } catch (error) {
          console.error('❌ Fetch summary statistics error:', error);
          set({ 
            error: '축의금 통계를 불러오는데 실패했습니다.',
            isStatisticsLoading: false 
          });
          toast.error('축의금 통계를 불러오는데 실패했습니다.', {
            style: {
              background: colors.danger.light,
              color: colors.danger.main,
              border: `1px solid ${colors.danger.main}`,
              fontFamily: "Hana2-Medium",
            },
          });
        }
      },

      // 전체 통계 조회
      fetchFullStatistics: async () => {
        set({ isStatisticsLoading: true, error: null });
        
        try {
          console.log('📈 축의금 전체 통계 API 호출 시작');
          const response = await giftMoneyApi.getFullStatistics();
          
          if (response.success && response.data) {
            const fullStatistics = mapGiftMoneyStatisticsApiResponse(response.data);
            set({ 
              fullStatistics,
              isStatisticsLoading: false 
            });
          } else {
            set({ 
              error: response.error?.message || '축의금 통계를 불러오는데 실패했습니다.',
              isStatisticsLoading: false 
            });
            toast.error('축의금 통계를 불러오는데 실패했습니다.', {
              style: {
                background: colors.danger.light,
                color: colors.danger.main,
                border: `1px solid ${colors.danger.main}`,
                fontFamily: "Hana2-Medium",
              },
            });
          }
        } catch (error) {
          console.error('Fetch full statistics error:', error);
          set({ 
            error: '축의금 통계를 불러오는데 실패했습니다.',
            isStatisticsLoading: false 
          });
          toast.error('축의금 통계를 불러오는데 실패했습니다.', {
            style: {
              background: colors.danger.light,
              color: colors.danger.main,
              border: `1px solid ${colors.danger.main}`,
              fontFamily: "Hana2-Medium",
            },
          });
        }
      },

      // 축의금 생성
      createGiftMoney: async (data: CreateGiftMoneyRequest) => {
        set({ isCreating: true, error: null });
        
        try {
          const response = await giftMoneyApi.createGiftMoney(data);
          
          if (response.success) {
            toast.success('축의금이 성공적으로 등록되었습니다.', {
              style: {
                background: colors.primary.toastBg,
                color: colors.primary.main,
                border: `1px solid ${colors.primary.main}`,
                fontFamily: "Hana2-Medium",
              },
            });
            
            // 통계 새로고침은 페이지 레벨에서 처리
            set({ isCreating: false });
            return true;
          } else {
            set({ 
              error: response.error?.message || '축의금 등록에 실패했습니다.',
              isCreating: false 
            });
            toast.error('축의금 등록에 실패했습니다.', {
              style: {
                background: colors.danger.light,
                color: colors.danger.main,
                border: `1px solid ${colors.danger.main}`,
                fontFamily: "Hana2-Medium",
              },
            });
            return false;
          }
        } catch (error) {
          console.error('Create gift money error:', error);
          set({ 
            error: '축의금 등록에 실패했습니다.',
            isCreating: false 
          });
          toast.error('축의금 등록에 실패했습니다.', {
            style: {
              background: colors.danger.light,
              color: colors.danger.main,
              border: `1px solid ${colors.danger.main}`,
              fontFamily: "Hana2-Medium",
            },
          });
          return false;
        }
      },

      // 축의금 수정
      updateGiftMoney: async (id: number, data: UpdateGiftMoneyRequest) => {
        set({ isUpdating: true, error: null });
        
        try {
          const response = await giftMoneyApi.updateGiftMoney(id, data);
          
          if (response.success) {
            toast.success('축의금이 성공적으로 수정되었습니다.', {
              style: {
                background: colors.primary.toastBg,
                color: colors.primary.main,
                border: `1px solid ${colors.primary.main}`,
                fontFamily: "Hana2-Medium",
              },
            });
            
            // 통계 새로고침은 페이지 레벨에서 처리
            set({ isUpdating: false });
            return true;
          } else {
            set({ 
              error: response.error?.message || '축의금 수정에 실패했습니다.',
              isUpdating: false 
            });
            toast.error('축의금 수정에 실패했습니다.', {
              style: {
                background: colors.danger.light,
                color: colors.danger.main,
                border: `1px solid ${colors.danger.main}`,
                fontFamily: "Hana2-Medium",
              },
            });
            return false;
          }
        } catch (error) {
          console.error('Update gift money error:', error);
          set({ 
            error: '축의금 수정에 실패했습니다.',
            isUpdating: false 
          });
          toast.error('축의금 수정에 실패했습니다.', {
            style: {
              background: colors.danger.light,
              color: colors.danger.main,
              border: `1px solid ${colors.danger.main}`,
              fontFamily: "Hana2-Medium",
            },
          });
          return false;
        }
      },

      // 축의금 삭제
      deleteGiftMoney: async (id: number) => {
        set({ isDeleting: true, error: null });
        
        try {
          const response = await giftMoneyApi.deleteGiftMoney(id);
          
          if (response.success) {
            toast.success('축의금이 성공적으로 삭제되었습니다.', {
              style: {
                background: colors.primary.toastBg,
                color: colors.primary.main,
                border: `1px solid ${colors.primary.main}`,
                fontFamily: "Hana2-Medium",
              },
            });
            
            // 통계 새로고침은 페이지 레벨에서 처리
            set({ isDeleting: false });
            return true;
          } else {
            set({ 
              error: response.error?.message || '축의금 삭제에 실패했습니다.',
              isDeleting: false 
            });
            toast.error('축의금 삭제에 실패했습니다.', {
              style: {
                background: colors.danger.light,
                color: colors.danger.main,
                border: `1px solid ${colors.danger.main}`,
                fontFamily: "Hana2-Medium",
              },
            });
            return false;
          }
        } catch (error) {
          console.error('Delete gift money error:', error);
          set({ 
            error: '축의금 삭제에 실패했습니다.',
            isDeleting: false 
          });
          toast.error('축의금 삭제에 실패했습니다.', {
            style: {
              background: colors.danger.light,
              color: colors.danger.main,
              border: `1px solid ${colors.danger.main}`,
              fontFamily: "Hana2-Medium",
            },
          });
          return false;
        }
      },

      // 감사 연락 상태 변경
      updateThanksStatus: async (id: number, data: UpdateThanksStatusRequest) => {
        set({ isUpdating: true, error: null });
        
        try {
          const response = await giftMoneyApi.updateThanksStatus(id, data);
          
          if (response.success) {
            toast.success('감사 연락 상태가 성공적으로 변경되었습니다.', {
              style: {
                background: colors.primary.toastBg,
                color: colors.primary.main,
                border: `1px solid ${colors.primary.main}`,
                fontFamily: "Hana2-Medium",
              },
            });
            
            // 목록에서 해당 항목만 업데이트 (실시간 통계는 selector에서 자동 계산)
            set(state => ({
              giftMoneyList: state.giftMoneyList.map(item => 
                item.id === id ? { ...item, ...response.data } : item
              ),
              isUpdating: false
            }));
            
            return true;
          } else {
            set({ 
              error: response.error?.message || '감사 연락 상태 변경에 실패했습니다.',
              isUpdating: false 
            });
            toast.error('감사 연락 상태 변경에 실패했습니다.', {
              style: {
                background: colors.danger.light,
                color: colors.danger.main,
                border: `1px solid ${colors.danger.main}`,
                fontFamily: "Hana2-Medium",
              },
            });
            return false;
          }
        } catch (error) {
          console.error('Update thanks status error:', error);
          set({ 
            error: '감사 연락 상태 변경에 실패했습니다.',
            isUpdating: false 
          });
          toast.error('감사 연락 상태 변경에 실패했습니다.', {
            style: {
              background: colors.danger.light,
              color: colors.danger.main,
              border: `1px solid ${colors.danger.main}`,
              fontFamily: "Hana2-Medium",
            },
          });
          return false;
        }
      },

      // 에러 초기화
      clearError: () => {
        set({ error: null });
      },

      // 상태 초기화
      resetState: () => {
        set(initialState);
      },
    }),
    {
      name: 'gift-money-store',
    }
  )
);
