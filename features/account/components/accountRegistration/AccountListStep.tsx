import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CreditCard } from "lucide-react";
import { accountApi, OpenBankingAccount } from "../../api/accountApi";
import { Account } from "../../types";
import { AccountCard } from "./AccountCard";
import { SelectionHeader } from "./SelectionHeader";
import { PasswordModal } from "@/components/ui/PasswordModal";
import { showErrorToast } from "@/components/ui/toast";
import { authApi } from "@/lib/api/authApi";

interface AccountListStepProps {
  onNext: (selectedAccounts: OpenBankingAccount[]) => void;
  onClose: () => void;
  existingAccounts: Account[];
}

export function AccountListStep({ onNext, onClose, existingAccounts }: AccountListStepProps) {
  const [accounts, setAccounts] = useState<OpenBankingAccount[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  // 계좌 목록 조회
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await accountApi.getIntegratedAccountList();
        
        if (response.success && response.data?.resList) {
          // 모임통장과 이미 등록된 계좌 제외
          const filteredAccounts = response.data.resList.filter(account => {
            // 모임통장 제외
            if (account.productName.includes("모임")) {
              return false;
            }
            
            // 이미 등록된 계좌 제외
            const isAlreadyRegistered = existingAccounts.some(existing => 
              existing.accountNumber === account.accountNum
            );
            
            return !isAlreadyRegistered;
          });
          
          setAccounts(filteredAccounts);
        }
      } catch (err: any) {
        console.error('계좌 목록 조회 실패:', err);
        setError(err.message || '계좌 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [existingAccounts]);

  const isAllSelected = selectedAccounts.length === accounts.length && accounts.length > 0;

  const handleSelectAll = () => {
    setSelectedAccounts(accounts.map(account => account.accountNum));
  };

  const handleDeselectAll = () => {
    setSelectedAccounts([]);
  };

  const handleToggleAccount = (accountNum: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountNum) 
        ? prev.filter(num => num !== accountNum)
        : [...prev, accountNum]
    );
  };

  const handleNext = () => {
    if (selectedAccounts.length === 0) return;
    
    // 핀 번호 모달 표시
    setShowPasswordModal(true);
  };

  // 핀 번호 확인 후 계좌 선택 완료
  const handlePasswordConfirm = async () => {
    if (password.length !== 6) {
      showErrorToast("6자리 핀 번호를 입력해주세요.");
      return;
    }

    try {
      // 1. 핀 번호 검증 API 호출
      const pinVerificationResponse = await authApi.verifyPin(password);
      
      if (!pinVerificationResponse.success || !pinVerificationResponse.data?.valid) {
        showErrorToast("핀 번호가 올바르지 않습니다.");
        return;
      }

      // 2. 핀 번호 검증 성공 시 계좌 선택 완료
      const selectedAccountObjects = accounts.filter(account => 
        selectedAccounts.includes(account.accountNum)
      );
      
      setShowPasswordModal(false);
      onNext(selectedAccountObjects);
    } catch (error: any) {
      console.error("핀 번호 검증 실패:", error);
      showErrorToast(error.response?.data?.error?.message || error.message || "핀 번호 검증 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <SelectionHeader
        title="계좌 선택"
        totalCount={accounts.length}
        selectedCount={selectedAccounts.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        isAllSelected={isAllSelected}
        isLoading={isLoading}
      />
      
      {isLoading ? (
        <LoadingSpinner text="계좌 목록을 불러오는 중..." />
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <p className="text-red-600 mb-4" style={{ fontFamily: "Hana2-CM" }}>
            {error}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            style={{ backgroundColor: "#008485" }}
          >
            다시 시도
          </Button>
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-8">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "Hana2-CM" }}>
            등록 가능한 계좌가 없습니다
          </h3>
          <p className="text-gray-600" style={{ fontFamily: "Hana2-Medium" }}>
            모든 계좌가 이미 등록되었거나 모임통장입니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {accounts.map(account => (
            <AccountCard
              key={account.accountNum}
              account={account}
              isSelected={selectedAccounts.includes(account.accountNum)}
              onToggle={handleToggleAccount}
            />
          ))}
        </div>
      )}
      
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          취소
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={selectedAccounts.length === 0}
          className="flex-1"
          style={{
            fontFamily: "Hana2-CM",
            backgroundColor: "#008485",
            color: "white",
          }}
        >
          추가하기 ({selectedAccounts.length})
        </Button>
      </div>
      
      {/* 핀 번호 입력 모달 */}
      <PasswordModal
        isOpen={showPasswordModal}
        onOpenChange={setShowPasswordModal}
        password={password}
        onPasswordChange={setPassword}
        onConfirm={handlePasswordConfirm}
      />
    </div>
  );
}
