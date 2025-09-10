import { usePlan1QStore } from './plan1qStore';
import { InvestmentQuestion, InvestmentProfile, Plan1QTemplate } from '../types';

// 투자성향 검사 질문 관련 selectors
export const useInvestmentQuestions = () => usePlan1QStore(state => state.investmentQuestions);
export const useInvestmentQuestionsLoading = () => usePlan1QStore(state => state.isQuestionsLoading);

// 투자성향 프로필 관련 selectors
export const useInvestmentProfile = () => usePlan1QStore(state => state.investmentProfile);
export const useInvestmentProfileLoading = () => usePlan1QStore(state => state.isProfileLoading);

// Plan1Q 템플릿 관련 selectors
export const useTemplates = () => usePlan1QStore(state => state.templates);
export const useTemplatesLoading = () => usePlan1QStore(state => state.isTemplatesLoading);

// 공통 상태 selectors
export const useIsLoading = () => usePlan1QStore(state => state.isLoading);
export const useIsSubmitting = () => usePlan1QStore(state => state.isSubmitting);
export const useError = () => usePlan1QStore(state => state.error);

// 액션 selectors
export const useFetchInvestmentQuestions = () => usePlan1QStore(state => state.fetchInvestmentQuestions);
export const useFetchInvestmentProfile = () => usePlan1QStore(state => state.fetchInvestmentProfile);
export const useFetchTemplates = () => usePlan1QStore(state => state.fetchTemplates);
export const useSubmitInvestmentProfile = () => usePlan1QStore(state => state.submitInvestmentProfile);
export const useClearError = () => usePlan1QStore(state => state.clearError);
export const useResetState = () => usePlan1QStore(state => state.resetState);

// 계산된 값 selectors
export const useHasInvestmentProfile = () => {
  const profile = useInvestmentProfile();
  return profile !== null && !profile.isExpired;
};

export const useTemplateById = (templateId: number) => {
  const templates = useTemplates();
  return templates.find(template => template.id === templateId);
};

export const useActiveTemplates = () => {
  const templates = useTemplates();
  return templates.filter(template => template.id > 0); // 활성화된 템플릿만 반환
};
