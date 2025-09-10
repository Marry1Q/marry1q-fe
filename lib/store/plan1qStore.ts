import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Plan1QGoalCreateResponse, PortfolioRecommendationResponse } from "@/features/plan1q/types";

export interface Plan1QData {
  // Step 1: Plan1Q 선택
  selectedPlan1Q?: {
    id: number;
    title: string;
    description?: string;
    iconName: string;
  };
  isCustomGoalSelected?: boolean; // 직접 입력하기 선택 여부

  // Step 2: 세부 정보
  goalTitle?: string;
  detailedGoal?: string;
  targetAmount?: number;
  targetPeriod?: number;

  // Step 3: 확인
  isConfirmed?: boolean;
}

interface Plan1QStore {
  data: Plan1QData;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[]; // 완료된 단계들을 추적
  
  // API 관련 상태
  isLoading: boolean;
  apiResponse: Plan1QGoalCreateResponse | null;
  recommendationResponse: PortfolioRecommendationResponse | null; // AI 추천 결과
  mappedResponse: any; // 가공된 응답 데이터
  error: string | null;

  // Actions
  setData: (data: Partial<Plan1QData>) => void;
  setCurrentStep: (step: number) => void;
  resetData: () => void;
  nextStep: () => void;
  prevStep: () => void;
  markStepAsCompleted: (step: number) => void;
  
  // API 관련 액션
  setLoading: (loading: boolean) => void;
  setApiResponse: (response: Plan1QGoalCreateResponse | null) => void;
  setRecommendationResponse: (response: PortfolioRecommendationResponse | null) => void;
  setMappedResponse: (response: any) => void;
  setError: (error: string | null) => void;
}

const initialState: Plan1QData = {
  selectedPlan1Q: undefined,
  isCustomGoalSelected: false,
  goalTitle: "",
  detailedGoal: "",
  targetAmount: 1000000,
  targetPeriod: 6,
  isConfirmed: false,
};

export const usePlan1QStore = create<Plan1QStore>()(
  persist(
    (set, get) => ({
      data: initialState,
      currentStep: 1, // 1단계부터 시작
      totalSteps: 3, // 총 3단계
      completedSteps: [] as number[],
      
      // API 관련 상태
      isLoading: false,
      apiResponse: null,
      recommendationResponse: null,
      mappedResponse: null,
      error: null,

      setData: (newData: Partial<Plan1QData>) => {
        set((state: Plan1QStore) => ({
          data: { ...state.data, ...newData },
        }));
      },

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      resetData: () => {
        set({ 
          data: initialState, 
          currentStep: 1, 
          completedSteps: [],
          isLoading: false,
          apiResponse: null,
          recommendationResponse: null,
          mappedResponse: null,
          error: null,
        });
        // localStorage에서도 완전히 제거
        if (typeof window !== "undefined") {
          localStorage.removeItem("plan1q-store");
        }
      },

      nextStep: () => {
        const { currentStep, totalSteps, completedSteps } = get();
        if (currentStep < totalSteps) {
          // 1, 2, 3단계까지
          // 현재 단계를 완료된 것으로 표시
          const newCompletedSteps = [...completedSteps];
          if (!newCompletedSteps.includes(currentStep)) {
            newCompletedSteps.push(currentStep);
          }
          set({
            currentStep: currentStep + 1,
            completedSteps: newCompletedSteps,
          });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          // 1단계가 최소
          set({ currentStep: currentStep - 1 });
        }
      },

      markStepAsCompleted: (step: number) => {
        set((state: Plan1QStore) => {
          const newCompletedSteps = [...state.completedSteps];
          if (!newCompletedSteps.includes(step)) {
            newCompletedSteps.push(step);
          }
          return { completedSteps: newCompletedSteps };
        });
      },
      
      // API 관련 액션
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      setApiResponse: (response: Plan1QGoalCreateResponse | null) => {
        set({ apiResponse: response });
      },
      
      setRecommendationResponse: (response: PortfolioRecommendationResponse | null) => {
        set({ recommendationResponse: response });
      },
      
      setMappedResponse: (response: any) => {
        set({ mappedResponse: response });
      },
      
      setError: (error: string | null) => {
        set({ error: error });
      },
    }),
    {
      name: "plan1q-store",
      partialize: (state: Plan1QStore) => ({
        data: state.data,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        apiResponse: state.apiResponse,
        recommendationResponse: state.recommendationResponse,
        mappedResponse: state.mappedResponse,
      }),
    }
  )
);
