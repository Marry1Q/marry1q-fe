// 카테고리 응답 타입 (백엔드 CategoryResponse와 일치)
export interface CategoryResponse {
  financeCategoryId: number;
  name: string;
  isDefault: boolean; // UI에서 "기본 제공 카테고리" 표시용
  coupleId: number;
  iconName?: string; // 추가: 아이콘 이름
  colorName?: string; // 추가: 색상 이름
}

// 카테고리 목록 응답 타입 (백엔드 CategoryListResponse와 일치)
export interface CategoryListResponse {
  categories: CategoryResponse[];
  totalCount: number;
}

// 카테고리 생성 요청 타입 (백엔드 CreateCategoryRequest와 일치)
export interface CreateCategoryRequest {
  name: string;
  iconName?: string; // 추가: 아이콘 이름
  colorName?: string; // 추가: 색상 이름
}

// 카테고리 수정 요청 타입 (백엔드 UpdateCategoryRequest와 일치)
export interface UpdateCategoryRequest {
  name: string;
  iconName?: string; // 추가: 아이콘 이름
  colorName?: string; // 추가: 색상 이름
}
