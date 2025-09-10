import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioOverview } from "./PortfolioOverview";
import { PaymentManagementCard } from "./PaymentManagementCard";

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
  expectedReturnRate?: number;
}

interface PaymentData {
  autoTransferId: number;
  monthlyAmount: number;
  nextPaymentDate: string;
  remainingPayments: number;
  autoTransferAccount: string;
  isPaymentCompleted: boolean;
  onAutoTransferChange: () => void;
  amount?: number;
  paymentStatus?: string;
  currentInstallment?: number;
  totalInstallments?: number;
}

interface PortfolioTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  products: Product[];
  goal?: {
    targetPeriod: number;
    createdAt: string;
  }; // 목표 정보 추가
  onSubscribe: (productId: number) => void;
  onViewTerms: (product: Product) => void;
  onViewContract: (product: Product) => void;
  onTerminate: (productId: number) => void;
  onSubscriptionSuccess?: () => void;
  onPayment?: (productId: number) => void;
  paymentData: PaymentData;
  productPaymentData?: Record<number, PaymentData>;
}

export function PortfolioTabs({
  activeTab,
  onTabChange,
  products,
  goal,
  onSubscribe,
  onViewTerms,
  onViewContract,
  onTerminate,
  onSubscriptionSuccess,
  onPayment,
  paymentData,
  productPaymentData,
}: PortfolioTabsProps) {
  // 가입된 상품만 필터링
  const subscribedProducts = products.filter(product => product.subscribed);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="overview" className="text-sm font-medium">
          포트폴리오
        </TabsTrigger>
        <TabsTrigger value="payments" className="text-sm font-medium">
          납입 관리
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <PortfolioOverview
          products={products}
          goal={goal}
          onSubscribe={onSubscribe}
          onViewTerms={onViewTerms}
          onViewContract={onViewContract}
          onTerminate={onTerminate}
          onSubscriptionSuccess={onSubscriptionSuccess}
        />
      </TabsContent>

      <TabsContent value="payments" className="space-y-6">
        <PaymentManagementCard 
          products={subscribedProducts}
          paymentData={paymentData}
          productPaymentData={productPaymentData}
          onPayment={onPayment}
        />
      </TabsContent>
    </Tabs>
  );
} 