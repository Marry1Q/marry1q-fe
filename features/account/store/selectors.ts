import { useAccountStore } from './accountStore';
import { Account, AutoTransfer } from '../types/account';

// 계좌 관련 selectors
export const useAccounts = () => useAccountStore(state => state.accounts);
export const useAccountsLoading = () => useAccountStore(state => state.isLoading);
export const useAccountsError = () => useAccountStore(state => state.error);

// 자동이체 관련 selectors
export const useAutoTransfers = () => useAccountStore(state => state.autoTransfers);
export const useAutoTransfersLoading = () => useAccountStore(state => state.isLoading);
export const useAutoTransfersError = () => useAccountStore(state => state.error);

// 모임통장 관련 selectors
export const useMeetingAccount = () => useAccountStore(state => state.meetingAccount);

// 거래내역 관련 selectors
export const useTransactions = () => useAccountStore(state => state.transactions);
export const usePagination = () => useAccountStore(state => state.pagination);

// 로딩 상태 selectors
export const useIsCreatingDeposit = () => useAccountStore(state => state.isCreatingDeposit);
export const useIsCreatingWithdraw = () => useAccountStore(state => state.isCreatingWithdraw);
export const useIsCreatingAutoTransfer = () => useAccountStore(state => state.isCreatingAutoTransfer);
export const useIsUpdatingAutoTransfer = () => useAccountStore(state => state.isUpdatingAutoTransfer);
export const useIsDeletingAutoTransfer = () => useAccountStore(state => state.isDeletingAutoTransfer);

// 액션 selectors - 개별 함수로 분리
export const useFetchAccounts = () => useAccountStore(state => state.fetchAccounts);
export const useFetchAutoTransfers = () => useAccountStore(state => state.fetchAutoTransfers);
export const useFetchMeetingAccount = () => useAccountStore(state => state.fetchMeetingAccount);
export const useFetchTransactions = () => useAccountStore(state => state.fetchTransactions);
export const useCreateDeposit = () => useAccountStore(state => state.createDeposit);
export const useCreateWithdraw = () => useAccountStore(state => state.createWithdraw);
export const useCreateAutoTransfer = () => useAccountStore(state => state.createAutoTransfer);
export const useUpdateAutoTransfer = () => useAccountStore(state => state.updateAutoTransfer);
export const useDeleteAutoTransfer = () => useAccountStore(state => state.deleteAutoTransfer);
export const useToggleAutoTransfer = () => useAccountStore(state => state.toggleAutoTransfer);
export const useClearError = () => useAccountStore(state => state.clearError);
export const useResetState = () => useAccountStore(state => state.resetState);

// 계산된 값 selectors
export const useTotalAccountBalance = () => {
  const accounts = useAccounts();
  return accounts.reduce((total, account) => total + account.balance, 0);
};

export const useActiveAutoTransfers = () => {
  const autoTransfers = useAutoTransfers();
  return autoTransfers.filter(transfer => transfer.active);
};

export const useInactiveAutoTransfers = () => {
  const autoTransfers = useAutoTransfers();
  return autoTransfers.filter(transfer => !transfer.active);
};

export const useAutoTransfersByBank = (bankCode: string) => {
  const autoTransfers = useAutoTransfers();
  return autoTransfers.filter(transfer => transfer.toBankCode === bankCode);
};

export const useAccountById = (accountId: number) => {
  const accounts = useAccounts();
  return accounts.find(account => account.accountId === accountId);
};

export const useAutoTransferById = (id: number) => {
  const autoTransfers = useAutoTransfers();
  return autoTransfers.find(transfer => transfer.id === id);
};

// 통계 selectors
export const useAutoTransferStats = () => {
  const autoTransfers = useAutoTransfers();
  const activeCount = autoTransfers.filter(t => t.active).length;
  const totalAmount = autoTransfers.reduce((sum, t) => sum + t.amount, 0);
  
  return {
    totalCount: autoTransfers.length,
    activeCount,
    inactiveCount: autoTransfers.length - activeCount,
    totalAmount,
    averageAmount: autoTransfers.length > 0 ? totalAmount / autoTransfers.length : 0,
  };
};

// 거래내역 통계 selectors
export const useTransactionStats = () => {
  const transactions = useTransactions();
  const deposits = transactions.filter(t => t.type === '입금');
  const withdrawals = transactions.filter(t => t.type === '출금');
  
  const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);
  
  return {
    totalCount: transactions.length,
    depositCount: deposits.length,
    withdrawalCount: withdrawals.length,
    totalDeposits,
    totalWithdrawals,
    netAmount: totalDeposits - totalWithdrawals,
  };
};

export const useTransactionsByCategory = (categoryId: number) => {
  const transactions = useTransactions();
  return transactions.filter(t => t.financeCategoryId === categoryId);
};

export const useTransactionsByType = (type: '입금' | '출금') => {
  const transactions = useTransactions();
  return transactions.filter(t => t.type === type);
};

// 필터링된 계좌 selectors
export const useAccountsByBank = (bankCode: string) => {
  const accounts = useAccounts();
  return accounts.filter(account => account.bank === bankCode);
};

export const useCoupleAccounts = () => {
  const accounts = useAccounts();
  return accounts.filter(account => account.isCoupleAccount);
};

export const usePersonalAccounts = () => {
  const accounts = useAccounts();
  return accounts.filter(account => !account.isCoupleAccount);
};

// 에러 상태 selector
export const useHasError = () => {
  const error = useAccountsError();
  return !!error;
};
