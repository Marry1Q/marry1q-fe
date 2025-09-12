import { showErrorToast } from '@/components/ui/toast';

const getApiBaseUrl = () => {
  // 환경변수가 있으면 사용
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // 브라우저 환경에서 호스트명 확인
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8080';
    }
    // 프로덕션 도메인인 경우
    return 'https://api.marry1q.com';
  }
  
  // 서버 사이드에서는 기본값
  return 'http://localhost:8080';
};

const API_BASE_URL = getApiBaseUrl();

// API 응답 타입 (백엔드 CustomApiResponse와 일치)
interface CustomApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

// 하위 호환성을 위한 기존 응답 타입
interface LegacyApiResponse<T = any> {
  status: string;
  message: string;
  data?: T;
}

// 토큰 관리
class TokenManager {
  private static ACCESS_TOKEN_KEY = 'accessToken';
  private static REFRESH_TOKEN_KEY = 'refreshToken';

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// 토큰 갱신 함수
async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) return false;

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        TokenManager.setTokens(data.data.accessToken, data.data.refreshToken);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

// API 클라이언트
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit & { silent?: boolean } = {}
  ): Promise<CustomApiResponse<T>> {
    const { silent, ...fetchOptions } = options;
    const url = `${API_BASE_URL}${endpoint}`;
    
    // 기본 헤더 설정
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 인증 토큰 추가
    const accessToken = TokenManager.getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // 요청 데이터 로깅
    let bodyForLog;
    try {
      if (options.body) {
        if (typeof options.body === 'string') {
          bodyForLog = JSON.parse(options.body);
        } else {
          bodyForLog = options.body;
        }
      }
    } catch (e) {
      bodyForLog = options.body;
    }
    
      console.log('🌐 API Request:', {
      url,
      method: fetchOptions.method || 'GET',
      headers,
      body: bodyForLog
    });

    try {
      console.log("🚀 fetch 호출 시작...");
      let response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      console.log("📡 서버 응답 수신:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      // 401 에러 시 토큰 갱신 시도
      if (response.status === 401 && accessToken) {
        console.log("🔑 401 에러 발생, 토큰 갱신 시도...");
        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {
          // 갱신된 토큰으로 재요청
          const newAccessToken = TokenManager.getAccessToken();
          headers.Authorization = `Bearer ${newAccessToken}`;
          console.log("🔄 토큰 갱신 성공, 재요청 시도...");
          response = await fetch(url, {
            ...fetchOptions,
            headers,
          });
        } else {
          // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
          console.error("❌ 토큰 갱신 실패");
          TokenManager.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Authentication failed');
        }
      }

      if (!response.ok) {
        console.error("❌ HTTP 응답 에러:", {
          status: response.status,
          statusText: response.statusText,
          url,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        // HTTP 에러 응답 처리
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorData = null;
        
        try {
          const responseText = await response.text();
          console.error("❌ 응답 본문:", responseText);
          
          if (responseText) {
            try {
              errorData = JSON.parse(responseText);
              console.error("❌ 파싱된 에러 데이터:", errorData);
              
              if (errorData.message) {
                errorMessage = errorData.message;
              } else if (errorData.error?.message) {
                errorMessage = errorData.error.message;
              }
            } catch (jsonParseError) {
              console.error("❌ JSON 파싱 실패:", jsonParseError);
              errorMessage = responseText.substring(0, 200); // 처음 200자만 사용
            }
          }
        } catch (parseError) {
          console.error("❌ 응답 텍스트 읽기 실패:", parseError);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("📊 응답 데이터 파싱 완료:", data);
      
      // 디버깅을 위한 로그
      console.log('API Response:', data);
      console.log('Success field:', data.success);
      console.log('Status field:', data.status);
      console.log('Message field:', data.message);

      // CustomApiResponse 구조 처리 (백엔드 표준)
      if (data.success !== undefined) {
        if (!data.success && data.error) {
          const errorMessage = data.error.message || data.message || '알 수 없는 오류가 발생했습니다.';
          // 🔧 silent 옵션이 true이면 토스트를 표시하지 않음
          if (!silent) {
            showErrorToast(errorMessage);
          }
          throw new Error(errorMessage);
        }
        return data as CustomApiResponse<T>;
      }
      
      // 하위 호환성: 기존 Map 구조 처리
      if (data.status) {
        if (data.status !== 'SUCCESS') {
          const errorMessage = data.message || '알 수 없는 오류가 발생했습니다.';
          // 🔧 silent 옵션이 true이면 토스트를 표시하지 않음
          if (!silent) {
            showErrorToast(errorMessage);
          }
          throw new Error(errorMessage);
        }
        // 기존 구조를 CustomApiResponse로 변환
        return {
          success: true,
          data: data.data,
          message: data.message,
          timestamp: new Date().toISOString()
        } as CustomApiResponse<T>;
      }

      // 기본 처리: 원본 데이터를 CustomApiResponse로 래핑
      return {
        success: true,
        data: data,
        message: '성공적으로 처리되었습니다.',
        timestamp: new Date().toISOString()
      } as CustomApiResponse<T>;
    } catch (error) {
      if (error instanceof Error && error.message === 'Authentication failed') {
        throw error;
      }
      
      console.error('API request failed:', error);
      
      // 🔧 silent 옵션이 true이면 토스트를 표시하지 않음
      if (silent) {
        throw error; // 원본 에러를 그대로 전달 (토스트 없음)
      } else {
        throw new Error('네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.');
      }
    }
  }

  // GET 요청
  async get<T>(endpoint: string, silent?: boolean): Promise<CustomApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', silent });
  }

  // POST 요청
  async post<T>(endpoint: string, data?: any, silent?: boolean): Promise<CustomApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      silent,
    });
  }

  // multipart/form-data POST 요청
  async postMultipart<T>(endpoint: string, data: { [key: string]: any }, files?: { [key: string]: File }, silent?: boolean): Promise<CustomApiResponse<T>> {
    const formData = new FormData();
    
    // JSON 데이터 추가
    Object.keys(data).forEach(key => {
      formData.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
    });
    
    // 파일 데이터 추가
    if (files) {
      Object.keys(files).forEach(key => {
        formData.append(key, files[key]);
      });
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {};
    
    const accessToken = TokenManager.getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // 요청 데이터 로깅
    console.log('🌐 Multipart API Request:', {
      url,
      method: 'POST',
      headers,
      data,
      files: files ? Object.keys(files) : undefined
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      // CustomApiResponse 구조 처리
      if (data.success !== undefined) {
        if (!data.success && data.error) {
          const errorMessage = data.error.message || data.message || '요청에 실패했습니다.';
          showErrorToast(errorMessage);
          throw new Error(errorMessage);
        }
        return data as CustomApiResponse<T>;
      }

      // 기본 처리: 원본 데이터를 CustomApiResponse로 래핑
      return {
        success: true,
        data: data,
        message: '성공적으로 처리되었습니다.',
        timestamp: new Date().toISOString()
      } as CustomApiResponse<T>;
    } catch (error) {
      console.error('Multipart request failed:', error);
      if (silent) {
        throw error; // 원본 에러를 그대로 전달 (토스트 없음)
      } else {
        throw new Error('네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.');
      }
    }
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: any): Promise<CustomApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // multipart/form-data PUT 요청
  async putMultipart<T>(endpoint: string, data: { [key: string]: any }, files?: { [key: string]: File }, silent?: boolean): Promise<CustomApiResponse<T>> {
    const formData = new FormData();
    
    // JSON 데이터 추가
    Object.keys(data).forEach(key => {
      formData.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
    });
    
    // 파일 데이터 추가
    if (files) {
      Object.keys(files).forEach(key => {
        formData.append(key, files[key]);
      });
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {};
    
    const accessToken = TokenManager.getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // 요청 데이터 로깅
    console.log('🌐 Multipart PUT API Request:', {
      url,
      method: 'PUT',
      headers,
      data,
      files: files ? Object.keys(files) : undefined
    });

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: formData,
      });

      const data = await response.json();

      // CustomApiResponse 구조 처리
      if (data.success !== undefined) {
        if (!data.success && data.error) {
          const errorMessage = data.error.message || data.message || '요청에 실패했습니다.';
          showErrorToast(errorMessage);
          throw new Error(errorMessage);
        }
        return data as CustomApiResponse<T>;
      }

      // 기본 처리: 원본 데이터를 CustomApiResponse로 래핑
      return {
        success: true,
        data: data,
        message: '성공적으로 처리되었습니다.',
        timestamp: new Date().toISOString()
      } as CustomApiResponse<T>;
    } catch (error) {
      console.error('Multipart PUT request failed:', error);
      if (silent) {
        throw error; // 원본 에러를 그대로 전달 (토스트 없음)
      } else {
        throw new Error('네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.');
      }
    }
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<CustomApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // 사용자 정보 조회 (커플 ID 포함)
  async getUserInfo() {
    return this.get<{
      userSeqNo: string;
      customerName: string;
      customerPhone: string;
      customerEmail: string;
      coupleId: number;
      coupleSlug?: string;
      createdAt: string;
      updatedAt: string;
    }>('/api/auth/me');
  }

  // 파일 업로드
  async uploadFile<T>(endpoint: string, file: File): Promise<CustomApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {};
    
    const accessToken = TokenManager.getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      // CustomApiResponse 구조 처리
      if (data.success !== undefined) {
        if (!data.success && data.error) {
          const errorMessage = data.error.message || data.message || '파일 업로드에 실패했습니다.';
          showErrorToast(errorMessage);
          throw new Error(errorMessage);
        }
        return data as CustomApiResponse<T>;
      }

      // 기본 처리: 원본 데이터를 CustomApiResponse로 래핑
      return {
        success: true,
        data: data,
        message: '파일 업로드가 완료되었습니다.',
        timestamp: new Date().toISOString()
      } as CustomApiResponse<T>;
    } catch (error) {
      console.error('File upload failed:', error);
      // toast.error('파일 업로드에 실패했습니다.'); // 중복 토스트 제거
      throw new Error('파일 업로드에 실패했습니다.');
    }
  }
}

export const apiClient = new ApiClient();
export { TokenManager };
export { refreshAccessToken };
export type { CustomApiResponse, LegacyApiResponse };
