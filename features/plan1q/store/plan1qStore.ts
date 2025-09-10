import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { plan1qApi } from '../api/plan1qApi';
import { accountApi, ProductPaymentInfoResponse } from '@/features/account/api/accountApi';
import {
  mapInvestmentQuestionsResponse,
  mapInvestmentProfileResponse,
  mapTemplatesResponse,
} from '../utils/plan1qMapper';
import {
  InvestmentQuestion,
  InvestmentProfile,
  InvestmentProfileSubmitRequest,
  Plan1QTemplate,
  Plan1QGoalDetailResponse,
} from '../types';
import { showSuccessToast, showErrorToast } from '@/components/ui/toast';

interface Plan1QState {
  // 상태
  investmentQuestions: InvestmentQuestion[];
  investmentProfile: InvestmentProfile | null;
  templates: Plan1QTemplate[];
  goals: Plan1QGoalDetailResponse[];
  currentGoal: Plan1QGoalDetailResponse | null;
  productPaymentInfo: ProductPaymentInfoResponse[];
  isLoading: boolean;
  isQuestionsLoading: boolean;
  isProfileLoading: boolean;
  isTemplatesLoading: boolean;
  isGoalsLoading: boolean;
  isGoalDetailLoading: boolean;
  isPaymentInfoLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // 토스트 중복 방지를 위한 상태
  lastToastMessage: string | null;
  lastToastTime: number | null;

  // 액션
  fetchInvestmentQuestions: () => Promise<void>;
  fetchInvestmentProfile: () => Promise<void>;
  fetchTemplates: () => Promise<void>;
  fetchGoals: () => Promise<void>;
  fetchGoalDetail: (goalId: number) => Promise<void>;
  fetchProductPaymentInfo: (toAccountNumber: string) => Promise<void>;
  fetchAllProductsPaymentInfo: (products: any[]) => Promise<void>;
  submitInvestmentProfile: (request: InvestmentProfileSubmitRequest) => Promise<boolean>;
  clearError: () => void;
  resetState: () => void;
}

const initialState = {
  investmentQuestions: [] as InvestmentQuestion[],
  investmentProfile: null as InvestmentProfile | null,
  templates: [] as Plan1QTemplate[],
  goals: [] as Plan1QGoalDetailResponse[],
  currentGoal: null as Plan1QGoalDetailResponse | null,
  productPaymentInfo: [] as ProductPaymentInfoResponse[],
  isLoading: false,
  isQuestionsLoading: false,
  isProfileLoading: false,
  isTemplatesLoading: false,
  isGoalsLoading: false,
  isGoalDetailLoading: false,
  isPaymentInfoLoading: false,
  isSubmitting: false,
  error: null,
  lastToastMessage: null,
  lastToastTime: null,
};

// 토스트 중복 방지 함수
const showToast = (type: 'success' | 'error', message: string, state: Plan1QState) => {
  const now = Date.now();
  const timeThreshold = 2000; // 2초 내 중복 방지
  
  // 같은 메시지이고 시간이 임계값 내에 있으면 토스트 표시하지 않음
  if (
    state.lastToastMessage === message &&
    state.lastToastTime &&
    now - state.lastToastTime < timeThreshold
  ) {
    return;
  }

  if (type === 'success') {
    showSuccessToast(message);
  } else {
    showErrorToast(message);
  }

  // 토스트 상태 업데이트
  return { lastToastMessage: message, lastToastTime: now };
};

export const usePlan1QStore = create<Plan1QState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // 투자성향 검사 질문 조회
      fetchInvestmentQuestions: async () => {
        set({ isQuestionsLoading: true, error: null });
        
        try {
          const response = await plan1qApi.getInvestmentQuestions();
          
          // 원본 API 응답 로그
          console.log('📥 투자성향 검사 질문 API 원본 응답:', response);
          
          if (response.success && response.data) {
            const questions = mapInvestmentQuestionsResponse(response);
            set({ 
              investmentQuestions: questions,
              isQuestionsLoading: false 
            });
            
            // 매핑된 결과 로그
            console.log('🔄 매핑된 투자성향 검사 질문:', {
              totalQuestions: questions.length,
              questions: questions.map(q => ({
                id: q.id,
                question: q.question,
                optionsCount: q.options.length
              }))
            });
          } else {
            const errorMessage = response.error?.message || '투자성향 검사 질문을 불러오는데 실패했습니다.';
            set({ 
              error: errorMessage,
              isQuestionsLoading: false 
            });
            showToast('error', errorMessage, get());
          }
        } catch (error) {
          console.error('Fetch investment questions error:', error);
          const errorMessage = '투자성향 검사 질문을 불러오는데 실패했습니다.';
          set({ 
            error: errorMessage,
            isQuestionsLoading: false 
          });
          showToast('error', errorMessage, get());
        }
      },

      // 투자성향 프로필 조회
      fetchInvestmentProfile: async () => {
        set({ isProfileLoading: true, error: null });
        
        try {
          console.log('📊 투자성향 프로필 API 호출 시작');
          const response = await plan1qApi.getInvestmentProfile();
          
          console.log('📥 투자성향 프로필 API 원본 응답:', response);
          
          if (response.success) {
            const profile = mapInvestmentProfileResponse(response);
            set({ 
              investmentProfile: profile,
              isProfileLoading: false 
            });
            console.log('💾 투자성향 프로필 Zustand Store 업데이트 완료');
          } else {
            const errorMessage = response.error?.message || '투자성향 프로필을 불러오는데 실패했습니다.';
            set({ 
              error: errorMessage,
              isProfileLoading: false 
            });
            showToast('error', errorMessage, get());
          }
        } catch (error) {
          console.error('Fetch investment profile error:', error);
          const errorMessage = '투자성향 프로필을 불러오는데 실패했습니다.';
          set({ 
            error: errorMessage,
            isProfileLoading: false 
          });
          showToast('error', errorMessage, get());
        }
      },

      // 투자성향 검사 결과 제출
      submitInvestmentProfile: async (request: InvestmentProfileSubmitRequest) => {
        set({ isSubmitting: true, error: null });
        
        try {
          console.log('📝 투자성향 검사 제출 API 호출 시작');
          const response = await plan1qApi.submitInvestmentProfile(request);
          
          console.log('📥 투자성향 검사 제출 API 원본 응답:', response);
          
          if (response.success && response.data) {
            const profile = mapInvestmentProfileResponse(response);
            const toastUpdate = showToast('success', '투자성향 검사가 완료되었습니다.', get());
            
            set({ 
              investmentProfile: profile,
              isSubmitting: false,
              ...toastUpdate
            });
            console.log('💾 투자성향 프로필 Zustand Store 업데이트 완료');
            return true;
          } else {
            const errorMessage = response.error?.message || '투자성향 검사 제출에 실패했습니다.';
            const toastUpdate = showToast('error', errorMessage, get());
            
            set({ 
              error: errorMessage,
              isSubmitting: false,
              ...toastUpdate
            });
            return false;
          }
        } catch (error) {
          console.error('Submit investment profile error:', error);
          const errorMessage = '투자성향 검사 제출에 실패했습니다.';
          const toastUpdate = showToast('error', errorMessage, get());
          
          set({ 
            error: errorMessage,
            isSubmitting: false,
            ...toastUpdate
          });
          return false;
        }
      },

      // Plan1Q 템플릿 목록 조회
      fetchTemplates: async () => {
        set({ isTemplatesLoading: true, error: null });
        
        try {
          console.log('📋 Plan1Q 템플릿 목록 API 호출 시작');
          const response = await plan1qApi.getTemplates();
          
          console.log('📥 Plan1Q 템플릿 목록 API 원본 응답:', response);
          
          if (response.success && response.data) {
            const templates = mapTemplatesResponse(response);
            set({ 
              templates,
              isTemplatesLoading: false 
            });
            console.log('💾 Plan1Q 템플릿 목록 Zustand Store 업데이트 완료');
          } else {
            const errorMessage = response.error?.message || 'Plan1Q 템플릿 목록을 불러오는데 실패했습니다.';
            set({ 
              error: errorMessage,
              isTemplatesLoading: false 
            });
            showToast('error', errorMessage, get());
          }
        } catch (error) {
          console.error('Fetch templates error:', error);
          const errorMessage = 'Plan1Q 템플릿 목록을 불러오는데 실패했습니다.';
          set({ 
            error: errorMessage,
            isTemplatesLoading: false 
          });
          showToast('error', errorMessage, get());
        }
      },

      // Plan1Q 목표 목록 조회
      fetchGoals: async () => {
        set({ isGoalsLoading: true, error: null });
        
        try {
          console.log('📋 Plan1Q 목표 목록 API 호출 시작');
          const response = await plan1qApi.getGoals();
          
          console.log('📥 Plan1Q 목표 목록 API 원본 응답:', response);
          
          if (response.success && response.data) {
            set({ 
              goals: response.data,
              isGoalsLoading: false 
            });
            console.log('💾 Plan1Q 목표 목록 Zustand Store 업데이트 완료');
          } else {
            const errorMessage = response.error?.message || 'Plan1Q 목표 목록을 불러오는데 실패했습니다.';
            set({ 
              error: errorMessage,
              isGoalsLoading: false 
            });
            showToast('error', errorMessage, get());
          }
        } catch (error) {
          console.error('Fetch goals error:', error);
          const errorMessage = 'Plan1Q 목표 목록을 불러오는데 실패했습니다.';
          set({ 
            error: errorMessage,
            isGoalsLoading: false 
          });
          showToast('error', errorMessage, get());
        }
      },

      // Plan1Q 목표 상세 조회
      fetchGoalDetail: async (goalId: number) => {
        set({ isGoalDetailLoading: true, error: null });
        
        try {
          const response = await plan1qApi.getGoalDetail(goalId);
          
          // 원본 API 응답 로그
          console.log('📥 Plan1Q 목표 상세 API 원본 응답:', response);
          
          if (response.success && response.data) {
            set({ 
              currentGoal: response.data,
              isGoalDetailLoading: false 
            });
            
            // 매핑된 결과 로그 (페이지에서 사용되는 형태)
            console.log('🔄 매핑된 데이터 (페이지 사용 형태):', {
              goalId: response.data.goalId,
              goalName: response.data.goalName,
              totalProducts: response.data.products.length,
              subscribedProducts: response.data.products.filter(p => p.subscribed).length,
              products: response.data.products.map(p => ({
                productName: p.productName,
                subscribed: p.subscribed,
                investmentRatio: p.investmentRatio,
                monthlyAmount: p.monthlyAmount,
                currentBalance: p.currentBalance,
                returnRate: p.returnRate,
                expectedReturnRate: p.expectedReturnRate,
                productType: p.productType
              }))
            });
          } else {
            const errorMessage = response.error?.message || 'Plan1Q 목표 상세를 불러오는데 실패했습니다.';
            set({ 
              error: errorMessage,
              isGoalDetailLoading: false 
            });
            showToast('error', errorMessage, get());
          }
        } catch (error) {
          console.error('Fetch goal detail error:', error);
          const errorMessage = 'Plan1Q 목표 상세를 불러오는데 실패했습니다.';
          set({ 
            error: errorMessage,
            isGoalDetailLoading: false 
          });
          showToast('error', errorMessage, get());
        }
      },

      // 상품별 자동이체 납입 정보 조회 (단일 계좌번호)
      fetchProductPaymentInfo: async (toAccountNumber: string) => {
        set({ isPaymentInfoLoading: true, error: null });
        
        try {
          console.log('📊 상품별 자동이체 납입 정보 API 호출 시작');
          console.log('📤 요청 파라미터:', { toAccountNumber });
          
          const response = await accountApi.getProductPaymentInfo(toAccountNumber);
          
          console.log('📥 상품별 자동이체 납입 정보 API 원본 응답:', response);
          
          if (response.success && response.data) {
            set({ 
              productPaymentInfo: response.data,
              isPaymentInfoLoading: false 
            });
            
            console.log('💾 상품별 자동이체 납입 정보 Zustand Store 업데이트 완료');
            console.log('🔍 저장된 납입 정보:', {
              totalItems: response.data.length,
              items: response.data.map(item => ({
                autoTransferId: item.autoTransferId,
                toAccountNumber: item.toAccountNumber,
                amount: item.amount,
                nextPaymentDate: item.nextPaymentDate,
                remainingInstallments: item.remainingInstallments,
                paymentStatus: item.paymentStatus
              }))
            });
          } else {
            const errorMessage = response.error?.message || '상품별 자동이체 납입 정보를 불러오는데 실패했습니다.';
            set({ 
              error: errorMessage,
              isPaymentInfoLoading: false 
            });
            showToast('error', errorMessage, get());
          }
        } catch (error) {
          console.error('Fetch product payment info error:', error);
          const errorMessage = '상품별 자동이체 납입 정보를 불러오는데 실패했습니다.';
          set({ 
            error: errorMessage,
            isPaymentInfoLoading: false 
          });
          showToast('error', errorMessage, get());
        }
      },

      // 모든 상품의 자동이체 납입 정보 조회 (상품별 개별 호출)
      fetchAllProductsPaymentInfo: async (products: any[]) => {
        set({ isPaymentInfoLoading: true, error: null });
        
        try {
          console.log('📊 모든 상품별 자동이체 납입 정보 API 호출 시작');
          console.log('📤 요청할 상품 목록:', products.map(p => ({ 
            productId: p.productId, 
            productName: p.productName, 
            accountNumber: p.accountNumber 
          })));
          
          // 각 상품별로 API 호출
          const paymentInfoPromises = products
            .filter(product => product.accountNumber) // 계좌번호가 있는 상품만
            .map(async (product) => {
              console.log(`🔄 상품 ${product.productId} (${product.productName}) 자동이체 납입 정보 조회 시작 - 계좌번호: ${product.accountNumber}`);
              try {
                const response = await accountApi.getProductPaymentInfo(product.accountNumber);
                console.log(`📥 상품 ${product.productId} API 응답:`, response);
                return response.success && response.data ? response.data : [];
              } catch (error) {
                console.error(`❌ 상품 ${product.productId} API 호출 실패:`, error);
                return [];
              }
            });

          // 모든 API 호출 완료 대기
          const allPaymentInfoArrays = await Promise.all(paymentInfoPromises);
          
          // 모든 결과를 하나의 배열로 합치기
          const allPaymentInfo = allPaymentInfoArrays.flat();
          
          console.log('📊 모든 상품별 자동이체 납입 정보 수집 완료:', {
            totalProducts: products.length,
            productsWithAccount: products.filter(p => p.accountNumber).length,
            totalPaymentInfo: allPaymentInfo.length,
            paymentInfoByProduct: allPaymentInfo.map(item => ({
              autoTransferId: item.autoTransferId,
              toAccountNumber: item.toAccountNumber,
              amount: item.amount,
              nextPaymentDate: item.nextPaymentDate,
              remainingInstallments: item.remainingInstallments,
              paymentStatus: item.paymentStatus
            }))
          });
          
          set({ 
            productPaymentInfo: allPaymentInfo,
            isPaymentInfoLoading: false 
          });
          
          console.log('💾 모든 상품별 자동이체 납입 정보 Zustand Store 업데이트 완료');
        } catch (error) {
          console.error('Fetch all products payment info error:', error);
          const errorMessage = '상품별 자동이체 납입 정보를 불러오는데 실패했습니다.';
          set({ 
            error: errorMessage,
            isPaymentInfoLoading: false 
          });
          showToast('error', errorMessage, get());
        }
      },

      // 에러 초기화
      clearError: () => set({ error: null }),

      // 상태 초기화
      resetState: () => set(initialState),
    }),
    {
      name: 'plan1q-store',
    }
  )
);
