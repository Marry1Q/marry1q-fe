import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle,
  MoreHorizontal,
  FileText,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Loader2,
} from "lucide-react";
import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils";
import { ProductSubscriptionModal } from "./ProductSubscriptionModal";
import { detectBankLogoFromAccountNumber } from "@/features/account/utils/bankUtils";

interface Product {
  id: number;
  name: string;
  ratio: number;
  returnRate: number;
  monthlyAmount: number;
  subscribed: boolean;
  totalDeposit?: number;
  profit?: number;
  contractDate?: string;
  maturityDate?: string;
  terms?: string;
  contract?: string;
  type?: "FUND" | "SAVINGS" | "DEPOSIT" | "BOND" | "ETF";
  accountNumber?: string;
  
  // AI 추천 시 받은 기대 수익률
  expectedReturnRate?: number;
  
  // 하나은행 API 필드명 (백엔드와 동일)
  currentBalance?: number;          // 하나은행: 현재 잔액
  baseRate?: number;                // 하나은행: 기준금리 (적금용)
  profitRate?: number;              // 하나은행: 수익률 (펀드용)
  lastUpdated?: string;             // 하나은행: 마지막 업데이트 시간
}

interface ProductCardProps {
  product: Product;
  goal?: {
    targetPeriod: number;
    createdAt: string;
  }; // 목표 정보 추가
  onSubscribe?: (productId: number) => void;
  onViewTerms?: (product: Product) => void;
  onViewContract?: (product: Product) => void;
  onTerminate?: (productId: number) => void;
  onSubscriptionSuccess?: () => void; // 가입 성공 후 콜백
}

export function ProductCard({
  product,
  goal,
  onSubscribe,
  onViewTerms,
  onViewContract,
  onTerminate,
  onSubscriptionSuccess,
}: ProductCardProps) {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const getReturnRateColor = (rate: number) => {
    if (rate > 0) return colors.hana.red.main;
    if (rate < 0) return colors.hana.blue.main;
    return "#6b7280"; // gray-600
  };

  // 하나은행 API 필드명 우선 사용 (백엔드와 동일한 필드명)
  const returnRate = product.returnRate;
  const profit = product.profit;
  const totalDeposit = product.totalDeposit ?? 0;
  const baseRate = product.baseRate;
  const profitRate = product.profitRate;
  const monthlyAmount = product.monthlyAmount;
  const expectedReturnRate = product.expectedReturnRate;

  // 상품 가입 처리
  const handleSubscribeClick = () => {
    setIsSubscriptionModalOpen(true);
  };

  const handleSubscriptionSuccess = () => {
    // 성공 콜백만 호출
    onSubscriptionSuccess?.();
  };

  const renderHeader = () => (
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <CardTitle
            className="text-lg text-gray-900 mb-1"
            style={{ fontFamily: "Hana2-CM" }}
          >
            {product.name}
          </CardTitle>
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
              <p className="text-sm text-gray-500">{product.accountNumber}</p>
            </div>
          )}
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
      <div className="flex items-center justify-between text-sm text-gray-600">
            <span>비중: {product.ratio}%</span>
            {product.subscribed && (
              <span
                className="font-medium"
                style={{ color: getReturnRateColor(returnRate || 0) }}
              >
                {product.type?.toUpperCase() === 'SAVINGS' 
                  ? `연 ${(baseRate ?? returnRate)?.toFixed(2)}%`
                  : `수익률: ${(profitRate ?? returnRate)?.toFixed(2)}%`}
              </span>
            )}
            {!product.subscribed && (
              <span
                className="font-medium"
                style={{ color: getReturnRateColor(expectedReturnRate || 0) }}
              >
                {product.type?.toUpperCase() === 'SAVINGS' 
                  ? `연${(expectedReturnRate || 0).toFixed(1)}%`
                  : `예상 수익률 ${(expectedReturnRate || 0).toFixed(1)}%`}
              </span>
            )}
          </div>
        
    </CardHeader>
  );

  const renderSubscribedContent = () => (
    <div className="space-y-3">
      {product.subscribed && (
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">납입금</span>
            <span
              style={{ 
                color: (totalDeposit || 0) === 0 ? "#000000" : "#000000",
                fontFamily: "Hana2-CM"
              }}
            >
              {totalDeposit?.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">월 납입금</span>
            <span
              style={{ 
                color: (monthlyAmount || 0) === 0 ? "#000000" : "#000000",
                fontFamily: "Hana2-CM"
              }}
            >
              {monthlyAmount?.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {product.type?.toUpperCase() === "FUND" ? "수익" : "이자"}
            </span>
            <span 
              style={{ 
                color: (profit || 0) === 0 ? "#000000" : (profit || 0) > 0 ? colors.hana.red.main : colors.hana.blue.main
                ,fontFamily: "Hana2-CM"
              }}
            >
              {(profit || 0) > 0 ? "+" : ""}{profit?.toLocaleString()}원
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const renderUnsubscribedContent = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-lg p-3 border border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">월 납입액</span>
          <span
            className="font-bold text-gray-900"
            style={{ fontFamily: "Hana2-CM" }}
          >
            {(product.monthlyAmount || 0).toLocaleString()}원
          </span>
        </div>
      </div>
      <Button
        size="sm"
        className="w-full"
        style={{ backgroundColor: colors.primary.main }}
        onClick={handleSubscribeClick}
      >
        가입하기
      </Button>
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
        {product.subscribed ? renderSubscribedContent() : renderUnsubscribedContent()}
      </CardContent>
      
      {/* 상품 가입 모달 */}
      <ProductSubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onOpenChange={setIsSubscriptionModalOpen}
        product={product}
        targetPeriod={goal?.targetPeriod}
        goalCreatedAt={goal?.createdAt}
        onSubscriptionSuccess={handleSubscriptionSuccess}
      />
    </Card>
  );
}
