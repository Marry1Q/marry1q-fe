import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { accountApi, OpenBankingAccount, AccountRegisterRequest } from "../../api/accountApi";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { getBankLogo } from "../../utils/bankUtils";
import Image from "next/image";

interface RegistrationStepProps {
  selectedAccounts: OpenBankingAccount[];
  onComplete: () => void;
  onClose: () => void;
}

interface RegistrationResult {
  account: OpenBankingAccount;
  success: boolean;
  error?: string;
}

export function RegistrationStep({ selectedAccounts, onComplete, onClose }: RegistrationStepProps) {
  const [results, setResults] = useState<RegistrationResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const hasRegistered = useRef(false);

  // selectedAccounts를 안정적인 키로 변환
  const accountsKey = useMemo(() => 
    selectedAccounts.map(acc => `${acc.bankCodeStd}-${acc.accountNum}`).join(','), 
    [selectedAccounts]
  );

  // 계좌 등록 처리
  useEffect(() => {
    const registerAccounts = async () => {
      if (selectedAccounts.length === 0 || hasRegistered.current) return;
      
      hasRegistered.current = true;
      setIsRegistering(true);
      const registrationResults: RegistrationResult[] = [];

      for (let i = 0; i < selectedAccounts.length; i++) {
        const account = selectedAccounts[i];
        setCurrentIndex(i);
        
        try {
          const request: AccountRegisterRequest = {
            bankCodeStd: account.bankCodeStd,
            registerAccountNum: account.accountNum,
            accountName: account.productName,
            accountType: account.accountType,
            coupleAccount: false
          };

          const response = await accountApi.registerAccount(request);
          
          if (response.success) {
            registrationResults.push({
              account,
              success: true
            });
          } else {
            registrationResults.push({
              account,
              success: false,
              error: response.message || '계좌 등록에 실패했습니다.'
            });
          }
        } catch (error: any) {
          registrationResults.push({
            account,
            success: false,
            error: error.message || '계좌 등록 중 오류가 발생했습니다.'
          });
        }
        
        setResults([...registrationResults]);
      }
      
      setIsRegistering(false);
      setIsCompleted(true);
      
      // 결과 요약 토스트
      const successCount = registrationResults.filter(r => r.success).length;
      const failCount = registrationResults.filter(r => !r.success).length;
      
      if (successCount > 0) {
        showSuccessToast(`${successCount}개 계좌가 성공적으로 등록되었습니다.`);
      }
      
      if (failCount > 0) {
        showErrorToast(`${failCount}개 계좌 등록에 실패했습니다.`);
      }
    };

    registerAccounts();
  }, [accountsKey]); // accountsKey를 의존성으로 사용

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl mb-2" style={{ fontFamily: "Hana2-CM" }}>
          {isRegistering ? "계좌 추가 중..." : "추가 완료"}
        </h2>
      </div>

      {isRegistering && (
        <div className="text-center">
          <LoadingSpinner text="계좌를 추가하는 중..." />
        </div>
      )}

      {/* 등록 결과 목록 */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {results.map((result, index) => {
          const bankLogo = getBankLogo(result.account.bankCodeStd);
          
          return (
            <div 
              key={result.account.accountNum}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200"
            >
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {bankLogo && (
                    <Image 
                      src={bankLogo} 
                      alt={`${result.account.bankCodeStd} 로고`} 
                      width={20} 
                      height={20} 
                      className="rounded-sm"
                    />
                  )}
                  <div className="font-medium">{result.account.productName}</div>
                </div>
                <div className="text-sm text-gray-600">{result.account.accountNum}</div>
                {result.error && (
                  <div className="text-sm text-red-600">{result.error}</div>
                )}
              </div>
              
              {index === currentIndex && isRegistering && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* 완료 버튼 */}
      {isCompleted && (
        <div className="flex justify-center">
          <Button 
            onClick={handleComplete}
            className="w-full max-w-xs"
            style={{
              fontFamily: "Hana2-CM",
              backgroundColor: "#008485",
              color: "white",
            }}
          >
            확인
          </Button>
        </div>
      )}
    </div>
  );
}
