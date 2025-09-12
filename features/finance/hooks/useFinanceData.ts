import { useEffect, useCallback } from 'react';
import { financeApi, categoryApi } from '../api';
import { useFinanceStore } from '../store';
import { TransactionSearchParams, BudgetOverviewResponse } from '../types';
import { showErrorToast } from '@/components/ui/toast';

export const useFinanceData = (isAuthenticated: boolean = true) => {
  const {
    transactions,
    budgetOverview,
    categories,
    reviewPendingTransactions,
    isReviewMode,
    loading,
    error,
    pagination,
    filters,
    setTransactions,
    setBudgetOverview,
    setCategories,
    setReviewPendingTransactions,
    setIsReviewMode,
    setLoading,
    setError,
    setPagination,
  } = useFinanceStore();

  // 거래 내역 목록 조회
  const fetchTransactions = useCallback(async (params?: TransactionSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await financeApi.getTransactions(params, true); // silent = true
      
      if (response.success && response.data) {
        setTransactions(response.data.transactions);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          pageSize: response.data.pageSize,
        });
      } else {
        setError(response.message || '거래 내역을 불러오는데 실패했습니다.');
        showErrorToast(response.message || '거래 내역을 불러오는데 실패했습니다.');
      }
    } catch (error: any) {
      const errorMessage = error.message || '거래 내역을 불러오는데 실패했습니다.';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setTransactions, setPagination, setLoading, setError]);

  // 예산 대시보드 조회
  const fetchBudgetOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await financeApi.getBudgetOverview(true); // silent = true
      
      if (response.success && response.data) {
        setBudgetOverview(response.data);
      } else {
        setError(response.message || '예산 정보를 불러오는데 실패했습니다.');
        showErrorToast(response.message || '예산 정보를 불러오는데 실패했습니다.');
      }
    } catch (error: any) {
      const errorMessage = error.message || '예산 정보를 불러오는데 실패했습니다.';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setBudgetOverview, setLoading, setError]);

  // 카테고리 목록 조회
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoryApi.getCategories(true); // silent = true
      
      if (response.success && response.data) {
        setCategories(response.data.categories);
      } else {
        setError(response.message || '카테고리를 불러오는데 실패했습니다.');
        showErrorToast(response.message || '카테고리를 불러오는데 실패했습니다.');
      }
    } catch (error: any) {
      const errorMessage = error.message || '카테고리를 불러오는데 실패했습니다.';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setCategories, setLoading, setError]);

  // 거래 내역 삭제
  const deleteTransaction = useCallback(async (transactionId: number) => {
    try {
      setLoading(true);
      
      const response = await financeApi.deleteTransaction(transactionId);
      
      if (response.success) {
        // 삭제 후 목록 새로고침
        await fetchTransactions({
          page: pagination.currentPage,
          size: pagination.pageSize,
          ...filters,
        });
        // 예산 대시보드도 새로고침
        await fetchBudgetOverview();
        return { success: true };
      } else {
        return { success: false, message: response.message || '거래 내역 삭제에 실패했습니다.' };
      }
    } catch (error: any) {
      const errorMessage = error.message || '거래 내역 삭제에 실패했습니다.';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, fetchBudgetOverview, pagination, filters, setLoading]);

  // 리뷰 대기 거래내역 조회
  const fetchReviewPendingTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await financeApi.getReviewPendingTransactions(true); // silent = true
      
      if (response.success && response.data) {
        // API 응답 구조: { summary: {...}, transactions: [...] }
        const transactions = response.data.transactions || [];
        
        console.log('🔍 리뷰 대기 거래내역 API 응답:', response.data);
        console.log('📊 거래내역 배열:', transactions);
        
        // API 응답을 기존 거래내역 구조에 맞게 매핑
        const mappedTransactions = transactions.map((item: any) => ({
          transactionId: item.id,
          tranId: item.id?.toString() || '',
          type: item.type === 'deposit' ? 'INCOME' : 'EXPENSE',
          transactionType: item.type === 'deposit' ? 'INCOME' : 'EXPENSE', // 추가
          amount: item.amount,
          description: item.description || '거래내역',
          memo: item.memo,
          transactionDate: item.date, // 백엔드에서 date로 응답
          transactionTime: item.time, // 백엔드에서 time으로 응답
          userName: null, // 미분류내역은 사용자 정보가 null이 맞음
          categoryName: item.category || '미분류',
          financeCategoryId: item.category,
          accountNumber: '미확인',
          balanceAfterTransaction: item.balanceAfterTransaction,
          reviewed: false, // 리뷰 대기 상태
          createdAt: item.date,
          updatedAt: item.date,
        }));
        
        console.log('✅ 매핑된 거래내역:', mappedTransactions);
        
        setReviewPendingTransactions(mappedTransactions);
      } else {
        setError(response.message || '리뷰 대기 거래내역을 불러오는데 실패했습니다.');
      }
    } catch (error: any) {
      const errorMessage = error.message || '리뷰 대기 거래내역을 불러오는데 실패했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setReviewPendingTransactions, setLoading, setError]);

  // 거래내역 리뷰 상태 변경
  const updateTransactionReviewStatus = useCallback(async (id: number, data?: {
    reviewStatus?: string;
    categoryId?: number;
    memo?: string;
  }) => {
    try {
      setLoading(true);
      
      const response = await financeApi.updateTransactionReviewStatus(id, data);
      
      if (response.success) {
        // 리뷰 대기 거래내역 목록 새로고침
        await fetchReviewPendingTransactions();
        return { success: true };
      } else {
        return { success: false, message: response.message || '리뷰 상태 변경에 실패했습니다.' };
      }
    } catch (error: any) {
      const errorMessage = error.message || '리뷰 상태 변경에 실패했습니다.';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchReviewPendingTransactions, setLoading]);

  // 초기 데이터 로드 - 인증된 사용자만
  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions({
        page: 0,
        size: 10,
      });
      fetchBudgetOverview();
      fetchCategories();
      fetchReviewPendingTransactions();
    }
  }, [isAuthenticated]);

  return {
    // 상태
    transactions,
    budgetOverview,
    categories,
    reviewPendingTransactions,
    isReviewMode,
    loading,
    error,
    pagination,
    filters,
    
    // 액션
    fetchTransactions,
    fetchBudgetOverview,
    fetchCategories,
    fetchReviewPendingTransactions,
    updateTransactionReviewStatus,
    deleteTransaction,
    setIsReviewMode,
  };
};
