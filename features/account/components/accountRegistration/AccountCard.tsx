import { Card, CardContent } from "@/components/ui/card";
import { getBankLogo } from "../../utils/bankUtils";
import { OpenBankingAccount } from "../../api/accountApi";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { colors } from "@/constants/colors";

interface AccountCardProps {
  account: OpenBankingAccount;
  isSelected: boolean;
  onToggle: (accountNum: string) => void;
  disabled?: boolean;
}

export function AccountCard({ account, isSelected, onToggle, disabled }: AccountCardProps) {
  const bankLogo = getBankLogo(account.bankCodeStd);
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={{
        borderColor: isSelected ? colors.primary.main : undefined,
        backgroundColor: isSelected ? colors.primary.toastBg : undefined,
      }}
      onClick={() => !disabled && onToggle(account.accountNum)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {bankLogo && (
                <Image 
                  src={bankLogo} 
                  alt={`${account.bankCodeStd} 로고`} 
                  width={20} 
                  height={20} 
                  className="rounded-sm"
                />
              )}
              <span className="font-medium">{account.productName}</span>
              <span className="text-gray-500 text-sm">{account.accountNum}</span>
            </div>
            <div className="text-sm text-gray-600">{account.accountHolderName}</div>
            <div className="text-sm font-medium text-primary">
              {account.balanceAmt.toLocaleString()}원
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
