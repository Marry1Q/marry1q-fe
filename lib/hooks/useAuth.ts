import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, LoginRequest, CustomerInfoResponse } from '../api/authApi';
import { coupleApi, CoupleResponse } from '../api/coupleApi';
import { showSuccessToast, showErrorToast } from '@/components/ui/toast';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: CustomerInfoResponse | null;
  coupleId: number | null;
  coupleSlug: string | null;
  coupleInfo: CoupleResponse | null;
}

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    coupleId: null,
    coupleSlug: null,
    coupleInfo: null,
  });

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = authApi.isAuthenticated();
        
        if (isAuth) {
          // 토큰이 있으면 사용자 정보 조회
          const response = await authApi.getMyInfo();
          if (response.success && response.data) {
            // 커플 정보도 함께 조회
            let coupleInfo = null;
            if (response.data.coupleId) {
              try {
                const coupleResponse = await coupleApi.getCurrentCoupleInfo();
                if (coupleResponse.success && coupleResponse.data) {
                  coupleInfo = coupleResponse.data;
                }
              } catch (error) {
                console.warn('커플 정보 조회 실패:', error);
              }
            }
            
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              user: response.data,
              coupleId: response.data.coupleId,
              coupleSlug: response.data.coupleSlug || null,
              coupleInfo: coupleInfo,
            });
          } else {
            // 토큰이 있지만 사용자 정보 조회 실패
            authApi.clearTokens();
            setAuthState({
              isAuthenticated: false,
              isLoading: false,
              user: null,
              coupleId: null,
              coupleSlug: null,
              coupleInfo: null,
            });
          }
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            coupleId: null,
            coupleSlug: null,
            coupleInfo: null,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authApi.clearTokens();
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          coupleId: null,
          coupleSlug: null,
          coupleInfo: null,
        });
      }
    };

    checkAuth();
  }, []);

  // 로그인
  const login = useCallback(async (credentials: LoginRequest) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await authApi.login(credentials);
      
      if (response.success && response.data) {
        // 사용자 정보 조회
        const userResponse = await authApi.getMyInfo();
        if (userResponse.success && userResponse.data) {
          // 커플 정보도 함께 조회
          let coupleInfo = null;
          if (userResponse.data.coupleId) {
            try {
              const coupleResponse = await coupleApi.getCurrentCoupleInfo();
              if (coupleResponse.success && coupleResponse.data) {
                coupleInfo = coupleResponse.data;
              }
            } catch (error) {
              console.warn('커플 정보 조회 실패:', error);
            }
          }
          
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: userResponse.data,
            coupleId: userResponse.data.coupleId,
            coupleSlug: userResponse.data.coupleSlug || null,
            coupleInfo: coupleInfo,
          });
          
          showSuccessToast(`${userResponse.data.customerName}님, 환영합니다!`);
          // 원래 접근하려던 페이지로 이동 (기본값은 메인 페이지)
          const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/';
          router.push(returnUrl);
          return { success: true };
        }
      } else {
        const errorMessage = response.error?.message || '로그인에 실패했습니다.';
        showErrorToast(errorMessage);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Login failed:', error);
      showErrorToast('로그인에 실패했습니다.');
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: '로그인에 실패했습니다.' };
    }
  }, [router]);

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        coupleId: null,
        coupleSlug: null,
        coupleInfo: null,
      });
      
      showSuccessToast('로그아웃되었습니다.');
      router.push('/login');
    }
  }, [router]);

  // 사용자 정보 새로고침
  const refreshUserInfo = useCallback(async () => {
    try {
      const response = await authApi.getMyInfo();
      if (response.success && response.data) {
        // 커플 정보도 함께 조회
        let coupleInfo = null;
        if (response.data.coupleId) {
          try {
            const coupleResponse = await coupleApi.getCurrentCoupleInfo();
            if (coupleResponse.success && coupleResponse.data) {
              coupleInfo = coupleResponse.data;
            }
          } catch (error) {
            console.warn('커플 정보 조회 실패:', error);
          }
        }
        
        setAuthState(prev => ({
          ...prev,
          user: response.data || null,
          coupleId: response.data?.coupleId || 0,
          coupleSlug: response.data?.coupleSlug || null,
          coupleInfo: coupleInfo,
        }));
      }
    } catch (error) {
      console.error('Failed to refresh user info:', error);
    }
  }, []);

  return {
    ...authState,
    login,
    logout,
    refreshUserInfo,
  };
};
