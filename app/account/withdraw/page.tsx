"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { WithdrawForm } from "@/features/account/components/WithdrawForm";
import { TransactionConfirmationForm } from "@/features/account/components/TransactionConfirmationForm";
import { TransactionSuccess } from "@/features/account/components/TransactionSuccess";
import { PasswordModal } from "@/components/ui/PasswordModal";
import { FormHeader } from "@/components/layout/FormHeader";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { showWarningAlert, showErrorAlert } from "@/components/ui/CustomAlert";
import { accountApi, WithdrawRequest, AccountInfoResponse } from "@/features/account/api/accountApi";
import { getBankCode, validateAccountNumber } from "@/features/account/utils/bankUtils";
import { authApi } from "@/lib/api/authApi";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { toast } from "sonner";
import { colors } from "@/constants/colors";
import { useAuth } from "@/lib/hooks/useAuth";

export default function WithdrawPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [depositDescription, setDepositDescription] = useState("");
  const [withdrawDescription, setWithdrawDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: 계좌정보, 2: 금액메모, 3: 확인, 4: 완료
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [inputPassword, setInputPassword] = useState("");

  // 출금 시 사용할 계좌 정보
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  // 모임통장 정보 상태 관리
  const [accountInfo, setAccountInfo] = useState<AccountInfoResponse | null>(null);
  const [isLoadingAccountInfo, setIsLoadingAccountInfo] = useState(true);
  const [accountInfoError, setAccountInfoError] = useState<string | null>(null);

  // 계좌주명 조회 상태 관리
  const [isLoadingAccountHolderName, setIsLoadingAccountHolderName] = useState(false);

  const withdrawAmount = Number(amount.replace(/,/g, ""));

  // 사용자 이름을 기본값으로 설정
  useEffect(() => {
    if (user?.customerName) {
      setDepositDescription(user.customerName);
      setWithdrawDescription(user.customerName);
    }
  }, [user?.customerName]);

  // 모임통장 정보 로드
  useEffect(() => {
    const loadAccountInfo = async () => {
      try {
        setIsLoadingAccountInfo(true);
        setAccountInfoError(null);
        
        const response = await accountApi.getAccountInfo();
        setAccountInfo(response.data || null);
      } catch (err) {
        console.error('모임통장 정보 로드 실패:', err);
        setAccountInfoError('모임통장 정보를 불러오는데 실패했습니다.');
        toast.error('모임통장 정보를 불러오는데 실패했습니다.', {
          style: {
            background: colors.danger.light,
            color: colors.danger.main,
            border: `1px solid ${colors.danger.main}`,
            fontFamily: "Hana2-Medium",
          },
        });
      } finally {
        setIsLoadingAccountInfo(false);
      }
    };

    loadAccountInfo();
  }, []);

  const handleNext = async () => {
    if (step === 1) {
      // 계좌 정보 입력 단계
      if (!bankName || !accountNumber) {
        showWarningAlert({ title: "은행명과 계좌번호를 입력해주세요." });
        return;
      }

      // 은행 코드 유효성 검사
      const bankCode = getBankCode(bankName);
      if (!bankCode) {
        showWarningAlert({ title: "지원하지 않는 은행입니다. 정확한 은행명을 입력해주세요." });
        return;
      }

      // 계좌번호 유효성 검사
      const accountValidation = validateAccountNumber(accountNumber, bankCode);
      if (!accountValidation.isValid) {
        showWarningAlert({ title: accountValidation.message });
        return;
      }

      // 계좌주명 자동 조회
      setIsLoadingAccountHolderName(true);
      setAccountName("조회 중...");
      
      try {
        console.log("🔍 계좌주명 조회 시작:", { bankName, bankCode, accountNumber });
        
        const holderName = await accountApi.getAccountHolderName(bankCode, accountNumber);
        
        console.log("✅ 계좌주명 조회 성공:", holderName);
        setAccountName(holderName);
        
        setStep(2);
        
      } catch (error: any) {
        console.error("❌ 계좌주명 조회 실패:", error);
        
        setAccountName("");
        
        toast.error(error.message || "계좌주명 조회에 실패했습니다.", {
          style: {
            background: colors.danger.light,
            color: colors.danger.main,
            border: `1px solid ${colors.danger.main}`,
            fontFamily: "Hana2-Medium",
          },
        });
        
        // 다음 단계로 넘어가지 않음
      } finally {
        setIsLoadingAccountHolderName(false);
      }
      
    } else if (step === 2) {
      // 금액 입력 단계
      if (!amount) {
        showWarningAlert({ title: "출금 금액을 입력해주세요." });
        return;
      }

      // 모임통장 잔액 확인
      if (accountInfo && withdrawAmount > accountInfo.balance) {
        showErrorAlert({ title: "모임통장 잔액이 부족합니다." });
        return;
      }

      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleWithdraw = async () => {
    setShowPasswordModal(true);
  };

  const handlePasswordConfirm = async () => {
    console.log("🔐 비밀번호 확인 시작");
    
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

      // 2. 핀 번호 검증 성공 시 출금 처리
      if (!bankName || !accountNumber || !accountName) {
        showErrorAlert({ title: "계좌 정보가 올바르지 않습니다." });
        return;
      }

      console.log("📝 계좌 정보 확인:", { bankName, accountNumber, accountName, amount: withdrawAmount });

      setIsLoading(true);
      setShowPasswordModal(false);

      // 은행명을 은행 코드로 변환
      const bankCode = getBankCode(bankName);
      if (!bankCode) {
        console.error("❌ 은행 코드 변환 실패:", bankName);
        showErrorAlert({ title: "지원하지 않는 은행입니다. 정확한 은행명을 입력해주세요." });
        setIsLoading(false);
        return;
      }

      console.log("🏦 은행명 → 은행코드 변환 성공:", { bankName, bankCode });

      // API 요청 데이터 구성
      const requestData: WithdrawRequest = {
        depositBankCode: bankCode, // 올바른 은행 코드 사용
        depositAccountNumber: accountNumber,
        depositAccountHolderName: accountName,
        amount: withdrawAmount,
        depositDescription: depositDescription || undefined,
        withdrawDescription: withdrawDescription || undefined,
        fromName: "모임통장",
        toName: accountName
      };

      // 요청 데이터 로깅
      console.log("💰 출금 요청 데이터:", requestData);
      console.log("🚀 API 호출 시작...");

      // API 호출
      const response = await accountApi.createWithdraw(requestData);
      
      console.log("✅ 출금 처리 완료:", response);

      setStep(4);
    } catch (error: any) {
      console.error('❌ 핀 번호 검증 또는 출금 처리 실패:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : undefined
      });
      
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

  // 출금 시 사용할 가상의 계좌 정보
  const withdrawAccountInfo = {
    accountId: 0,
    bank: bankName,
    accountNumber: accountNumber,
    accountName: accountName,
    balance: 0,
    isCoupleAccount: false,
    userSeqNo: "",
    lastSyncedAt: "",
    balanceStatus: "NORMAL"
  };

  // 모임통장 정보를 MeetingAccountInfo 형태로 변환
  const meetingAccountData = accountInfo ? {
    bankName: accountInfo.bankName,
    accountName: accountInfo.accountName,
    accountNumber: accountInfo.accountNumber,
  } : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <FormHeader title="보내기" useDefaultBack />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <StepIndicator
          currentStep={step}
          totalSteps={4}
          steps={["출금 정보 입력", "출금 정보 확인", "출금 확인", "출금 완료"]}
        />

        <div className="max-w-2xl mx-auto">
          {(step === 1 || step === 2) && (
            <WithdrawForm
              step={step}
              bankName={bankName}
              onBankNameChange={setBankName}
              accountNumber={accountNumber}
              onAccountNumberChange={setAccountNumber}
              accountName={accountName}
              onAccountNameChange={setAccountName}
              amount={amount}
              onAmountChange={setAmount}
              depositDescription={depositDescription}
              onDepositDescriptionChange={setDepositDescription}
              withdrawDescription={withdrawDescription}
              onWithdrawDescriptionChange={setWithdrawDescription}
              onNext={handleNext}
              onBack={handleBack}
              accountInfo={accountInfo}
              isLoadingAccountInfo={isLoadingAccountInfo}
              isLoadingAccountHolderName={isLoadingAccountHolderName}
            />
          )}

          {step === 3 && (
            <TransactionConfirmationForm
              type="withdraw"
              selectedAccount={withdrawAccountInfo}
              amount={withdrawAmount}
              depositDescription={depositDescription}
              withdrawDescription={withdrawDescription}
              onBack={() => setStep(2)}
              onConfirm={handleWithdraw}
              isLoading={isLoading}
              meetingAccountInfo={meetingAccountData}
            />
          )}

          {step === 4 && (
            <TransactionSuccess
              type="withdraw"
              selectedAccount={withdrawAccountInfo}
              amount={withdrawAmount}
              depositDescription={depositDescription}
              withdrawDescription={withdrawDescription}
              onComplete={handleComplete}
              meetingAccountInfo={meetingAccountData}
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
