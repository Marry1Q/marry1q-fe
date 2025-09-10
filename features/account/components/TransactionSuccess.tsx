import { Card, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { TransactionSummaryCard } from "./TransactionSummaryCard";
import { TransactionType, Account } from "@/features/account/types";
import { getBankName } from "../utils/bankUtils";

interface TransactionSuccessProps {
  type: TransactionType;
  selectedAccount: Account;
  amount: number;
  depositDescription?: string;
  withdrawDescription?: string;
  onComplete: () => void;
}

export function TransactionSuccess({
  type,
  selectedAccount,
  amount,
  depositDescription,
  withdrawDescription,
  onComplete,
}: TransactionSuccessProps) {
  return (
    <div className="text-center space-y-6">
      <div className="mb-10">
        <h2 className="text-3xl mb-6" style={{ fontFamily: "Hana2-CM" }}>
          {type === "deposit" ? "채우기 성공" : "보내기 성공"}
        </h2>
        <p className="text-gray-600">
          {type === "deposit"
            ? "모임통장으로 입금이 성공적으로 완료되었습니다."
            : "모임통장에서 출금이 성공적으로 완료되었습니다."}
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <TransactionSummaryCard
            type={type}
            fromBank={
              type === "deposit" ? getBankName(selectedAccount.bank) || selectedAccount.bank : "하나은행 모임통장"
            }
            fromAccountName={
              type === "deposit" ? selectedAccount.accountName : "모임통장"
            }
            fromAccountNumber={
              type === "deposit"
                ? selectedAccount.accountNumber
                : "110-123-456789"
            }
            toBank={
              type === "deposit" ? "하나은행 모임통장" : getBankName(selectedAccount.bank) || selectedAccount.bank
            }
            toAccountNumber={
              type === "deposit"
                ? "110-123-456789"
                : selectedAccount.accountNumber
            }
            amount={amount}
            depositDescription={depositDescription}
            withdrawDescription={withdrawDescription}
          />
        </CardContent>
      </Card>

      <SubmitButton onClick={onComplete}>완료</SubmitButton>
    </div>
  );
}
