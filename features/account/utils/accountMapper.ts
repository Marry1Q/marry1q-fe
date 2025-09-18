import { AccountInfoResponse, TransactionResponse, MyAccountsResponse } from '../api/accountApi';
import { CustomApiResponse } from '@/lib/api/client';
import { Account, Transaction, MeetingAccount, AutoTransfer } from '../types/account';
import { getCategoryIcon, getCategoryName } from './categoryUtils';

// 백엔드 API 응답을 프론트엔드 타입으로 변환

// 모임통장 정보 변환
export const mapAccountInfoResponse = (response: AccountInfoResponse): MeetingAccount => {
  return {
    id: response.accountId,
    bank: response.bankName || '하나은행',
    accountNumber: response.accountNumber,
    accountName: response.accountName,
    balance: Number(response.balance),
    isCoupleAccount: true,
    userSeqNo: '', // 모임통장은 userSeqNo가 없을 수 있음
    lastSyncedAt: response.lastSyncedAt?.toString() || new Date().toISOString(),
    balanceStatus: 'SUCCESS',
    // 카드번호는 목데이터로 설정
    cardNumber: '5310-****-****-1234',
    // 일일 한도 추가
    dailyLimit: Number(response.dailyLimit) || 5000000,
    isActive: response.isActive || true,
    safeAccountNumber: response.safeAccountNumber, // 안심계좌번호 추가
  };
};

// 거래내역 변환 (백엔드 실제 응답 구조에 맞춰 수정)
export const mapTransactionResponse = (response: any): Transaction => {
  // 백엔드 실제 응답이 구식 구조일 수 있으므로 안전하게 처리
  const id = response.id || response.accountTransactionId;
  const type = response.type || response.transactionType;
  const date = response.date || response.transactionDate;
  const time = response.time || response.transactionTime;
  
  return {
    id: Number(id),
    type: (type === 'deposit' || type === 'DEPOSIT') ? '입금' : '출금',
    amount: Number(response.amount),
    description: response.description || '',
    memo: response.memo,
    transactionDate: date || '',
    transactionTime: time || '',
    fromName: response.fromName || '',
    toName: response.toName || '',
    reviewStatus: (response.reviewStatus === 'pending' || response.reviewStatus === 'PENDING') ? 'PENDING' : 'REVIEWED',
    accountNumber: response.accountNumber || '',
    accountId: Number(response.accountId) || 0,
    financeCategoryId: response.category?.id || response.financeCategoryId || null,
    balanceAfterTransaction: Number(response.balanceAfterTransaction) || 0,
    createdAt: response.createdAt || '',
    updatedAt: response.updatedAt || '',
    // 카테고리 정보
    categoryName: response.category?.name || getCategoryName(response.category?.id || response.financeCategoryId || null),
    categoryIcon: getCategoryIcon(response.category?.id || response.financeCategoryId || null),
  };
};

// 개인 계좌 목록 변환
export const mapMyAccountsResponse = (response: MyAccountsResponse): Account[] => {
  return response.accounts.map(account => ({
    accountId: account.accountId,
    bank: account.bank,
    accountNumber: account.accountNumber,
    accountName: account.accountName,
    balance: Number(account.balance),
    isCoupleAccount: account.isCoupleAccount,
    userSeqNo: account.userSeqNo,
    lastSyncedAt: account.lastSyncedAt,
    balanceStatus: account.balanceStatus,
  }));
};

// 자동이체 응답 변환 (백엔드 AutoTransferResponse와 일치)
export const mapAutoTransferResponse = (response: any): AutoTransfer[] => {
  console.group('🔄 [MAPPER] 자동이체 응답 변환');
  console.log('📥 원본 응답:', response);
  console.log('📊 응답 구조 분석:', {
    success: response.success,
    message: response.message,
    data: response.data,
    dataType: typeof response.data,
    isArray: Array.isArray(response.data),
    dataLength: response.data?.length
  });
  
  // 백엔드 응답 구조: { data: [], message: string, status: string }
  // data가 빈 배열이면 빈 배열 반환
  if (!response.data || response.data.length === 0) {
    console.log('📭 데이터가 없음 - 빈 배열 반환');
    console.groupEnd();
    return [];
  }
  
  const mappedData = response.data.map((item: any, index: number) => {
    console.log(`🔍 아이템 ${index} 변환:`, item);
    
    const mappedItem = {
      id: item.autoTransferId || item.id,
      name: item.toAccountName,                    // 계좌주명
      amount: Number(item.amount),        // 금액
      frequency: item.schedule,          // 이체 주기 (백엔드에서는 schedule 필드)
      nextDate: item.nextTransferDate,            // 다음 이체 예정일
      active: item.status === 'ACTIVE',                // 활성화 여부
      // 추가 필드들 (필요시)
      toAccountNumber: item.toAccountNumber,
      toBankCode: item.toBankCode,
      memo: item.memo,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
    
    console.log(`✅ 변환된 아이템 ${index}:`, mappedItem);
    return mappedItem;
  });
  
  console.log('🎯 최종 변환 결과:', mappedData);
  console.groupEnd();
  return mappedData;
};

// 거래내역 목록 변환 (페이징 정보 포함)
// 백엔드 응답 구조: { transactions: [...], pagination: {...} }
export const mapTransactionsResponse = (response: any): {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    size: number;
    hasNext: boolean;
  };
} => {
  // 안전하게 데이터 처리
  const transactionData = response?.transactions || [];
  const paginationData = response?.pagination || {
    total: 0,
    page: 0,
    size: 20,
    hasNext: false
  };

  return {
    transactions: Array.isArray(transactionData) ? transactionData.map(mapTransactionResponse) : [],
    pagination: {
      total: paginationData.total || 0,
      page: paginationData.page || 0,
      size: paginationData.size || 20,
      hasNext: paginationData.hasNext || false,
    },
  };
};

// CustomApiResponse 래퍼를 처리하는 매퍼 함수들
export const mapCustomApiResponse = <T, U>(
  response: CustomApiResponse<T>,
  mapper: (data: T) => U
): U => {
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '데이터를 가져오는데 실패했습니다.');
  }
  return mapper(response.data);
};

// 개인 계좌 목록 API 응답 처리
export const mapMyAccountsApiResponse = (response: CustomApiResponse<MyAccountsResponse>): Account[] => {
  return mapCustomApiResponse(response, mapMyAccountsResponse);
};

// 모임통장 정보 API 응답 처리
export const mapAccountInfoApiResponse = (response: CustomApiResponse<AccountInfoResponse>): MeetingAccount => {
  return mapCustomApiResponse(response, mapAccountInfoResponse);
};

// 거래내역 목록 API 응답 처리
export const mapTransactionsApiResponse = (response: CustomApiResponse<any>): {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    size: number;
    hasNext: boolean;
  };
} => {
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '데이터를 가져오는데 실패했습니다.');
  }
  
  // 백엔드 응답 구조: { data: { transactions: [...], pagination: {...} } }
  const data = response.data;
  
  // transactions 배열 처리
  const transactionData = data.transactions || [];
  const transactions = Array.isArray(transactionData) 
    ? transactionData.map(mapTransactionResponse) 
    : [];
  
  // pagination 정보 처리
  const paginationData = data.pagination || {
    total: 0,
    page: 0,
    size: 20,
    hasNext: false
  };
  
  const pagination = {
    total: paginationData.total || 0,
    page: paginationData.page || 0,
    size: paginationData.size || 20,
    hasNext: paginationData.hasNext || false,
  };
  
  return { transactions, pagination };
};
