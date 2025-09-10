import { create } from 'zustand';
import { CategoryBudgetResponse } from '../types/budget';
import { CategoryResponse } from '../types/category';

interface BudgetState {
  // 카테고리별 예산 관련 상태
  categoryBudgets: CategoryBudgetResponse[];
  categories: CategoryResponse[];
  
  // 로딩 및 에러 상태
  loading: boolean;
  error: string | null;
  
  // 액션들
  setCategoryBudgets: (categoryBudgets: CategoryBudgetResponse[]) => void;
  setCategories: (categories: CategoryResponse[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearState: () => void;
}

const initialState = {
  categoryBudgets: [],
  categories: [],
  loading: false,
  error: null,
};

export const useBudgetStore = create<BudgetState>((set) => ({
  ...initialState,
  
  setCategoryBudgets: (categoryBudgets) => set({ categoryBudgets }),
  
  setCategories: (categories) => set({ categories }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearState: () => set(initialState),
}));
