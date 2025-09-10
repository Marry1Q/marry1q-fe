import { create } from 'zustand';
import { TransactionResponse, TransactionSearchParams } from '../types/transaction';
import { BudgetOverviewResponse } from '../types/budget';
import { CategoryResponse } from '../types/category';

interface FinanceState {
  // 거래 내역 관련 상태
  transactions: TransactionResponse[];
  budgetOverview: BudgetOverviewResponse | null;
  categories: CategoryResponse[];
  
  // 리뷰 모드 관련 상태
  reviewPendingTransactions: any[];
  isReviewMode: boolean;
  
  // 로딩 및 에러 상태
  loading: boolean;
  error: string | null;
  
  // 페이징 상태
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
  
  // 필터 상태
  filters: {
    searchTerm: string;
    categoryId?: number;
    userSeqNo?: string;
    transactionType?: 'INCOME' | 'EXPENSE';
    startDate?: string;
    endDate?: string;
  };
  
  // 액션들
  setTransactions: (transactions: TransactionResponse[]) => void;
  setBudgetOverview: (overview: BudgetOverviewResponse) => void;
  setCategories: (categories: CategoryResponse[]) => void;
  setReviewPendingTransactions: (transactions: any[]) => void;
  setIsReviewMode: (isReviewMode: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: FinanceState['pagination']) => void;
  setFilters: (filters: Partial<FinanceState['filters']>) => void;
  resetFilters: () => void;
  clearState: () => void;
}

const initialState = {
  transactions: [],
  budgetOverview: null,
  categories: [],
  reviewPendingTransactions: [],
  isReviewMode: false,
  loading: false,
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  },
  filters: {
    searchTerm: '',
    categoryId: undefined,
    userSeqNo: undefined,
    transactionType: undefined,
    startDate: undefined,
    endDate: undefined,
  },
};

export const useFinanceStore = create<FinanceState>((set, get) => ({
  ...initialState,
  
  setTransactions: (transactions) => set({ transactions }),
  
  setBudgetOverview: (budgetOverview) => set({ budgetOverview }),
  
  setCategories: (categories) => set({ categories }),
  
  setReviewPendingTransactions: (reviewPendingTransactions) => set({ reviewPendingTransactions }),
  
  setIsReviewMode: (isReviewMode) => set({ isReviewMode }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setPagination: (pagination) => set({ pagination }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
    pagination: { ...state.pagination, currentPage: 0 }, // 필터 변경 시 첫 페이지로
  })),
  
  resetFilters: () => set((state) => ({
    filters: initialState.filters,
    pagination: { ...state.pagination, currentPage: 0 },
  })),
  
  clearState: () => set(initialState),
}));
