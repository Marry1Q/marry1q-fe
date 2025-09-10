"use client"

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CreditCard, Calendar } from "lucide-react";
import { colors } from "@/constants/colors";
import { accountApi, AccountInfoResponse } from "@/features/account/api/accountApi";
import { plan1qApi } from "@/features/plan1q/api/plan1qApi";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { getBankLogoByName } from "@/features/account/utils/bankUtils";
import { PasswordModal } from "@/components/ui/PasswordModal";
import { authApi } from "@/lib/api/authApi";
import Image from "next/image";

// 상수 정의
const PAYMENT_DATE_OPTIONS = [
  { value: "매월 1일", label: "매월 1일" },
  { value: "매월 5일", label: "매월 5일" },
  { value: "매월 10일", label: "매월 10일" },
  { value: "매월 15일", label: "매월 15일" },
  { value: "매월 20일", label: "매월 20일" },
  { value: "매월 25일", label: "매월 25일" },
  { value: "매월 28일", label: "매월 28일" },
] as const;

const DEFAULT_PAYMENT_DATE = "매월 25일";

interface Product {
  id: number;
  name: string;
  monthlyAmount: number;
  returnRate: number;
  type?: "FUND" | "SAVINGS" | "DEPOSIT" | "BOND" | "ETF";
  expectedReturnRate?: number;
}

interface ProductSubscriptionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  targetPeriod?: number; // 목표 기간
  goalCreatedAt?: string; // 목표 생성 시점
  onSubscriptionSuccess?: () => void;
}

// 모임통장 정보 표시 컴포넌트
interface AccountInfoDisplayProps {
  accountInfo: AccountInfoResponse;
}

function AccountInfoDisplay({ accountInfo }: AccountInfoDisplayProps) {
  const bankLogo = getBankLogoByName(accountInfo.bankName);
  
  return (
    <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-2">
          {bankLogo ? (
            <Image
              src={bankLogo}
              alt={`${accountInfo.bankName} 로고`}
              width={24}
              height={24}
              className="rounded-sm"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-200 rounded-sm flex items-center justify-center">
              <span className="text-xs text-gray-500 font-medium">
                {accountInfo.bankName.charAt(0)}
              </span>
            </div>
          )}
          <span className="font-medium text-gray-900">
            {accountInfo.accountName}
          </span>
        </div>
        <span className="text-sm text-gray-600">
          {accountInfo.accountNumber} · 잔액 {accountInfo.balance.toLocaleString()}원
        </span>
      </div>
    </div>
  );
}

// 상품 정보 표시 컴포넌트
interface ProductInfoDisplayProps {
  product: Product;
  targetPeriod?: number;
  goalCreatedAt?: string;
}

// 목표 생성 시점 + 가입기간으로 만기일 계산
const calculateMaturityDate = (createdAt: string, targetPeriod: number) => {
  const createdDate = new Date(createdAt);
  const maturityDate = new Date(
    createdDate.getFullYear(),
    createdDate.getMonth() + targetPeriod,
    createdDate.getDate()
  );
  return maturityDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
};

function ProductInfoDisplay({ product, targetPeriod, goalCreatedAt }: ProductInfoDisplayProps) {
  const maturityDate = goalCreatedAt && targetPeriod 
    ? calculateMaturityDate(goalCreatedAt, targetPeriod)
    : null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">상품명</span>
          <span className="font-medium text-gray-900">{product.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">월 납입액</span>
          <span className="font-medium text-gray-900">
            {product.monthlyAmount.toLocaleString()}원
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">
            {product.type?.toUpperCase() === 'SAVINGS' ? '이자율' : '예상 수익률'}
          </span>
          <span 
            className="font-medium"
            style={{ color: colors.hana.red.main }}
          >
            {product.type?.toUpperCase() === 'SAVINGS' 
              ? `연 ${product.expectedReturnRate || product.returnRate}%`
              : `예상 수익률 ${product.expectedReturnRate || product.returnRate}%`}
          </span>
        </div>
        {/* 만기일 추가 */}
        {maturityDate && (
          <div className="flex justify-between">
            <span className="text-gray-600">만기일</span>
            <span className="font-medium text-gray-900">
              {maturityDate}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// 커스텀 훅: 모임통장 정보 관리
function useCoupleAccountInfo() {
  const [accountInfo, setAccountInfo] = useState<AccountInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccountInfo = async () => {
    try {
      setIsLoading(true);
      const response = await accountApi.getAccountInfo();
      
      if (response.success && response.data) {
        setAccountInfo(response.data);
      }
    } catch (error) {
      console.error("모임통장 정보 조회 실패:", error);
      showErrorToast("모임통장 정보를 불러올 수 없습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setAccountInfo(null);
  };

  return {
    accountInfo,
    isLoading,
    fetchAccountInfo,
    reset,
  };
}

// 커스텀 훅: 상품 가입 로직
function useProductSubscription() {
  const [isLoading, setIsLoading] = useState(false);

  const subscribe = async (
    product: Product,
    accountInfo: AccountInfoResponse,
    paymentDate: string,
    targetPeriod?: number
  ) => {
    setIsLoading(true);
    
    try {
      // 상품 가입 API 호출
      const response = await plan1qApi.subscribeProduct({
        productId: product.id,
        periodMonths: targetPeriod || 12, // 목표 기간 사용, 기본값 12개월
        monthlyAmount: product.monthlyAmount,
        sourceAccountNumber: accountInfo.accountNumber,
        paymentDate: paymentDate,
      });

      // 성공 토스트
      showSuccessToast("상품 가입이 완료되었습니다!");

      return response;
    } catch (error: any) {
      console.error("상품 가입 실패:", error);
      
      showErrorToast(error.response?.data?.error?.message || error.message || "상품 가입 중 오류가 발생했습니다.");
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    subscribe,
  };
}

export function ProductSubscriptionModal({
  isOpen,
  onOpenChange,
  product,
  targetPeriod,
  goalCreatedAt,
  onSubscriptionSuccess,
}: ProductSubscriptionModalProps) {
  const [selectedPaymentDate, setSelectedPaymentDate] = useState<string>("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  
  const { accountInfo, isLoading: isLoadingAccountInfo, fetchAccountInfo, reset: resetAccountInfo } = useCoupleAccountInfo();
  const { isLoading: isSubscribing, subscribe } = useProductSubscription();

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      fetchAccountInfo();
      setSelectedPaymentDate(DEFAULT_PAYMENT_DATE);
    }
  }, [isOpen]);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setSelectedPaymentDate("");
      setShowPasswordModal(false);
      setPassword("");
      resetAccountInfo();
    }
  }, [isOpen]);

  const handleSubscribe = async () => {
    if (!product || !selectedPaymentDate || !accountInfo) {
      showErrorToast("모임통장 정보와 납부일을 확인해주세요.");
      return;
    }

    // 핀 번호 모달 표시
    setShowPasswordModal(true);
  };

  // 핀 번호 확인 후 실제 가입 처리
  const handlePasswordConfirm = async () => {
    if (password.length !== 6) {
      showErrorToast("6자리 핀 번호를 입력해주세요.");
      return;
    }

    try {
      // 1. 핀 번호 검증 API 호출
      const pinVerificationResponse = await authApi.verifyPin(password);
      
      if (!pinVerificationResponse.success || !pinVerificationResponse.data?.valid) {
        showErrorToast("핀 번호가 올바르지 않습니다.");
        return;
      }

      // 2. 핀 번호 검증 성공 시 상품 가입 API 호출
      await subscribe(product!, accountInfo!, selectedPaymentDate, targetPeriod);
      
      // 모달 닫기
      setShowPasswordModal(false);
      onOpenChange(false);
      
      // 성공 콜백 호출
      onSubscriptionSuccess?.();
    } catch (error: any) {
      console.error("핀 번호 검증 또는 상품 가입 실패:", error);
      showErrorToast(error.response?.data?.error?.message || error.message || "처리 중 오류가 발생했습니다.");
      setShowPasswordModal(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle 
            className="text-xl text-gray-900"
            style={{ fontFamily: "Hana2-CM" }}
          >
            상품 가입
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 상품 정보 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3" style={{ fontFamily: "Hana2-CM" }}>
              상품 정보
            </h3>
            <ProductInfoDisplay 
              product={product} 
              targetPeriod={targetPeriod}
              goalCreatedAt={goalCreatedAt}
            />
          </div>

          {/* 자동이체 설정 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900" style={{ fontFamily: "Hana2-CM" }}>
              자동이체 설정
            </h3>

            {/* 출금 계좌 정보 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                출금 계좌
              </Label>
              {isLoadingAccountInfo ? (
                <div className="flex items-center justify-center p-4 border border-gray-200 rounded-md">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="text-sm text-gray-500">모임통장 정보를 불러오는 중...</span>
                </div>
              ) : accountInfo ? (
                <AccountInfoDisplay accountInfo={accountInfo} />
              ) : (
                <div className="p-4 border border-red-200 rounded-md bg-red-50">
                  <span className="text-sm text-red-600">
                    모임통장 정보를 불러올 수 없습니다.
                  </span>
                </div>
              )}
            </div>

            {/* 이체 주기 선택 */}
            <div className="space-y-2">
              <Label htmlFor="payment-date" className="text-sm font-medium text-gray-700">
                납부일
              </Label>
              <Select value={selectedPaymentDate} onValueChange={setSelectedPaymentDate}>
                <SelectTrigger>
                  <SelectValue placeholder="매달 자동이체할 날짜를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_DATE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              <strong>주의사항</strong><br />
              • 자동이체는 선택한 날짜에 매월 자동으로 실행됩니다.<br />
              • 계좌 잔액이 부족한 경우 자동이체가 실행되지 않을 수 있습니다.<br />
              • 초기 납입금은 월 납입금과 동일한 금액으로 자동 이체됩니다.<br />
              • 자동이체 설정은 상품 가입 후 변경 가능합니다.
            </p>
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubscribing}
            >
              취소
            </Button>
            <Button
              onClick={handleSubscribe}
              disabled={isSubscribing || !selectedPaymentDate || isLoadingAccountInfo || !accountInfo}
              className="flex-1"
              style={{ backgroundColor: colors.primary.main }}
            >
              {isSubscribing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  가입 중...
                </>
              ) : (
                "가입하기"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
      
      {/* 핀 번호 입력 모달 */}
      <PasswordModal
        isOpen={showPasswordModal}
        onOpenChange={setShowPasswordModal}
        password={password}
        onPasswordChange={setPassword}
        onConfirm={handlePasswordConfirm}
      />
    </Dialog>
  );
}
