import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  FileText,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils";
import { detectBankLogoFromAccountNumber } from "@/features/account/utils/bankUtils";
import { PaymentModal } from "./PaymentModal";

interface Product {
  id: number;
  name: string;
  monthlyAmount: number;
  subscribed: boolean;
  type?: "FUND" | "SAVINGS" | "DEPOSIT" | "BOND" | "ETF";
  nextPaymentDate?: string;
  remainingPayments?: number;
  autoTransferAccount?: string;
  isPaymentCompleted?: boolean;
  accountNumber?: string;
}

interface PaymentData {
  autoTransferId: number;
  nextPaymentDate: string;
  remainingPayments: number;
  autoTransferAccount: string;
  isPaymentCompleted: boolean;
  amount?: number;
  paymentStatus?: string;
  currentInstallment?: number;
  totalInstallments?: number;
}

interface PaymentProductCardProps {
  product: Product;
  paymentData?: PaymentData;
  onViewTerms?: (product: Product) => void;
  onViewContract?: (product: Product) => void;
  onTerminate?: (productId: number) => void;
  onPayment?: (productId: number) => void;
}

export function PaymentProductCard({
  product,
  paymentData,
  onViewTerms,
  onViewContract,
  onTerminate,
  onPayment,
}: PaymentProductCardProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePaymentClick = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // 납입 성공 후 상품별 납입 정보 다시 조회
    onPayment?.(product.id);
  };
  const renderHeader = () => (
    <CardHeader>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <CardTitle
            className="text-lg text-gray-900 mb-1"
            style={{ fontFamily: "Hana2-CM" }}
          >
            {product.name}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {product.subscribed && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-50 hover:opacity-100 transition-opacity hover:bg-gray-100"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewTerms?.(product)}>
                    <FileText className="w-4 h-4 mr-2" />
                    약관 보기
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewContract?.(product)}>
                    <FileText className="w-4 h-4 mr-2" />
                    계약서 보기
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onTerminate?.(product.id)}
                    className="text-red-600"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    상품 해지
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
              <div className="flex flex-col text-gray-600">
          {product.accountNumber && (
            <div className="flex items-center gap-2">
              {(() => {
                const bankLogo = detectBankLogoFromAccountNumber(product.accountNumber);
                
                return bankLogo ? (
                  <Image
                    src={bankLogo}
                    alt="은행 로고"
                    width={16}
                    height={16}
                    className="rounded-sm"
                  />
                ) : (
                  <div className="w-4 h-4 bg-gray-200 rounded-sm flex items-center justify-center">
                    <span className="text-xs text-gray-500 font-medium">
                      {product.accountNumber.charAt(0)}
                    </span>
                  </div>
                );
              })()}
              <span className="text-sm text-gray-500">{product.accountNumber}</span>
            </div>
          )}
        </div>
    </CardHeader>
  );

  const renderPaymentInfo = () => (
    <div className="space-y-3">
      {product.subscribed && (
        <div className="bg-white rounded-lg p-3 border border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">다음 납입일</span>
            <span className="text-gray-900 text-sm">
              {paymentData?.nextPaymentDate || "정보 없음"}
            </span>
          </div>
          <div className="flex items-center text-gray-600 justify-between">
            <span className="text-sm">이번달 납입 여부</span>
            <div className="flex items-center gap-2">
              {paymentData?.paymentStatus === 'SUCCESS' ? (
                <>
                  <span className="text-sm text-900" style={{ color: colors.primary.main }}>납입완료</span>
                </>
              ) : (
                <>
                  <span className="text-sm text-900" style={{ color: colors.point.main}}>납입실패</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">남은 회차</span>
            <span className="text-gray-900 text-sm">
              {paymentData?.remainingPayments || 0}회
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">자동이체 계좌</span>
            <div className="flex items-center gap-2">
              {paymentData?.autoTransferAccount ? (
                <>
                  {(() => {
                    const bankLogo = detectBankLogoFromAccountNumber(paymentData.autoTransferAccount);
                    
                    return bankLogo ? (
                      <Image
                        src={bankLogo}
                        alt="은행 로고"
                        width={16}
                        height={16}
                        className="rounded-sm"
                      />
                    ) : (
                      <div className="w-4 h-4 bg-gray-200 rounded-sm flex items-center justify-center">
                        <span className="text-xs text-gray-500 font-medium">
                          {paymentData.autoTransferAccount.charAt(0)}
                        </span>
                      </div>
                    );
                  })()}
                  <span className="text-gray-900 text-sm">
                    {paymentData.autoTransferAccount}
                  </span>
                </>
              ) : (
                <span className="text-gray-900 text-sm">정보 없음</span>
              )}
            </div>
          </div>
          
        </div>
      )}
      
      {product.subscribed && paymentData?.paymentStatus !== 'SUCCESS' && (
        <Button
          size="sm"
          className="w-full"
          style={{ backgroundColor: colors.primary.main }}
          onClick={handlePaymentClick}
        >
          납입하기
        </Button>
      )}
    </div>
  );

  const renderUnsubscribedContent = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-lg p-3 border border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">월 납입액</span>
          <span className="font-bold text-gray-900">
            {product.monthlyAmount.toLocaleString()}원
          </span>
        </div>
      </div>
      <Badge variant="outline" className="w-full justify-center">
        미가입
      </Badge>
    </div>
  );

  return (
    <Card
      className={cn(
        "group transition-all duration-300 hover:shadow-md",
        "bg-white border border-gray-200 shadow-sm",
        !product.subscribed && "border-dashed border-gray-300"
      )}
    >
      {renderHeader()}
      <CardContent className="space-y-4">
        {product.subscribed ? renderPaymentInfo() : renderUnsubscribedContent()}
      </CardContent>
      
      {/* 수동 납입 모달 */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        product={product}
        paymentData={paymentData || null}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </Card>
  );
}