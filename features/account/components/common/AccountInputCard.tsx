import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getBankLogo, getBankCode, detectBankNameFromAccountNumber } from "@/features/account/utils/bankUtils";
import Image from "next/image";

interface AccountInputCardProps {
  bankName: string;
  onBankNameChange: (value: string) => void;
  accountNumber: string;
  onAccountNumberChange: (value: string) => void;
  accountName: string;
  onAccountNameChange: (value: string) => void;
  title: string;
  showAccountName?: boolean; // 예금주명 필드 표시 여부
}

export function AccountInputCard({
  bankName,
  onBankNameChange,
  accountNumber,
  onAccountNumberChange,
  accountName,
  onAccountNameChange,
  title,
  showAccountName = true, // 기본값은 true
}: AccountInputCardProps) {
  const formatAccountNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, "");
    if (number.length <= 3) return number;
    if (number.length <= 6) return `${number.slice(0, 3)}-${number.slice(3)}`;
    if (number.length <= 12) return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6)}`;
    return `${number.slice(0, 3)}-${number.slice(3, 9)}-${number.slice(9, 15)}`;
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formatted = formatAccountNumber(e.target.value);
    onAccountNumberChange(formatted);
  };

  const handleBankSelect = (selectedBank: string) => {
    onBankNameChange(selectedBank);
  };

  // 추천 은행 계산
  const recommendedBank = detectBankNameFromAccountNumber(accountNumber);
  const showRecommendation =
    recommendedBank &&
    !bankName &&
    accountNumber.replace(/[^\d]/g, "").length >= 3;

  return (
    <Card>
      <CardHeader>
        <h1 className="text-3xl" style={{ fontFamily: "Hana2-CM" }}>
          {title}
        </h1>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              계좌번호
            </label>
            <Input
              value={accountNumber}
              onChange={handleAccountNumberChange}
              placeholder="계좌번호를 입력해주세요"
              maxLength={17}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              은행명
            </label>
            <Input
              value={bankName}
              onChange={(e) => onBankNameChange(e.target.value)}
              placeholder="은행을 아래에서 선택해주세요"
              className="mt-2"
            />
            {showRecommendation && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBankSelect(recommendedBank)}
                  className="text-sm flex items-center gap-2"
                >
                  {(() => {
                    const bankCode = getBankCode(recommendedBank);
                    const bankLogo = bankCode ? getBankLogo(bankCode) : null;
                    return (
                      <>
                        {bankLogo && (
                          <Image
                            src={bankLogo}
                            alt={`${recommendedBank} 로고`}
                            width={20}
                            height={20}
                            className="w-6 h-6"
                          />
                        )}
                        {recommendedBank}
                      </>
                    );
                  })()}
                </Button>
              </div>
            )}
          </div>
          {showAccountName && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                예금주명
              </label>
              <Input
                value={accountName}
                onChange={(e) => onAccountNameChange(e.target.value)}
                placeholder="예금주명을 입력하세요"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
