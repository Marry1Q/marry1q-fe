import { TransactionType } from "../types";
import { getBankLogo, getBankCode } from "../utils/bankUtils";
import Image from "next/image";

interface TransactionSummaryCardProps {
  type: TransactionType;
  fromBank: string;
  fromAccountName: string;
  fromAccountNumber: string;
  toBank: string;
  toAccountNumber: string;
  amount: number;
  depositDescription?: string;
  withdrawDescription?: string;
}

export function TransactionSummaryCard({
  type,
  fromBank,
  fromAccountName,
  fromAccountNumber,
  toBank,
  toAccountNumber,
  amount,
  depositDescription,
  withdrawDescription,
}: TransactionSummaryCardProps) {
  // 은행 코드 추출 (은행명에서)
  const fromBankCode = getBankCode(fromBank);
  const toBankCode = getBankCode(toBank);
  
  // 로고 가져오기
  const fromBankLogo = fromBankCode ? getBankLogo(fromBankCode) : null;
  const toBankLogo = toBankCode ? getBankLogo(toBankCode) : null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">
          {type === "deposit" ? "출금 계좌명" : "출금 계좌명"}
        </span>
        <div className="flex items-center gap-2">
          {fromBankLogo ? (
            <Image
              src={fromBankLogo}
              alt={`${fromBank} 로고`}
              width={20}
              height={20}
              className="rounded-sm"
            />
          ) : (
            <div className="w-5 h-5 bg-gray-200 rounded-sm flex items-center justify-center">
              <span className="text-xs text-gray-500 font-medium">
                {fromBank.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-lg">{fromAccountName}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">
          {type === "deposit" ? "출금 계좌번호" : "출금 계좌번호"}
        </span>
        <span className="text-lg">{fromAccountNumber}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">
          {type === "deposit" ? "입금 금액" : "출금 금액"}
        </span>
        <span className="text-lg">{amount.toLocaleString()}원</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">수수료</span>
        <span className="text-lg">무료</span>
      </div>
      {depositDescription && (
        <div className="flex justify-between">
          <span className="text-gray-600">{type === "deposit" ? "모임통장에 표시" : "개인계좌에 표시"}</span>
          <span className="text-lg">{depositDescription}</span>
        </div>
      )}
      {withdrawDescription && (
        <div className="flex justify-between">
          <span className="text-gray-600">{type === "deposit" ? "출금계좌에 표시" : "모임통장에 표시"}</span>
          <span className="text-lg">{withdrawDescription}</span>
        </div>
      )}
    </div>
  );
}
