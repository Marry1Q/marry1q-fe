import Swal from "sweetalert2";
import { colors } from "@/constants/colors";

export interface CustomAlertOptions {
  title: string;
  text?: string;
  type?: "success" | "warning" | "error" | "info" | "question";
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  width?: string;
  customClass?: {
    title?: string;
    confirmButton?: string;
    cancelButton?: string;
    popup?: string;
  };
}

export interface CustomConfirmOptions extends CustomAlertOptions {
  showCancelButton: true;
  cancelButtonText: string;
}

// 기본 스타일 클래스들
const defaultCustomClass = {
  title: "custom-alert-title",
  confirmButton: "custom-alert-confirm-btn",
  cancelButton: "custom-alert-cancel-btn",
  popup: "custom-alert-popup",
};

// 성공 알림
export const showSuccessAlert = (options: Omit<CustomAlertOptions, "type">) => {
  return Swal.fire({
    ...options,
    icon: undefined,
    confirmButtonText: options.confirmButtonText || "확인",
    confirmButtonColor: colors.primary.main,
    width: options.width || "25rem",
    customClass: {
      ...defaultCustomClass,
      ...options.customClass,
    },
  });
};

// 경고 알림
export const showWarningAlert = (options: Omit<CustomAlertOptions, "type">) => {
  return Swal.fire({
    ...options,
    icon: undefined,
    confirmButtonText: options.confirmButtonText || "확인",
    confirmButtonColor: colors.primary.main,
    width: options.width || "25rem",
    customClass: {
      ...defaultCustomClass,
      ...options.customClass,
    },
  });
};

// 에러 알림
export const showErrorAlert = (options: Omit<CustomAlertOptions, "type">) => {
  return Swal.fire({
    ...options,
    icon: undefined,
    confirmButtonText: options.confirmButtonText || "확인",
    confirmButtonColor: colors.danger.main,
    width: options.width || "25rem",
    customClass: {
      ...defaultCustomClass,
      ...options.customClass,
    },
  });
};

// 정보 알림
export const showInfoAlert = (options: Omit<CustomAlertOptions, "type">) => {
  return Swal.fire({
    ...options,
    icon: undefined,
    confirmButtonText: options.confirmButtonText || "확인",
    confirmButtonColor: colors.primary.main,
    width: options.width || "25rem",
    customClass: {
      ...defaultCustomClass,
      ...options.customClass,
    },
  });
};

// 확인 다이얼로그 (취소 버튼 포함)
export const showConfirmDialog = (options: CustomConfirmOptions) => {
  return Swal.fire({
    ...options,
    icon: undefined,
    confirmButtonText: options.confirmButtonText || "확인",
    cancelButtonText: options.cancelButtonText || "취소",
    confirmButtonColor: colors.primary.main,
    cancelButtonColor: colors.gray.main,
    width: options.width || "25rem",
    customClass: {
      ...defaultCustomClass,
      ...options.customClass,
    },
  });
};

// 계좌 삭제 확인 다이얼로그 (은행 앱 스타일)
export const showAccountDeleteConfirm = (
  accountNumber: string,
  bankName: string
) => {
  return Swal.fire({
    title: bankName,
    text: `${accountNumber} 계좌를 삭제하시겠어요?`,
    html: `
      <div style="text-align: left; margin-top: 1rem;">
        <p style="color: #666; font-size: 1.1rem; margin: 0; line-height: 1.5;">
          계좌를 삭제하면 이 계좌에 연결된 자동 이체도 함께 삭제됩니다.
        </p>
      </div>
    `,
    icon: undefined,
    showCancelButton: true,
    confirmButtonText: "삭제할래요",
    cancelButtonText: "아니오",
    confirmButtonColor: colors.danger.main,
    cancelButtonColor: colors.gray.light,
    width: "25rem",
    customClass: {
      title: "custom-alert-title",
      confirmButton: "custom-alert-confirm-btn-danger",
      cancelButton: "custom-alert-cancel-btn-gray",
      popup: "custom-alert-popup",
    },
  });
};

// 페이지 이탈 확인 다이얼로그
export const showPageLeaveConfirm = () => {
  return Swal.fire({
    title: "경고",
    html: `
      <div style="text-align: center;">
        <p style="color: #333; font-size: 1.1rem; margin: 0; font-weight: 500;">
          지금 이탈하면 정보가 모두 사라집니다. 그래도 이탈하시겠습니까?
        </p>
      </div>
    `,
    icon: undefined,
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    confirmButtonColor: colors.primary.main,
    cancelButtonColor: colors.gray.main,
    width: "25rem",
    customClass: {
      title: "custom-alert-title",
      confirmButton: "custom-alert-confirm-btn",
      cancelButton: "custom-alert-cancel-btn",
      popup: "custom-alert-popup",
    },
  });
};

// 성공 메시지 (Plan1Q 생성 완료 등)
export const showSuccessMessage = (title: string, message: string) => {
  return Swal.fire({
    title,
    text: message,
    icon: undefined,
    confirmButtonText: "확인",
    confirmButtonColor: colors.primary.main,
    width: "25rem",
    customClass: {
      title: "custom-alert-title",
      confirmButton: "custom-alert-confirm-btn",
      popup: "custom-alert-popup",
    },
  });
};

// 기본 알림 (타입 자동 감지)
export const showAlert = (options: CustomAlertOptions) => {
  return Swal.fire({
    ...options,
    confirmButtonText: options.confirmButtonText || "확인",
    confirmButtonColor: options.type === "error" ? colors.danger.main : 
                       options.type === "warning" ? colors.primary.main :
                       options.type === "success" ? colors.primary.main :
                       colors.primary.main,
    width: options.width || "25rem",
    customClass: {
      ...defaultCustomClass,
      ...options.customClass,
    },
  });
}; 