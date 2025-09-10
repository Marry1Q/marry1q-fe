# CustomAlert 컴포넌트

은행 앱 스타일의 일관된 알림/확인 다이얼로그를 제공하는 공통 컴포넌트입니다.

## 특징

- 🎨 은행 앱 스타일의 UI (한화 폰트, 둥근 모서리, 그림자 효과)
- 🎯 다양한 알림 타입 지원 (성공, 경고, 에러, 정보, 확인)
- 🔧 TypeScript 타입 지원
- 📱 반응형 디자인
- 🎭 호버 효과 및 애니메이션

## 설치

이미 SweetAlert2가 설치되어 있어야 합니다:

```bash
npm install sweetalert2
```

## 사용법

### 기본 알림

```typescript
import { showSuccessAlert, showWarningAlert, showErrorAlert, showInfoAlert } from "@/components/ui/CustomAlert";

// 성공 알림
showSuccessAlert({
  title: "성공!",
  text: "작업이 완료되었습니다."
});

// 경고 알림
showWarningAlert({
  title: "경고",
  text: "이 작업은 되돌릴 수 없습니다."
});

// 에러 알림
showErrorAlert({
  title: "오류 발생",
  text: "작업 중 오류가 발생했습니다."
});

// 정보 알림
showInfoAlert({
  title: "정보",
  text: "이것은 정보 메시지입니다."
});
```

### 확인 다이얼로그

```typescript
import { showConfirmDialog } from "@/components/ui/CustomAlert";

const result = await showConfirmDialog({
  title: "확인",
  text: "정말로 이 작업을 수행하시겠습니까?",
  confirmButtonText: "확인",
  cancelButtonText: "취소",
  showCancelButton: true,
});

if (result.isConfirmed) {
  // 사용자가 확인을 클릭한 경우
  console.log("확인됨");
}
```

### 특화된 다이얼로그

```typescript
import { 
  showAccountDeleteConfirm, 
  showPageLeaveConfirm, 
  showSuccessMessage 
} from "@/components/ui/CustomAlert";

// 계좌 삭제 확인 (은행 앱 스타일)
showAccountDeleteConfirm("356 03", "NH농협은행");

// 페이지 이탈 확인
showPageLeaveConfirm();

// 성공 메시지
showSuccessMessage(
  "Plan1Q 생성 완료!",
  "버킷리스트 목표를 위한 포트폴리오가 성공적으로 생성되었습니다."
);
```

## API

### CustomAlertOptions

```typescript
interface CustomAlertOptions {
  title: string;                    // 제목
  text?: string;                    // 내용
  type?: "success" | "warning" | "error" | "info" | "question";
  confirmButtonText?: string;       // 확인 버튼 텍스트
  cancelButtonText?: string;        // 취소 버튼 텍스트
  showCancelButton?: boolean;       // 취소 버튼 표시 여부
  width?: string;                   // 다이얼로그 너비
  customClass?: {                   // 커스텀 CSS 클래스
    title?: string;
    confirmButton?: string;
    cancelButton?: string;
    popup?: string;
  };
}
```

### 함수 목록

| 함수 | 설명 | 반환값 |
|------|------|--------|
| `showSuccessAlert(options)` | 성공 알림 | Promise<SweetAlertResult> |
| `showWarningAlert(options)` | 경고 알림 | Promise<SweetAlertResult> |
| `showErrorAlert(options)` | 에러 알림 | Promise<SweetAlertResult> |
| `showInfoAlert(options)` | 정보 알림 | Promise<SweetAlertResult> |
| `showConfirmDialog(options)` | 확인/취소 다이얼로그 | Promise<SweetAlertResult> |
| `showAccountDeleteConfirm(accountNumber, bankName)` | 계좌 삭제 확인 | Promise<SweetAlertResult> |
| `showPageLeaveConfirm()` | 페이지 이탈 확인 | Promise<SweetAlertResult> |
| `showSuccessMessage(title, message)` | 성공 메시지 | Promise<SweetAlertResult> |

## 스타일링

컴포넌트는 다음 CSS 클래스들을 사용합니다:

- `.custom-alert-title` - 제목 스타일
- `.custom-alert-popup` - 팝업 컨테이너 스타일
- `.custom-alert-confirm-btn` - 확인 버튼 스타일
- `.custom-alert-confirm-btn-danger` - 위험한 작업용 확인 버튼
- `.custom-alert-cancel-btn` - 취소 버튼 스타일
- `.custom-alert-cancel-btn-gray` - 회색 취소 버튼

## 색상 테마

컴포넌트는 `@/constants/colors.ts`의 색상을 사용합니다:

- 성공: `colors.success.main` (#2ecc71)
- 경고: `colors.warning.main` (#f1c40f)
- 에러: `colors.danger.main` (#e74c3c)
- 정보: `colors.primary.main` (#008485)
- 취소: `colors.gray.main` (#95a5a6)

## 폰트

한화 폰트를 사용합니다:

- 제목: `Hana2-Medium`
- 내용: `Hana2-Regular`

## 테스트

테스트 페이지를 확인하려면 `/alert-test` 경로로 이동하세요. 