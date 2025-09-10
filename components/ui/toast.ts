import { toast } from 'sonner';
import { colors } from '@/constants/colors';

// 토스트 설정 상수
export const TOAST_CONFIG = {
  fontFamily: "Hana2-Medium",
  borderRadius: "0.75rem",
  duration: 3000,
  position: "top-center" as const,
};

// 성공 토스트
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    style: {
      background: colors.primary.toastBg,
      color: colors.primary.main,
      border: `1px solid ${colors.primary.main}`,
      fontFamily: TOAST_CONFIG.fontFamily,
      borderRadius: TOAST_CONFIG.borderRadius,
    },
    duration: TOAST_CONFIG.duration,
  });
};

// 에러 토스트
export const showErrorToast = (message: string) => {
  toast.error(message, {
    style: {
      background: "#FEF2F2",
      color: colors.danger.main,
      border: `1px solid ${colors.danger.main}`,
      fontFamily: TOAST_CONFIG.fontFamily,
      borderRadius: TOAST_CONFIG.borderRadius,
    },
    duration: TOAST_CONFIG.duration,
  });
};

// 경고 토스트
export const showWarningToast = (message: string) => {
  toast.warning(message, {
    style: {
      background: "#FEFBF0",
      color: colors.warning.main,
      border: `1px solid ${colors.warning.main}`,
      fontFamily: TOAST_CONFIG.fontFamily,
      borderRadius: TOAST_CONFIG.borderRadius,
    },
    duration: TOAST_CONFIG.duration,
  });
};

// 정보 토스트
export const showInfoToast = (message: string) => {
  toast.info(message, {
    style: {
      background: "#F0F7FF",
      color: colors.secondary.main,
      border: `1px solid ${colors.secondary.main}`,
      fontFamily: TOAST_CONFIG.fontFamily,
      borderRadius: TOAST_CONFIG.borderRadius,
    },
    duration: TOAST_CONFIG.duration,
  });
};

// 커스텀 토스트 (옵션 포함)
export const showCustomToast = (
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
  options?: {
    duration?: number;
    position?: 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left';
  }
) => {
  const toastFunction = toast[type];
  const style = getToastStyle(type);
  
  toastFunction(message, {
    style,
    duration: options?.duration || TOAST_CONFIG.duration,
  });
};

// 토스트 스타일 가져오기
const getToastStyle = (type: 'success' | 'error' | 'warning' | 'info') => {
  const baseStyle = {
    fontFamily: TOAST_CONFIG.fontFamily,
    borderRadius: TOAST_CONFIG.borderRadius,
  };

  switch (type) {
    case 'success':
      return {
        ...baseStyle,
        background: colors.primary.toastBg,
        color: colors.primary.main,
        border: `1px solid ${colors.primary.main}`,
      };
    case 'error':
      return {
        ...baseStyle,
        background: "#FEF2F2",
        color: colors.danger.main,
        border: `1px solid ${colors.danger.main}`,
      };
    case 'warning':
      return {
        ...baseStyle,
        background: "#FEFBF0",
        color: colors.warning.main,
        border: `1px solid ${colors.warning.main}`,
      };
    case 'info':
      return {
        ...baseStyle,
        background: "#F0F7FF",
        color: colors.secondary.main,
        border: `1px solid ${colors.secondary.main}`,
      };
    default:
      return baseStyle;
  }
};
