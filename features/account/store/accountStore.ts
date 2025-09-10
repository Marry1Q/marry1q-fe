import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  accountApi, 
  MyAccountsResponse, 
  AutoTransferListResponse,
  DepositRequest,
  WithdrawRequest,
  AutoTransferCreateRequest,
  AutoTransferUpdateRequest,
  AccountInfoResponse,
  TransactionListResponse
} from '../api/accountApi';
import { Account, AutoTransfer, MeetingAccount, Transaction } from '../types/account';
import { 
  mapAccountInfoApiResponse, 
  mapMyAccountsApiResponse, 
  mapAutoTransferResponse, 
  mapTransactionsApiResponse 
} from '../utils/accountMapper';
import { showSuccessToast, showErrorToast } from '@/components/ui/toast';

interface AccountState {
  // 상태
  accounts: Account[];
  autoTransfers: AutoTransfer[];
  meetingAccount: MeetingAccount | null;
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    size: number;
    hasNext: boolean;
  };
  isLoading: boolean;
  isCreatingDeposit: boolean;
  isCreatingWithdraw: boolean;
  isCreatingAutoTransfer: boolean;
  isUpdatingAutoTransfer: boolean;
  isDeletingAutoTransfer: boolean;
  error: string | null;

  // 액션
  fetchAccounts: () => Promise<void>;
  fetchAutoTransfers: () => Promise<void>;
  fetchMeetingAccount: () => Promise<void>;
  fetchTransactions: (page?: number, size?: number) => Promise<void>;
  createDeposit: (data: DepositRequest) => Promise<boolean>;
  createWithdraw: (data: WithdrawRequest) => Promise<boolean>;
  createAutoTransfer: (data: AutoTransferCreateRequest) => Promise<boolean>;
  updateAutoTransfer: (id: number, data: AutoTransferUpdateRequest) => Promise<boolean>;
  deleteAutoTransfer: (id: number) => Promise<boolean>;
  toggleAutoTransfer: (id: number, isActive: boolean) => Promise<boolean>;
  clearError: () => void;
  resetState: () => void;
}

const initialState = {
  accounts: [] as Account[],
  autoTransfers: [] as AutoTransfer[],
  meetingAccount: null as MeetingAccount | null,
  transactions: [] as Transaction[],
  pagination: {
    total: 0,
    page: 0,
    size: 20,
    hasNext: false,
  },
  isLoading: false,
  isCreatingDeposit: false,
  isCreatingWithdraw: false,
  isCreatingAutoTransfer: false,
  isUpdatingAutoTransfer: false,
  isDeletingAutoTransfer: false,
  error: null,
};

export const useAccountStore = create<AccountState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // 개인 계좌 목록 조회
      fetchAccounts: async () => {
        try {
          console.log('🏦 개인 계좌 목록 API 호출 시작');
          const response = await accountApi.getMyAccounts();
          
          console.log('📥 개인 계좌 목록 API 원본 응답:', response);
          console.log('📊 개인 계좌 응답 구조 분석:', {
            success: response.success,
            message: response.message,
            data: response.data
          });
          
          // CustomApiResponse 구조: { success, data, message, error, timestamp }
          const accounts = mapMyAccountsApiResponse(response);
          console.log('🔄 변환된 개인 계좌 목록:', accounts);
          
          set({ 
            accounts,
          });
          console.log('💾 개인 계좌 Zustand Store 업데이트 완료');
        } catch (error) {
          console.error('💥 개인 계좌 목록 API 호출 중 에러 발생:', error);
          const errorMessage = error instanceof Error ? error.message : '계좌 목록을 불러오는데 실패했습니다.';
          set({ 
            error: errorMessage,
          });
          showErrorToast(errorMessage);
        }
      },

      // 자동이체 목록 조회
      fetchAutoTransfers: async () => {
        try {
          // 모임통장 정보에서 계좌번호 가져오기
          const meetingAccount = get().meetingAccount;
          console.log('🔍 현재 모임통장 정보:', meetingAccount);
          
          if (!meetingAccount?.accountNumber) {
            console.log('⚠️ 모임통장 정보가 아직 로드되지 않았습니다. 잠시 후 다시 시도합니다.');
            // 잠시 후 다시 시도 (모임통장 정보가 로드될 때까지 대기)
            setTimeout(() => {
              const updatedMeetingAccount = get().meetingAccount;
              if (updatedMeetingAccount?.accountNumber) {
                console.log('🔄 모임통장 정보가 로드되었습니다. 자동이체 목록 조회를 재시도합니다.');
                get().fetchAutoTransfers();
              } else {
                console.log('❌ 모임통장 정보 로드 실패로 자동이체 목록 조회를 건너뜁니다.');
              }
            }, 1000);
            return;
          }
          
          console.log('🔄 자동이체 목록 API 호출 시작 - 계좌번호:', meetingAccount.accountNumber);
          const response = await accountApi.getAutoTransfers(meetingAccount.accountNumber);
          
          console.log('📥 자동이체 목록 API 원본 응답:', response);
          console.log('📊 자동이체 응답 구조 분석:', {
            success: response.success,
            message: response.message,
            data: response.data
          });
          
          // CustomApiResponse 구조: { success, data, message, error, timestamp }
          if (response.success && response.data) {
            console.log('✅ 자동이체 데이터 변환 시작');
            const autoTransfers = mapAutoTransferResponse(response);
            console.log('🔄 변환된 자동이체 목록:', autoTransfers);
            
            set({ 
              autoTransfers,
            });
            console.log('💾 자동이체 Zustand Store 업데이트 완료');
          } else {
            console.error('❌ 자동이체 목록 API 응답 실패:', response);
            const errorMessage = response.error?.message || response.message || '자동이체 목록을 불러오는데 실패했습니다.';
            set({ 
              error: errorMessage,
            });
            showErrorToast(errorMessage);
          }
        } catch (error) {
          console.error('💥 자동이체 목록 API 호출 중 에러 발생:', error);
          const errorMessage = error instanceof Error ? error.message : '자동이체 목록을 불러오는데 실패했습니다.';
          set({ 
            error: errorMessage,
          });
          showErrorToast(errorMessage);
        }
      },

      // 모임통장 정보 조회
      fetchMeetingAccount: async () => {
        try {
          console.log('🏦 모임통장 정보 API 호출 시작');
          const response = await accountApi.getAccountInfo();
          
          console.log('📥 모임통장 정보 API 원본 응답:', response);
          console.log('📊 모임통장 응답 구조 분석:', {
            success: response.success,
            message: response.message,
            data: response.data
          });
          
          // CustomApiResponse 구조: { success, data, message, error, timestamp }
          const meetingAccount = mapAccountInfoApiResponse(response);
          console.log('🔄 변환된 모임통장 정보:', meetingAccount);
          
          set({ 
            meetingAccount,
          });
          console.log('💾 모임통장 Zustand Store 업데이트 완료');
        } catch (error) {
          console.error('💥 모임통장 정보 API 호출 중 에러 발생:', error);
          const errorMessage = error instanceof Error ? error.message : '모임통장 정보를 불러오는데 실패했습니다.';
          set({ 
            error: errorMessage,
          });
          showErrorToast(errorMessage);
        }
      },

      // 거래내역 조회
      fetchTransactions: async (page = 0, size = 20) => {
        try {
          console.log('🔍 거래내역 API 호출 시작:', { page, size });
          const response = await accountApi.getTransactions({ page, size });
          
          console.log('📥 거래내역 API 원본 응답:', response);
          console.log('📊 응답 구조 분석:', {
            success: response.success,
            message: response.message,
            data: response.data,
            dataType: typeof response.data,
            dataKeys: response.data ? Object.keys(response.data) : 'null'
          });
          
          // 데이터 구조 상세 로깅
          if (response.data) {
            const data = response.data as any; // 타입 안전성을 위해 any로 캐스팅
            console.log('🔍 데이터 상세 구조:', {
              transactions: data.transactions,
              transactionsLength: data.transactions?.length,
              data: data.data,
              dataLength: data.data?.length,
              pagination: data.pagination
            });
          }
          
          // CustomApiResponse 구조: { success, data, message, error, timestamp }
          const { transactions, pagination } = mapTransactionsApiResponse(response);
          console.log('🔄 변환된 거래내역:', transactions);
          console.log('📄 변환된 페이징 정보:', pagination);
          
          set({ 
            transactions,
            pagination,
          });
          console.log('💾 Zustand Store 업데이트 완료');
        } catch (error) {
          console.error('💥 거래내역 API 호출 중 에러 발생:', error);
          const errorMessage = error instanceof Error ? error.message : '거래내역을 불러오는데 실패했습니다.';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          showErrorToast(errorMessage);
        }
      },

      // 모임통장 채우기 (입금)
      createDeposit: async (data: DepositRequest) => {
        set({ isCreatingDeposit: true, error: null });
        
        try {
          const response = await accountApi.createDeposit(data);
          
          if (response.success && response.data) {
            showSuccessToast("모임통장에 성공적으로 입금되었습니다!");
            set({ isCreatingDeposit: false });
            return true;
          } else {
            set({ 
              error: response.error?.message || '입금 처리에 실패했습니다.',
              isCreatingDeposit: false 
            });
            showErrorToast("입금 처리에 실패했습니다.");
            return false;
          }
        } catch (error) {
          console.error('Create deposit error:', error);
          set({ 
            error: '입금 처리에 실패했습니다.',
            isCreatingDeposit: false 
          });
          showErrorToast("입금 처리에 실패했습니다.");
          return false;
        }
      },

      // 모임통장에서 보내기 (출금)
      createWithdraw: async (data: WithdrawRequest) => {
        set({ isCreatingWithdraw: true, error: null });
        
        try {
          const response = await accountApi.createWithdraw(data);
          
          if (response.success && response.data) {
            showSuccessToast("성공적으로 출금되었습니다!");
            set({ isCreatingWithdraw: false });
            return true;
          } else {
            set({ 
              error: response.error?.message || '출금 처리에 실패했습니다.',
              isCreatingWithdraw: false 
            });
            showErrorToast("출금 처리에 실패했습니다.");
            return false;
          }
        } catch (error) {
          console.error('Create withdraw error:', error);
          set({ 
            error: '출금 처리에 실패했습니다.',
            isCreatingWithdraw: false 
          });
          showErrorToast("출금 처리에 실패했습니다.");
          return false;
        }
      },

      // 자동이체 등록
      createAutoTransfer: async (data: AutoTransferCreateRequest) => {
        set({ isCreatingAutoTransfer: true, error: null });
        
        try {
          console.log('🔧 자동이체 등록 API 호출 시작:', data);
          const response = await accountApi.createAutoTransfer(data);
          console.log('📥 자동이체 등록 API 원본 응답:', response);
          
          if (response.success && response.data) {
            console.log('✅ 자동이체 등록 성공');
            // 자동이체 목록 새로고침
            await get().fetchAutoTransfers();
            
            showSuccessToast("자동이체가 등록되었습니다!");
            set({ isCreatingAutoTransfer: false });
            return true;
          } else {
            console.error('❌ 자동이체 등록 실패:', response);
            const errorMessage = response.error?.message || response.message || '자동이체 등록에 실패했습니다.';
            set({ 
              error: errorMessage,
              isCreatingAutoTransfer: false 
            });
            showErrorToast("자동이체 등록에 실패했습니다.");
            return false;
          }
        } catch (error) {
          console.error('💥 자동이체 등록 API 호출 중 에러 발생:', error);
          set({ 
            error: '자동이체 등록에 실패했습니다.',
            isCreatingAutoTransfer: false 
          });
          showErrorToast("자동이체 등록에 실패했습니다.");
          return false;
        }
      },

      // 자동이체 수정
      updateAutoTransfer: async (id: number, data: AutoTransferUpdateRequest) => {
        set({ isUpdatingAutoTransfer: true, error: null });
        
        try {
          console.log('🔧 자동이체 수정 API 호출 시작:', { id, data });
          const response = await accountApi.updateAutoTransfer(id, data);
          console.log('📥 자동이체 수정 API 원본 응답:', response);
          
          if (response.success && response.data) {
            console.log('✅ 자동이체 수정 성공');
            // 자동이체 목록 새로고침
            await get().fetchAutoTransfers();
            
            showSuccessToast("자동이체가 수정되었습니다!");
            set({ isUpdatingAutoTransfer: false });
            return true;
          } else {
            console.error('❌ 자동이체 수정 실패:', response);
            const errorMessage = response.error?.message || response.message || '자동이체 수정에 실패했습니다.';
            set({ 
              error: errorMessage,
              isUpdatingAutoTransfer: false 
            });
            showErrorToast("자동이체 수정에 실패했습니다.");
            return false;
          }
        } catch (error) {
          console.error('💥 자동이체 수정 API 호출 중 에러 발생:', error);
          set({ 
            error: '자동이체 수정에 실패했습니다.',
            isUpdatingAutoTransfer: false 
          });
          showErrorToast("자동이체 수정에 실패했습니다.");
          return false;
        }
      },

      // 자동이체 삭제
      deleteAutoTransfer: async (id: number) => {
        set({ isDeletingAutoTransfer: true, error: null });
        
        try {
          console.log('🗑️ 자동이체 삭제 API 호출 시작:', { id });
          const response = await accountApi.deleteAutoTransfer(id);
          console.log('📥 자동이체 삭제 API 원본 응답:', response);
          
          if (response.success) {
            console.log('✅ 자동이체 삭제 성공');
            // 자동이체 목록 새로고침
            await get().fetchAutoTransfers();
            
            showSuccessToast("자동이체가 삭제되었습니다!");
            set({ isDeletingAutoTransfer: false });
            return true;
          } else {
            console.error('❌ 자동이체 삭제 실패:', response);
            const errorMessage = response.error?.message || response.message || '자동이체 삭제에 실패했습니다.';
            set({ 
              error: errorMessage,
              isDeletingAutoTransfer: false 
            });
            showErrorToast("자동이체 삭제에 실패했습니다.");
            return false;
          }
        } catch (error) {
          console.error('💥 자동이체 삭제 API 호출 중 에러 발생:', error);
          set({ 
            error: '자동이체 삭제에 실패했습니다.',
            isDeletingAutoTransfer: false 
          });
          showErrorToast("자동이체 삭제에 실패했습니다.");
          return false;
        }
      },

      // 자동이체 활성화/비활성화
      toggleAutoTransfer: async (id: number, isActive: boolean) => {
        try {
          const response = await accountApi.toggleAutoTransfer(id, isActive);
          
          if (response.success && response.data) {
            // 자동이체 목록 새로고침
            await get().fetchAutoTransfers();
            
            const status = isActive ? '활성화' : '비활성화';
            showSuccessToast(`자동이체가 ${status}되었습니다!`);
            return true;
          } else {
            const status = isActive ? '활성화' : '비활성화';
            showErrorToast(`자동이체 ${status}에 실패했습니다.`);
            return false;
          }
        } catch (error) {
          console.error('Toggle auto transfer error:', error);
          const status = isActive ? '활성화' : '비활성화';
          showErrorToast(`자동이체 ${status}에 실패했습니다.`);
          return false;
        }
      },

      // 에러 초기화
      clearError: () => {
        set({ error: null });
      },

      // 상태 초기화
      resetState: () => {
        set(initialState);
      },
    }),
    {
      name: 'account-store',
    }
  )
);
