import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Account } from "../../types";
import { colors } from "@/constants/colors";
import { getBankName, getBankLogo } from "../../utils/bankUtils";
import Image from "next/image";

interface AccountSelectCardProps {
  accounts: Account[];
  selectedAccount: string;
  onAccountChange: (value: string) => void;
  title: string;
  placeholder: string;
  onAddMoreAccounts?: () => void;
}

export function AccountSelectCard({
  accounts,
  selectedAccount,
  onAccountChange,
  title,
  placeholder,
  onAddMoreAccounts,
}: AccountSelectCardProps) {
  const selectedAccountInfo = accounts.find(
    (acc) => acc.accountId && acc.accountId.toString() === selectedAccount
  );

  return (
    <Card>
      <CardHeader>
        {/* <CardTitle style={{ fontFamily: "Hana2-Regular" }}>{title}</CardTitle> */}
        <h1 className="text-3xl" style={{ fontFamily: "Hana2-CM" }}>
          {title}
        </h1>
      </CardHeader>
      <CardContent>
        {accounts.length > 0 && (
          <Select value={selectedAccount} onValueChange={onAccountChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => {
                const bankName = getBankName(account.bank) || account.bank;
                const bankLogo = getBankLogo(account.bank);
                
                return (
                  <SelectItem key={account.accountId} value={account.accountId.toString()}>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        {bankLogo ? (
                          <Image
                            src={bankLogo}
                            alt={`${bankName} 로고`}
                            width={20}
                            height={20}
                            className="rounded-sm"
                          />
                        ) : (
                          <div className="w-5 h-5 bg-gray-200 rounded-sm flex items-center justify-center">
                            <span className="text-xs text-gray-500 font-medium">
                              {bankName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="font-medium">{bankName}</span>
                        <span className="text-gray-500">
                          {account.accountNumber}
                        </span>
                        <span className="text-sm text-gray-600">
                          {account.accountName}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
        {selectedAccountInfo && (
          <div
            className="mt-3 p-3 rounded-lg"
            style={{
              backgroundColor: colors.primary.toastBg,
            }}
          >
            <p className="text-sm" style={{ color: colors.primary.main }}>
              {selectedAccountInfo.balance.toLocaleString()}원 출금 가능
            </p>
          </div>
        )}
        
        {/* 다른 계좌 추가하기 버튼 */}
        {onAddMoreAccounts && (
          <Button
            variant="outline"
            className="w-full mt-4 py-3"
            onClick={onAddMoreAccounts}
            style={{
              borderColor: colors.primary.main,
              color: colors.primary.main,
              fontFamily: "Hana2-Medium"
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            다른 계좌 추가하기
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
