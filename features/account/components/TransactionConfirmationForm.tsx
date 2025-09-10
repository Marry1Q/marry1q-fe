import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ChevronLeft } from "lucide-react";
import { TransactionSummaryCard } from "./TransactionSummaryCard";
import { TransactionType, Account } from "@/features/account/types";
import { getBankName } from "../utils/bankUtils";

interface TransactionConfirmationFormProps {
  type: TransactionType;
  selectedAccount: Account;
  amount: number;
  depositDescription?: string;
  withdrawDescription?: string;
  onBack: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function TransactionConfirmationForm({
  type,
  selectedAccount,
  amount,
  depositDescription,
  withdrawDescription,
  onBack,
  onConfirm,
  isLoading,
}: TransactionConfirmationFormProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
        <h1 className="text-2xl" style={{ fontFamily: "Hana2-CM" }}>
          {type === "deposit"
            ? `내 ${selectedAccount.accountName || "알 수 없는"}에서\n모임통장으로 입금합니다`
            : `${selectedAccount.accountName || "알 수 없는"}의 ${
                getBankName(selectedAccount.bank) || selectedAccount.bank
              }계좌로 보낼까요?`}
        </h1>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
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

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <SubmitButton onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "처리 중..." : type === "deposit" ? "채우기" : "보내기"}
        </SubmitButton>
      </div>
    </div>
  );
}
