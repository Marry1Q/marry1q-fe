// 계좌 정보 타입
export interface Account {
  accountId: number;
  bank: string;
  accountNumber: string;
  accountName: string;
  balance: number;
  isCoupleAccount: boolean;
  userSeqNo: string;
  lastSyncedAt: string;
  balanceStatus: string;
  errorMessage?: string;
}

// 거래 내역 타입
export interface Transaction {
  id: number;
  type: '입금' | '출금';
  description: string;
  amount: number;
  memo?: string;
  transactionDate: string;
  transactionTime: string;
  fromName: string;
  toName: string;
  reviewStatus: 'PENDING' | 'REVIEWED';
  accountNumber: string;
  accountId: number;
  financeCategoryId: number | null;
  balanceAfterTransaction: number;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;
  categoryIcon?: string;
}

// 자동이체 타입 (백엔드 AutoTransferResponse와 매칭)
export interface AutoTransfer {
  id: number;
  name: string; // 계좌주명
  amount: number;
  frequency: string; // 이체 주기
  nextDate: string; // 다음 이체 예정일
  active: boolean; // 활성화 여부
  toAccountNumber?: string; // 수신 계좌번호
  toBankCode?: string; // 수신 은행코드
  bankName?: string; // 은행명 (프론트엔드에서 사용)
  memo?: string; // 메모
  periodMonths?: number; // 자동이체 기간 (개월)
}

// 모임통장 정보 타입
export interface MeetingAccount {
  id: number;
  bank: string;
  accountNumber: string;
  accountName: string;
  balance: number;
  isCoupleAccount: boolean;
  userSeqNo: string;
  lastSyncedAt: string;
  balanceStatus: string;
  cardNumber: string;
  dailyLimit: number;
  isActive: boolean;
}

// 입금 요청 타입
export interface DepositRequest {
  withdrawAccountNumber: string;
  withdrawBankCode: string;
  amount: number;
  depositDescription?: string;
  withdrawDescription?: string;
  fromName?: string;
  toName?: string;
}

// 출금 요청 타입
export interface WithdrawRequest {
  depositBankCode: string;
  depositAccountNumber: string;
  depositAccountHolderName: string;
  amount: number;
  depositDescription?: string;
  withdrawDescription?: string;
  fromName?: string;
  toName?: string;
}

// 자동이체 생성 요청 타입 (백엔드 AutoTransferCreateRequest와 일치)
export interface AutoTransferCreateRequest {
  fromAccountNumber: string; // 모임통장 계좌번호 (필수)
  toAccountNumber: string;
  toAccountName: string;
  toBankCode: string;
  amount: number;
  frequency: string; // schedule → frequency로 변경
  memo?: string;
}

// 자동이체 수정 요청 타입 (백엔드 AutoTransferUpdateRequest와 일치)
export interface AutoTransferUpdateRequest {
  toAccountNumber?: string;
  toAccountName?: string;
  toBankCode?: string;
  amount?: number;
  frequency?: string; // schedule → frequency로 변경
  memo?: string;
}

// 수동납입 응답 타입 (백엔드 ManualPaymentResponse와 일치)
export interface ManualPaymentResponse {
  transactionId: string;
  amount: number;
  balanceAfterTransaction: number;
  currentInstallment: number;
  remainingInstallments: number;
  status: string;
  completedAt: string;
}
