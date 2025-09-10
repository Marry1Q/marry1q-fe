import { apiClient, CustomApiResponse } from '@/lib/api/client';
import {
  CreateCategoryBudgetRequest,
  UpdateCategoryBudgetRequest,
  CategoryBudgetResponse,
  CategoryBudgetListResponse
} from '../types/budget';

// 예산 API 함수들
export const budgetApi = {
  // 카테고리별 예산 목록 조회
  async getCategoryBudgets(): Promise<CustomApiResponse<CategoryBudgetListResponse>> {
    console.group('📊 [FRONTEND] 카테고리별 예산 목록 조회 요청');
    console.log('🎯 API 엔드포인트:', '/api/finance/category-budgets');
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.get<CategoryBudgetListResponse>('/api/finance/category-budgets');
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message,
        totalCount: response.data?.totalCount
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 카테고리별 예산 단건 조회
  async getCategoryBudget(id: number): Promise<CustomApiResponse<CategoryBudgetResponse>> {
    return apiClient.get<CategoryBudgetResponse>(`/api/finance/category-budgets/${id}`);
  },

  // 카테고리별 예산 생성
  async createCategoryBudget(data: CreateCategoryBudgetRequest): Promise<CustomApiResponse<CategoryBudgetResponse>> {
    console.group('➕ [FRONTEND] 카테고리별 예산 생성 요청');
    console.log('📤 요청 데이터:', data);
    console.log('🎯 API 엔드포인트:', '/api/finance/category-budgets');
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.post<CategoryBudgetResponse>('/api/finance/category-budgets', data);
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message,
        categoryBudgetId: response.data?.categoryBudgetId,
        budgetAmount: response.data?.budgetAmount
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 카테고리별 예산 수정
  async updateCategoryBudget(id: number, data: UpdateCategoryBudgetRequest): Promise<CustomApiResponse<CategoryBudgetResponse>> {
    console.group('✏️ [FRONTEND] 카테고리별 예산 수정 요청');
    console.log('📤 요청 데이터:', { id, ...data });
    console.log('🎯 API 엔드포인트:', `/api/finance/category-budgets/${id}`);
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.put<CategoryBudgetResponse>(`/api/finance/category-budgets/${id}`, data);
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message,
        categoryBudgetId: response.data?.categoryBudgetId,
        budgetAmount: response.data?.budgetAmount
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 카테고리별 예산 삭제
  async deleteCategoryBudget(id: number): Promise<CustomApiResponse<void>> {
    console.group('🗑️ [FRONTEND] 카테고리별 예산 삭제 요청');
    console.log('📤 요청 데이터:', { id });
    console.log('🎯 API 엔드포인트:', `/api/finance/category-budgets/${id}`);
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.delete(`/api/finance/category-budgets/${id}`);
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message
      });
      console.groupEnd();
      
      return response as CustomApiResponse<void>;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  }
};
