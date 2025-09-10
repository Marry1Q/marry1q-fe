import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Account } from "../types";
import { AccountSelectCard } from "./common/AccountSelectCard";
import { AmountInputCard } from "./common/AmountInputCard";
import { DescriptionInputCard } from "./common/DescriptionInputCard";
import { AccountRegistrationModal } from "./accountRegistration/AccountRegistrationModal";

interface DepositFormProps {
  step: number;
  accounts: Account[];
  selectedAccount: string;
  onAccountChange: (value: string) => void;
  amount: string;
  onAmountChange: (value: string) => void;
  depositDescription: string;
  onDepositDescriptionChange: (value: string) => void;
  withdrawDescription: string;
  onWithdrawDescriptionChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  showAccountSelection?: boolean;
  onAccountsRefresh?: () => void;
}

export function DepositForm({
  step,
  accounts,
  selectedAccount,
  onAccountChange,
  amount,
  onAmountChange,
  depositDescription,
  onDepositDescriptionChange,
  withdrawDescription,
  onWithdrawDescriptionChange,
  onNext,
  onBack,
  showAccountSelection = true,
  onAccountsRefresh,
}: DepositFormProps) {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  
  const selectedAccountInfo = accounts.find(
    (acc) => acc.accountId && acc.accountId.toString() === selectedAccount
  );

  const handleAddMoreAccounts = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleRegistrationSuccess = () => {
    // 계좌 목록 새로고침
    onAccountsRefresh?.();
    setIsRegistrationModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <>
          <AccountSelectCard
            accounts={accounts}
            selectedAccount={selectedAccount}
            onAccountChange={onAccountChange}
            title="어떤 계좌에서 채울까요?"
            placeholder="계좌를 선택하세요"
            onAddMoreAccounts={handleAddMoreAccounts}
          />

          <Button
            onClick={onNext}
            className="w-full py-4 text-lg"
            style={{
              fontFamily: "Hana2-CM",
              backgroundColor: "#008485",
              color: "white",
            }}
            disabled={!selectedAccount || accounts.length === 0}
          >
            다음
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <AmountInputCard
            title="입금 금액"
            amount={amount}
            onAmountChange={onAmountChange}
            maxAmount={selectedAccountInfo?.balance}
          />

          <DescriptionInputCard
            title="모임통장에 표시될 내용"
            description={depositDescription}
            onDescriptionChange={onDepositDescriptionChange}
            placeholder="한글 최대 20자까지 입력 가능합니다"
          />

          <DescriptionInputCard
            title="출금계좌에 표시될 내용"
            description={withdrawDescription}
            onDescriptionChange={onWithdrawDescriptionChange}
            placeholder="한글 최대 20자까지 입력 가능합니다"
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 py-4 text-lg"
              style={{ fontFamily: "Hana2-CM" }}
            >
              이전
            </Button>
            <Button
              onClick={onNext}
              className="flex-1 py-4 text-lg"
              style={{
                fontFamily: "Hana2-CM",
                backgroundColor: "#008485",
                color: "white",
              }}
              disabled={!amount}
            >
              다음
            </Button>
          </div>
        </>
      )}
      
      {/* 계좌 등록 모달 */}
      <AccountRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onSuccess={handleRegistrationSuccess}
        existingAccounts={accounts}
      />
    </div>
  );
}
