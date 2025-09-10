import { apiClient, TokenManager } from './client';

// 로그인 요청 타입
export interface LoginRequest {
  customerEmail: string;
  customerPw: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

// 사용자 정보 응답 타입
export interface CustomerInfoResponse {
  userSeqNo: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  coupleId: number;
  coupleSlug?: string;
  createdAt: string;
  updatedAt: string;
}

// 토큰 갱신 요청 타입
export interface RefreshTokenRequest {
  refreshToken: string;
}

// 핀 번호 검증 요청 타입
export interface PinVerificationRequest {
  pinNumber: string;
}

// 핀 번호 검증 응답 타입
export interface PinVerificationResponse {
  valid: boolean;  // 백엔드에서 실제로는 'valid'로 응답됨
  message: string;
  verifiedAt: string;
}

// 인증 API 함수들
export const authApi = {
  // 로그인
  async login(credentials: LoginRequest) {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    
    if (response.success && response.data) {
      // 토큰 저장
      TokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response;
  },

  // 로그아웃
  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // 토큰 삭제
      TokenManager.clearTokens();
    }
  },

  // 내 정보 조회
  async getMyInfo() {
    return apiClient.get<CustomerInfoResponse>('/api/auth/me');
  },

  // 토큰 갱신
  async refreshToken(refreshToken: string) {
    const response = await apiClient.post<LoginResponse>('/api/auth/refresh', { refreshToken });
    
    if (response.success && response.data) {
      // 토큰 저장
      TokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response;
  },

  // 인증 상태 확인
  isAuthenticated() {
    return TokenManager.isAuthenticated();
  },

  // 토큰 가져오기
  getAccessToken() {
    return TokenManager.getAccessToken();
  },

  getRefreshToken() {
    return TokenManager.getRefreshToken();
  },

  // 토큰 삭제
  clearTokens() {
    TokenManager.clearTokens();
  },

  // 핀 번호 검증
  async verifyPin(pinNumber: string) {
    return apiClient.post<PinVerificationResponse>('/api/auth/verify-pin', {
      pinNumber
    });
  }
};
