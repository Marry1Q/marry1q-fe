import { Button } from "@/components/ui/button";
import { AccountInputCard } from "./common/AccountInputCard";
import { AmountInputCard } from "./common/AmountInputCard";
import { DescriptionInputCard } from "./common/DescriptionInputCard";
import { AccountInfoResponse } from "@/features/account/api/accountApi";

interface WithdrawFormProps {
  step: number;
  bankName: string;
  onBankNameChange: (value: string) => void;
  accountNumber: string;
  onAccountNumberChange: (value: string) => void;
  accountName: string;
  onAccountNameChange: (value: string) => void;
  amount: string;
  onAmountChange: (value: string) => void;
  depositDescription: string;
  onDepositDescriptionChange: (value: string) => void;
  withdrawDescription: string;
  onWithdrawDescriptionChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  accountInfo?: AccountInfoResponse | null;
  isLoadingAccountInfo?: boolean;
  isLoadingAccountHolderName?: boolean;
}

export function WithdrawForm({
  step,
  bankName,
  onBankNameChange,
  accountNumber,
  onAccountNumberChange,
  accountName,
  onAccountNameChange,
  amount,
  onAmountChange,
  depositDescription,
  onDepositDescriptionChange,
  withdrawDescription,
  onWithdrawDescriptionChange,
  onNext,
  onBack,
  accountInfo,
  isLoadingAccountInfo,
  isLoadingAccountHolderName,
}: WithdrawFormProps) {
  return (
    <div className="space-y-6">
      {step === 1 && (
        <>
          <AccountInputCard
            bankName={bankName}
            onBankNameChange={onBankNameChange}
            accountNumber={accountNumber}
            onAccountNumberChange={onAccountNumberChange}
            accountName={accountName}
            onAccountNameChange={onAccountNameChange}
            title="받을 분 계좌 정보"
            showAccountName={false} // 예금주명 필드 숨김 - 자동 조회로 변경
          />

          <Button
            onClick={onNext}
            className="w-full py-4 text-lg"
            style={{
              fontFamily: "Hana2-CM",
              backgroundColor: "#008485",
              color: "white",
            }}
            disabled={!bankName || !accountNumber || isLoadingAccountHolderName}
          >
            {isLoadingAccountHolderName ? "계좌주명 조회 중..." : "다음"}
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <AmountInputCard
            title="출금 금액"
            amount={amount}
            onAmountChange={onAmountChange}
            maxAmount={accountInfo?.balance}
          />



          <DescriptionInputCard
            title="개인계좌에 표시될 내용"
            description={depositDescription}
            onDescriptionChange={onDepositDescriptionChange}
            placeholder="한글 최대 20자까지 입력 가능합니다"
          />

          <DescriptionInputCard
            title="모임통장에 표시될 내용"
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
    </div>
  );
}
