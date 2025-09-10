"use client";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CreditCard, Calendar } from "lucide-react";
import { colors } from "@/constants/colors";
import { accountApi, AccountInfoResponse } from "@/features/account/api/accountApi";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { getBankLogoByName } from "@/features/account/utils/bankUtils";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  monthlyAmount: number;
  subscribed: boolean;
  accountNumber?: string;
}

interface PaymentData {
  autoTransferId: number;
  amount?: number;
  nextPaymentDate: string;
  remainingPayments: number;
  autoTransferAccount: string;
  paymentStatus?: string;
  currentInstallment?: number;
  totalInstallments?: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  paymentData: PaymentData | null;
  onPaymentSuccess?: () => void;
}

// 모임통장 정보 표시 컴포넌트 (기존 재사용)
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
  paymentData: PaymentData;
}

function ProductInfoDisplay({ product, paymentData }: ProductInfoDisplayProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{product.name}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">납입 금액</span>
            <div className="font-medium text-gray-900">
              {paymentData.amount?.toLocaleString() || '0'}원
            </div>
          </div>
          <div>
            <span className="text-gray-600">남은 회차</span>
            <div className="font-medium text-gray-900">
              {paymentData.remainingPayments}회
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaymentModal({
  isOpen,
  onOpenChange,
  product,
  paymentData,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [meetingAccount, setMeetingAccount] = useState<AccountInfoResponse | null>(null);
  const [memo, setMemo] = useState("");

  // 모임통장 정보 조회
  useEffect(() => {
    if (isOpen) {
      fetchMeetingAccount();
    }
  }, [isOpen]);

  const fetchMeetingAccount = async () => {
    try {
      const response = await accountApi.getAccountInfo();
      if (response.success && response.data) {
        setMeetingAccount(response.data);
      }
    } catch (error) {
      console.error('모임통장 정보 조회 실패:', error);
      showErrorToast('모임통장 정보를 불러오는데 실패했습니다.');
    }
  };

  const handlePayment = async () => {
    if (!product || !paymentData || !meetingAccount || !paymentData.amount) {
      showErrorToast('필수 정보가 누락되었습니다.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await accountApi.createManualPayment({
        autoTransferId: paymentData.autoTransferId,
        amount: paymentData.amount,
        memo: memo.trim() || undefined,
      });

      if (response.success) {
        showSuccessToast("납입에 성공했습니다");
        
        onOpenChange(false);
        setMemo("");
        onPaymentSuccess?.();
      } else {
        showErrorToast(response.error?.message || '납입에 실패했습니다.');
      }
    } catch (error) {
      console.error('수동 납입 실패:', error);
      showErrorToast('납입 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      setMemo("");
    }
  };

  if (!product || !paymentData) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold" style={{ fontFamily: "Hana2-CM" }}>
            수동 납입
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 모임통장 정보 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">출금 계좌</Label>
            {meetingAccount ? (
              <AccountInfoDisplay accountInfo={meetingAccount} />
            ) : (
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="text-sm text-gray-500">모임통장 정보를 불러오는 중...</div>
              </div>
            )}
          </div>

          {/* 상품 정보 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">납입 상품</Label>
            <ProductInfoDisplay product={product} paymentData={paymentData} />
          </div>

          {/* 납입 정보 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">납입 금액</Label>
                <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                  <span className="text-sm text-gray-900">
                    {paymentData.amount?.toLocaleString() || '0'}원
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">납입일</Label>
                <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                  <span className="text-sm text-gray-900">
                    {new Date().toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            </div>

            {/* 메모 */}
            <div className="space-y-2">
              <Label htmlFor="memo" className="text-sm font-medium text-gray-700">
                메모 (선택사항)
              </Label>
              <Textarea
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="납입 메모를 입력하세요"
                className="min-h-[80px] resize-none"
                maxLength={100}
              />
              <div className="text-xs text-gray-500 text-right">
                {memo.length}/100
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isLoading || !meetingAccount}
            className="flex-1"
            style={{ backgroundColor: colors.primary.main }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                납입 중...
              </>
            ) : (
              <>
                납입하기
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
