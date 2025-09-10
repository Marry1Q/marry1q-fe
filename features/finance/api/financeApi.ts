import { apiClient, CustomApiResponse } from '@/lib/api/client';
import {
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionResponse,
  TransactionListResponse,
  TransactionSearchParams,
  BudgetOverviewResponse
} from '../types/transaction';

// 카테고리 타입 정의
export interface FinanceCategory {
  financeCategoryId: number;
  name: string;
  coupleId: number;
  iconName?: string;
  colorName?: string;
}

export interface CategoryListResponse {
  categories: FinanceCategory[];
  totalCount: number;
}

export interface CreateCategoryRequest {
  name: string;
  iconName?: string;
  colorName?: string;
}

// 거래 내역 API 함수들
export const financeApi = {
  // 카테고리 목록 조회
  async getCategories(): Promise<CustomApiResponse<CategoryListResponse>> {
    console.group('📂 [FRONTEND] 카테고리 목록 조회 요청');
    console.log('🎯 API 엔드포인트:', '/api/finance/categories');
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.get<CategoryListResponse>('/api/finance/categories');
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message,
        totalCount: response.data?.totalCount,
        categories: response.data?.categories?.length
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 카테고리 생성
  async createCategory(data: CreateCategoryRequest): Promise<CustomApiResponse<FinanceCategory>> {
    console.group('➕ [FRONTEND] 카테고리 생성 요청');
    console.log('📤 요청 데이터:', data);
    console.log('🎯 API 엔드포인트:', '/api/finance/categories');
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.post<FinanceCategory>('/api/finance/categories', data);
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message,
        categoryId: response.data?.financeCategoryId,
        name: response.data?.name
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 거래 내역 목록 조회 (검색, 필터링, 페이징 포함)
  async getTransactions(params?: TransactionSearchParams): Promise<CustomApiResponse<TransactionListResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params?.searchTerm) searchParams.append('searchTerm', params.searchTerm);
    if (params?.categoryId !== undefined) searchParams.append('categoryId', params.categoryId.toString());
    if (params?.userSeqNo) searchParams.append('userSeqNo', params.userSeqNo);
    if (params?.transactionType) searchParams.append('transactionType', params.transactionType);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/finance/transactions?${queryString}` : '/api/finance/transactions';
    
    return apiClient.get<TransactionListResponse>(endpoint);
  },

  // 거래 내역 단건 조회
  async getTransaction(id: number): Promise<CustomApiResponse<TransactionResponse>> {
    return apiClient.get<TransactionResponse>(`/api/finance/transactions/${id}`);
  },

  // 거래 내역 생성
  async createTransaction(data: CreateTransactionRequest): Promise<CustomApiResponse<TransactionResponse>> {
    console.group('💰 [FRONTEND] 거래 내역 생성 요청');
    console.log('📤 요청 데이터:', data);
    console.log('🎯 API 엔드포인트:', '/api/finance/transactions');
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.post<TransactionResponse>('/api/finance/transactions', data);
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message,
        transactionId: response.data?.transactionId,
        amount: response.data?.amount,
        description: response.data?.description
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 거래 내역 수정
  async updateTransaction(id: number, data: UpdateTransactionRequest): Promise<CustomApiResponse<TransactionResponse>> {
    console.group('✏️ [FRONTEND] 거래 내역 수정 요청');
    console.log('📤 요청 데이터:', { id, ...data });
    console.log('🎯 API 엔드포인트:', `/api/finance/transactions/${id}`);
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.put<TransactionResponse>(`/api/finance/transactions/${id}`, data);
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message,
        transactionId: response.data?.transactionId,
        amount: response.data?.amount,
        description: response.data?.description
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 거래 내역 삭제
  async deleteTransaction(id: number): Promise<CustomApiResponse<any>> {
    console.group('🗑️ [FRONTEND] 거래 내역 삭제 요청');
    console.log('📤 요청 데이터:', { id });
    console.log('🎯 API 엔드포인트:', `/api/finance/transactions/${id}`);
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.delete(`/api/finance/transactions/${id}`);
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 예산 대시보드 정보 조회
  async getBudgetOverview(): Promise<CustomApiResponse<BudgetOverviewResponse>> {
    console.group('📊 [FRONTEND] 예산 대시보드 조회 요청');
    console.log('🎯 API 엔드포인트:', '/api/finance/overview');
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.get<BudgetOverviewResponse>('/api/finance/overview');
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message,
        totalBudget: response.data?.totalBudget,
        totalSpent: response.data?.totalSpent,
        totalUsageRate: response.data?.totalUsageRate
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 리뷰 대기 거래내역 조회
  async getReviewPendingTransactions(): Promise<CustomApiResponse<any>> {
    console.group('🔍 [FRONTEND] 리뷰 대기 거래내역 조회 요청');
    console.log('🎯 API 엔드포인트:', '/api/account/transactions/review');
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.get<any>('/api/account/transactions/review');
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message,
        totalCount: response.data?.summary?.totalCount,
        totalAmount: response.data?.summary?.totalAmount
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 거래내역 리뷰 상태 변경
  async updateTransactionReviewStatus(id: number, data?: {
    reviewStatus?: string;
    categoryId?: number;
    memo?: string;
  }): Promise<CustomApiResponse<any>> {
    console.group('✅ [FRONTEND] 거래내역 리뷰 상태 변경 요청');
    console.log('📤 요청 데이터:', { id, ...data });
    console.log('🎯 API 엔드포인트:', `/api/account/transactions/review/${id}`);
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.put<any>(`/api/account/transactions/review/${id}`, data || {});
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  }
};
