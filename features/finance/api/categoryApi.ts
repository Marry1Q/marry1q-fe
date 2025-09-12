import { apiClient, CustomApiResponse } from '@/lib/api/client';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
  CategoryListResponse
} from '../types/category';

// 카테고리 API 함수들
export const categoryApi = {
  // 카테고리 목록 조회 (기본 + 커스텀)
  async getCategories(silent?: boolean): Promise<CustomApiResponse<CategoryListResponse>> {
    console.group('📂 [FRONTEND] 카테고리 목록 조회 요청');
    console.log('🎯 API 엔드포인트:', '/api/finance/categories');
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.get<CategoryListResponse>('/api/finance/categories', silent);
      
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

  // 기본 카테고리 목록 조회
  async getDefaultCategories(): Promise<CustomApiResponse<CategoryListResponse>> {
    return apiClient.get<CategoryListResponse>('/api/finance/categories/default');
  },

  // 커스텀 카테고리 목록 조회
  async getCustomCategories(): Promise<CustomApiResponse<CategoryListResponse>> {
    return apiClient.get<CategoryListResponse>('/api/finance/categories/custom');
  },

  // 카테고리 단건 조회
  async getCategory(id: number): Promise<CustomApiResponse<CategoryResponse>> {
    return apiClient.get<CategoryResponse>(`/api/finance/categories/${id}`);
  },

  // 커스텀 카테고리 생성
  async createCategory(data: CreateCategoryRequest): Promise<CustomApiResponse<CategoryResponse>> {
    console.group('➕ [FRONTEND] 커스텀 카테고리 생성 요청');
    console.log('📤 요청 데이터:', data);
    console.log('🎯 API 엔드포인트:', '/api/finance/categories');
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.post<CategoryResponse>('/api/finance/categories', data);
      
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

  // 커스텀 카테고리 수정
  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<CustomApiResponse<CategoryResponse>> {
    console.group('✏️ [FRONTEND] 커스텀 카테고리 수정 요청');
    console.log('📤 요청 데이터:', { id, ...data });
    console.log('🎯 API 엔드포인트:', `/api/finance/categories/${id}`);
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.put<CategoryResponse>(`/api/finance/categories/${id}`, data);
      
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

  // 커스텀 카테고리 삭제
  async deleteCategory(id: number): Promise<CustomApiResponse<void>> {
    console.group('🗑️ [FRONTEND] 커스텀 카테고리 삭제 요청');
    console.log('📤 요청 데이터:', { id });
    console.log('🎯 API 엔드포인트:', `/api/finance/categories/${id}`);
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.delete(`/api/finance/categories/${id}`);
      
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
