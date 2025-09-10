"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { DepositForm } from "@/features/account/components/DepositForm";
import { TransactionConfirmationForm } from "@/features/account/components/TransactionConfirmationForm";
import { TransactionSuccess } from "@/features/account/components/TransactionSuccess";
import { PasswordModal } from "@/components/ui/PasswordModal";
import { FormHeader } from "@/components/layout/FormHeader";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { showWarningAlert, showErrorAlert } from "@/components/ui/CustomAlert";
import { accountApi, MyAccountsResponse, DepositRequest } from "@/features/account/api/accountApi";
import { mapMyAccountsApiResponse } from "@/features/account/utils/accountMapper";
import { authApi } from "@/lib/api/authApi";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { colors } from "@/constants/colors";
import { useAuth } from "@/lib/hooks/useAuth";

export default function DepositPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [depositDescription, setDepositDescription] = useState("");
  const [withdrawDescription, setWithdrawDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formStep, setFormStep] = useState(1); // 1: 계좌 선택, 2: 금액 메모 입력
  const [step, setStep] = useState(1); // 1: 정보입력, 2: 확인, 3: 완료
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  
  // API 상태 관리
  const [accountsData, setAccountsData] = useState<MyAccountsResponse | null>(null);
  const [mappedAccounts, setMappedAccounts] = useState<any[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  // 사용자 이름을 기본값으로 설정
  useEffect(() => {
    if (user?.customerName) {
      setDepositDescription(user.customerName);
      setWithdrawDescription(user.customerName);
    }
  }, [user?.customerName]);

  // 계좌 목록 새로고침 함수
  const handleAccountsRefresh = async () => {
    try {
      setIsLoadingAccounts(true);
      setAccountsError(null);
      
      const response = await accountApi.getMyAccounts();
      if (response.data) {
        setAccountsData(response.data);
        const mapped = mapMyAccountsApiResponse(response);
        setMappedAccounts(mapped);
      }
    } catch (err) {
      console.error('계좌 목록 새로고침 실패:', err);
      setAccountsError('계좌 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  // 계좌 목록 로드
  useEffect(() => {
    handleAccountsRefresh();
  }, []);

  // 계좌 목록 (매핑된 데이터 사용)
  const myAccounts = mappedAccounts;

  const selectedAccountInfo = myAccounts.find(
    (acc) => acc.accountId && acc.accountId.toString() === selectedAccount
  );
  const depositAmount = Number(amount.replace(/,/g, ""));

  const handleFormNext = () => {
    if (formStep === 1) {
      // 계좌 선택 단계
      if (!selectedAccount) {
        showWarningAlert({ title: "계좌를 선택해주세요." });
        return;
      }
      setFormStep(2);
    } else if (formStep === 2) {
      // 금액 입력 단계
      if (!amount) {
        showWarningAlert({ title: "입금 금액을 입력해주세요." });
        return;
      }

      if (selectedAccountInfo && depositAmount > selectedAccountInfo.balance) {
        showErrorAlert({ title: "계좌 잔액이 부족합니다." });
        return;
      }

      setStep(2); // 확인 단계로 이동
    }
  };

  const handleFormBack = () => {
    if (formStep === 2) {
      setFormStep(1);
    }
  };

  const handleDeposit = async () => {
    setShowPasswordModal(true);
  };

  const handlePasswordConfirm = async () => {
    if (inputPassword.length !== 6) {
      showWarningAlert({ title: "비밀번호 6자리를 입력해주세요." });
      return;
    }

    try {
      // 1. 핀 번호 검증 API 호출
      const pinVerificationResponse = await authApi.verifyPin(inputPassword);
      
      if (!pinVerificationResponse.success || !pinVerificationResponse.data?.valid) {
        showErrorToast("핀 번호가 올바르지 않습니다.");
        return;
      }

      // 2. 핀 번호 검증 성공 시 입금 처리
      if (!selectedAccountInfo) {
        showErrorAlert({ title: "계좌 정보를 찾을 수 없습니다." });
        return;
      }

      setIsLoading(true);
      setShowPasswordModal(false);

      // API 요청 데이터 구성
      const requestData: DepositRequest = {
        withdrawAccountNumber: selectedAccountInfo.accountNumber,
        withdrawBankCode: selectedAccountInfo.bank,
        amount: depositAmount,
        depositDescription: depositDescription || undefined,
        withdrawDescription: withdrawDescription || undefined,
        fromName: selectedAccountInfo.accountName,
        toName: "모임통장"
      };

      // 요청 데이터 로깅
      console.log("💰 입금 요청 데이터:", requestData);

      // API 호출
      const response = await accountApi.createDeposit(requestData);
      
      console.log("✅ 입금 처리 완료:", response);

      setStep(3);
    } catch (error: any) {
      console.error('핀 번호 검증 또는 입금 처리 실패:', error);
      showErrorToast(error.response?.data?.error?.message || error.message || "처리 중 오류가 발생했습니다.");
      setStep(1); // 다시 입력 단계로
    } finally {
      setIsLoading(false);
      setInputPassword("");
    }
  };

  const handleComplete = () => {
    router.push("/account");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <FormHeader title="채우기" useDefaultBack />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <StepIndicator
          currentStep={step}
          totalSteps={3}
          steps={["입금 정보 입력", "입금 확인", "입금 완료"]}
        />

        <div className="max-w-2xl mx-auto">
          {step === 1 && (
            <DepositForm
              step={formStep}
              accounts={myAccounts}
              selectedAccount={selectedAccount}
              onAccountChange={setSelectedAccount}
              amount={amount}
              onAmountChange={setAmount}
              depositDescription={depositDescription}
              onDepositDescriptionChange={setDepositDescription}
              withdrawDescription={withdrawDescription}
              onWithdrawDescriptionChange={setWithdrawDescription}
              onNext={handleFormNext}
              onBack={handleFormBack}
              onAccountsRefresh={handleAccountsRefresh}
            />
          )}

          {step === 2 && selectedAccountInfo && (
            <TransactionConfirmationForm
              type="deposit"
              selectedAccount={selectedAccountInfo}
              amount={depositAmount}
              depositDescription={depositDescription}
              withdrawDescription={withdrawDescription}
              onBack={() => setStep(1)}
              onConfirm={handleDeposit}
              isLoading={isLoading}
            />
          )}

          {step === 3 && selectedAccountInfo && (
            <TransactionSuccess
              type="deposit"
              selectedAccount={selectedAccountInfo}
              amount={depositAmount}
              depositDescription={depositDescription}
              withdrawDescription={withdrawDescription}
              onComplete={handleComplete}
            />
          )}

          <PasswordModal
            isOpen={showPasswordModal}
            onOpenChange={setShowPasswordModal}
            password={inputPassword}
            onPasswordChange={setInputPassword}
            onConfirm={handlePasswordConfirm}
          />
        </div>
      </div>
    </div>
  );
}
