import { apiClient, CustomApiResponse } from '@/lib/api/client';

// 수동납입 응답 타입
export interface ManualPaymentResponse {
  transactionId: string;
  amount: number;
  currentInstallment: number;
  remainingInstallments: number;
  status: string;
}

// ===== 요청 타입 정의 =====

// 모임통장 채우기 요청 타입 (백엔드 DepositRequest와 일치)
export interface DepositRequest {
  withdrawAccountNumber: string;
  withdrawBankCode: string;
  amount: number;
  depositDescription?: string;
  withdrawDescription?: string;
  fromName?: string;
  toName?: string;
}

// 모임통장에서 보내기 요청 타입 (백엔드 WithdrawRequest와 일치)
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
  toAccountNumber: string;
  toAccountName: string;
  toBankCode: string;
  amount: number;
  frequency: string;
  memo?: string;
  periodMonths: number;
}

// 자동이체 수정 요청 타입 (백엔드 AutoTransferUpdateRequest와 일치)
export interface AutoTransferUpdateRequest {
  toAccountNumber?: string;
  toAccountName?: string;
  toBankCode?: string;
  amount?: number;
  frequency?: string;
  memo?: string;
}

// 계좌주명 조회 요청 타입 (백엔드 AccountHolderNameRequest와 일치)
export interface AccountHolderNameRequest {
  bankCode: string;
  accountNumber: string;
}

// ===== 응답 타입 정의 =====

// 모임통장 채우기 응답 타입 (백엔드 DepositResponse와 일치)
export interface DepositResponse {
  transactionId: number;
  accountNumber: string;
  amount: number;
  balanceAfterTransaction: number;
  description?: string;
  memo?: string;
  transactionDate: string;
  transactionTime: string;
  fromName?: string;
  toName?: string;
  status: string;
  completedAt: string;
}

// 모임통장에서 보내기 응답 타입 (백엔드 WithdrawResponse와 일치)
export interface WithdrawResponse {
  transactionId: number;
  accountNumber: string;
  amount: number;
  balanceAfterTransaction: number;
  description?: string;
  memo?: string;
  transactionDate: string;
  transactionTime: string;
  fromName?: string;
  toName?: string;
  status: string;
  completedAt: string;
}

// 개인 계좌 정보 타입 (백엔드 MyAccountsResponse.AccountInfo와 일치)
export interface AccountInfo {
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

// 개인 계좌 목록 응답 타입 (백엔드 MyAccountsResponse와 일치)
export interface MyAccountsResponse {
  accounts: AccountInfo[];
  totalCount: number;
}

// 자동이체 응답 타입 (백엔드 AutoTransferResponse와 일치)
export interface AutoTransferResponse {
  id: number;
  toAccountNumber: string;
  toAccountName: string;
  toBankCode: string;
  amount: number;
  schedule: string;
  nextTransferDate: string;
  description?: string;
  memo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 자동이체 목록 응답 타입 (실제 백엔드 응답 구조에 맞춤)
export interface AutoTransferListResponse extends Array<AutoTransferResponse> {
  // 실제 백엔드 응답: { success: true, data: [], message: string }
  // data 필드가 AutoTransferResponse 배열이므로 배열 타입으로 정의
}

// 상품별 자동이체 납입 정보 응답 타입
export interface ProductPaymentInfoResponse {
  autoTransferId: number;
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  nextPaymentDate: string;
  currentInstallment: number;
  totalInstallments: number;
  remainingInstallments: number;
  paymentStatus: string;
  isFirstInstallment: boolean;
  lastExecutionDate: string;
}

// 모임통장 정보 응답 타입 (백엔드 AccountInfoResponse와 일치)
export interface AccountInfoResponse {
  accountId: number;
  accountNumber: string;
  accountName: string;
  bankName: string;
  balance: number;
  cardNumber: string;
  dailyLimit: number;
  lastSyncedAt: string;
  isActive: boolean;
}

// 계좌주명 조회 응답 타입 (백엔드 AccountHolderNameResponse와 일치)
export interface AccountHolderNameResponse {
  accountHolderName: string;
}

// 오픈뱅킹 계좌 통합 조회 응답 타입
export interface IntegratedAccountListResponse {
  resList: OpenBankingAccount[];
}

// 오픈뱅킹 계좌 정보 타입
export interface OpenBankingAccount {
  listNum: string;
  bankCodeStd: string;
  activityType: string;
  accountType: string;
  accountNum: string;
  accountNumMasked: string;
  accountSeq: string;
  accountHolderName: string;
  accountIssueDate: string;
  lastTranDate: string;
  productName: string;
  productSubName: string;
  dormancyYn: string;
  balanceAmt: number;
  depositAmt: number;
  balanceCalcBasis1: string | null;
  balanceCalcBasis2: string | null;
  investmentLinkedYn: string | null;
  bankLinkedYn: string | null;
  balanceAfterCancelYn: string | null;
  savingsBankCode: string;
}

// 계좌 등록 요청 타입 (백엔드 AccountRegisterRequest와 일치)
export interface AccountRegisterRequest {
  bankCodeStd: string;
  registerAccountNum: string;
  accountName: string;
  accountType: string;
  coupleAccount: boolean;
}

// 계좌 등록 응답 타입 (백엔드 AccountRegisterResponse와 일치)
export interface AccountRegisterResponse {
  userSeqNo: string;
  accountNum: string;
  accountName: string;
  accountType: string;
  isCoupleAccount: boolean;
}

// 거래내역 카테고리 정보 타입
export interface CategoryInfo {
  id: number;
  name: string;
}

// 거래내역 응답 타입 (백엔드 TransactionResponse와 일치)
export interface TransactionResponse {
  id: number; // accountTransactionId에서 변경
  type: string; // 'deposit' | 'withdraw' (소문자)
  description: string;
  amount: number;
  date: string; // LocalDate
  time: string; // LocalTime
  fromName: string;
  toName: string;
  reviewStatus: string; // 'pending' | 'reviewed' (소문자)
  category?: CategoryInfo; // 중첩 구조
  memo?: string;
  balanceAfterTransaction: number;
}

// 거래내역 목록 응답 타입 (페이징 포함)
export interface TransactionListResponse {
  data: TransactionResponse[];
  pagination: {
    total: number;
    page: number;
    size: number;
    hasNext: boolean;
  };
}

// ===== API 함수들 =====

export const accountApi = {
  // 개인 계좌 목록 조회
  async getMyAccounts(): Promise<CustomApiResponse<MyAccountsResponse>> {
    return apiClient.get<MyAccountsResponse>('/api/account/my-accounts');
  },

  // 모임통장 채우기 (입금)
  async createDeposit(data: DepositRequest): Promise<CustomApiResponse<DepositResponse>> {
    console.group('🏦 [FRONTEND] 모임통장 채우기 요청');
    console.log('📤 요청 데이터:', {
      withdrawAccountNumber: data.withdrawAccountNumber,
      withdrawBankCode: data.withdrawBankCode,
      amount: data.amount,
      depositDescription: data.depositDescription,
      withdrawDescription: data.withdrawDescription,
      fromName: data.fromName,
      toName: data.toName
    });
    console.log('🎯 API 엔드포인트:', '/api/account/deposit');
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.post<DepositResponse>('/api/account/deposit', data);
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message,
        transactionId: response.data?.transactionId,
        amount: response.data?.amount,
        balanceAfterTransaction: response.data?.balanceAfterTransaction,
        status: response.data?.status
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 모임통장에서 보내기 (출금)
  async createWithdraw(data: WithdrawRequest): Promise<CustomApiResponse<WithdrawResponse>> {
    console.group('💸 [FRONTEND] 모임통장에서 보내기 요청');
    console.log('📤 요청 데이터:', {
      depositBankCode: data.depositBankCode,
      depositAccountNumber: data.depositAccountNumber,
      depositAccountHolderName: data.depositAccountHolderName,
      amount: data.amount,
      depositDescription: data.depositDescription,
      withdrawDescription: data.withdrawDescription,
      fromName: data.fromName,
      toName: data.toName
    });
    console.log('🎯 API 엔드포인트:', '/api/account/withdraw');
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.post<WithdrawResponse>('/api/account/withdraw', data);
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message,
        transactionId: response.data?.transactionId,
        amount: response.data?.amount,
        balanceAfterTransaction: response.data?.balanceAfterTransaction,
        status: response.data?.status
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 자동이체 등록
  async createAutoTransfer(data: AutoTransferCreateRequest): Promise<CustomApiResponse<AutoTransferResponse>> {
    return apiClient.post<AutoTransferResponse>('/api/account/auto-transfers', data);
  },

  // 자동이체 수정
  async updateAutoTransfer(id: number, data: AutoTransferUpdateRequest): Promise<CustomApiResponse<AutoTransferResponse>> {
    console.group('🔧 [FRONTEND] 자동이체 수정 요청');
    console.log('📤 요청 데이터:', { id, data });
    console.log('🎯 API 엔드포인트:', `/api/account/auto-transfers/${id}`);
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.put<AutoTransferResponse>(`/api/account/auto-transfers/${id}`, data);
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message,
        autoTransferId: response.data?.id,
        toAccountName: response.data?.toAccountName,
        amount: response.data?.amount
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 자동이체 목록 조회
  async getAutoTransfers(fromAccountNumber: string): Promise<CustomApiResponse<AutoTransferListResponse>> {
    console.group('🔄 [FRONTEND] 자동이체 목록 조회 요청');
    console.log('📤 요청 파라미터:', {
      fromAccountNumber
    });
    console.log('🎯 API 엔드포인트:', `/api/account/auto-transfers?fromAccountNumber=${fromAccountNumber}`);
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.get<AutoTransferListResponse>(`/api/account/auto-transfers?fromAccountNumber=${fromAccountNumber}`);
      
      console.log('📥 원본 응답:', response);
      console.log('📊 응답 구조 분석:', {
        success: response.success,
        message: response.message,
        data: response.data,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : 'null'
      });
      
      if (response.data) {
        console.log('🔍 데이터 상세 구조:', {
          dataLength: response.data.length,
          dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
          firstItem: response.data[0],
          lastItem: response.data[response.data.length - 1]
        });
      }
      
      console.log('✅ 자동이체 목록 조회 완료');
      console.groupEnd();
      return response;
    } catch (error) {
      console.error('❌ 자동이체 목록 조회 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 자동이체 삭제
  async deleteAutoTransfer(id: number): Promise<CustomApiResponse<void>> {
    console.group('🗑️ [FRONTEND] 자동이체 삭제 요청');
    console.log('📤 요청 데이터:', { id });
    console.log('🎯 API 엔드포인트:', `/api/account/auto-transfers/${id}`);
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.delete<void>(`/api/account/auto-transfers/${id}`);
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 자동이체 활성화/비활성화
  async toggleAutoTransfer(id: number, isActive: boolean): Promise<CustomApiResponse<AutoTransferResponse>> {
    return apiClient.put<AutoTransferResponse>(`/api/account/auto-transfers/${id}/toggle`, { isActive });
  },

  // 상품별 자동이체 납입 정보 조회
  async getProductPaymentInfo(toAccountNumber: string): Promise<CustomApiResponse<ProductPaymentInfoResponse[]>> {
    console.group('📊 [FRONTEND] 상품별 자동이체 납입 정보 조회 요청');
    console.log('📤 요청 파라미터:', { toAccountNumber });
    console.log('🎯 API 엔드포인트:', `/api/account/auto-transfers/product-payment-info?toAccountNumber=${toAccountNumber}`);
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.get<ProductPaymentInfoResponse[]>(`/api/account/auto-transfers/product-payment-info?toAccountNumber=${toAccountNumber}`);
      
      console.log('📥 원본 응답:', response);
      console.log('📊 응답 구조 분석:', {
        success: response.success,
        message: response.message,
        data: response.data,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : 'null'
      });
      
      if (response.data) {
        console.log('🔍 데이터 상세 구조:', {
          dataLength: response.data.length,
          dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
          firstItem: response.data[0],
          lastItem: response.data[response.data.length - 1]
        });
      }
      
      console.log('✅ 상품별 자동이체 납입 정보 조회 완료');
      console.groupEnd();
      return response;
    } catch (error) {
      console.error('❌ 상품별 자동이체 납입 정보 조회 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 모임통장 정보 조회
  async getAccountInfo(): Promise<CustomApiResponse<AccountInfoResponse>> {
    return apiClient.get<AccountInfoResponse>('/api/account/info');
  },

  // 모임통장 거래내역 조회
  async getTransactions(params?: {
    page?: number;
    size?: number;
  }): Promise<CustomApiResponse<TransactionListResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/account/transactions?${queryString}` : '/api/account/transactions';
    
    return apiClient.get<TransactionListResponse>(endpoint);
  },

  // 계좌주명 조회
  async getAccountHolderName(bankCode: string, accountNumber: string): Promise<string> {
    console.group('🔍 [FRONTEND] 계좌주명 조회 요청');
    console.log('📤 요청 데이터:', {
      bankCode,
      accountNumber
    });
    console.log('🎯 API 엔드포인트:', '/api/account/holder-name');
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const request: AccountHolderNameRequest = {
        bankCode,
        accountNumber
      };
      
      const response = await apiClient.post<AccountHolderNameResponse>('/api/account/holder-name', request);
      
      if (response.success && response.data?.accountHolderName) {
        console.log('✅ 응답 성공:', {
          success: response.success,
          accountHolderName: response.data.accountHolderName
        });
        console.groupEnd();
        return response.data.accountHolderName;
      } else {
        console.error('❌ 응답 실패:', response.message);
        console.groupEnd();
        throw new Error(response.message || '계좌주명 조회에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      
      // 404 에러 (존재하지 않는 계좌)
      if (error.response?.status === 404) {
        throw new Error('존재하지 않는 계좌입니다.');
      }
      
      // 기타 에러
      throw new Error(error.message || '계좌주명 조회 중 오류가 발생했습니다.');
    }
  },

  // 오픈뱅킹 계좌 통합 조회
  async getIntegratedAccountList(): Promise<CustomApiResponse<IntegratedAccountListResponse>> {
    console.group('🏦 [FRONTEND] 오픈뱅킹 계좌 통합 조회 요청');
    console.log('🎯 API 엔드포인트:', '/api/account/accountinfo-list');
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.post<IntegratedAccountListResponse>('/api/account/accountinfo-list', {});
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message,
        accountCount: response.data?.resList?.length || 0
      });
      console.groupEnd();
      
      return response;
    } catch (error: any) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 계좌 등록
  async registerAccount(data: AccountRegisterRequest): Promise<CustomApiResponse<AccountRegisterResponse>> {
    console.group('📝 [FRONTEND] 계좌 등록 요청');
    console.log('📤 요청 데이터:', data);
    console.log('🎯 API 엔드포인트:', '/api/account/register');
    console.log('⏰ 요청 시간:', new Date().toISOString());
    
    try {
      const response = await apiClient.post<AccountRegisterResponse>('/api/account/register', data);
      
      console.log('✅ 응답 성공:', {
        success: response.success,
        message: response.message,
        accountNum: response.data?.accountNum,
        accountName: response.data?.accountName
      });
      console.groupEnd();
      
      return response;
    } catch (error: any) {
      console.error('❌ 요청 실패:', error);
      console.groupEnd();
      throw error;
    }
  },

  // 수동납입
  async createManualPayment(data: {
    autoTransferId: number;
    amount: number;
    memo?: string;
  }): Promise<CustomApiResponse<ManualPaymentResponse>> {
    console.group('💰 [FRONTEND] 수동납입 요청');
    console.log('📤 요청 데이터:', data);
    
    try {
      const response = await apiClient.post<ManualPaymentResponse>('/api/plan1q/products/manual-payment', data);
      
      console.log('✅ 수동납입 성공:', {
        transactionId: response.data?.transactionId,
        amount: response.data?.amount,
        currentInstallment: response.data?.currentInstallment,
        remainingInstallments: response.data?.remainingInstallments,
        status: response.data?.status
      });
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.error('❌ 수동납입 실패:', error);
      console.groupEnd();
      throw error;
    }
  }
};
