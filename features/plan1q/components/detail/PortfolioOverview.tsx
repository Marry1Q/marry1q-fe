import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioSection } from "./PortfolioSection";

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

interface PortfolioOverviewProps {
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
}

export function PortfolioOverview({
  products,
  goal,
  onSubscribe,
  onViewTerms,
  onViewContract,
  onTerminate,
  onSubscriptionSuccess,
}: PortfolioOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900" style={{ fontFamily: "Hana2-CM" }}>
          포트폴리오 구성
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <PortfolioSection
            title="적금"
            productType="SAVINGS"
            products={products}
            goal={goal}
            onSubscribe={onSubscribe}
            onViewTerms={onViewTerms}
            onViewContract={onViewContract}
            onTerminate={onTerminate}
            onSubscriptionSuccess={onSubscriptionSuccess}
          />
          <PortfolioSection
            title="펀드"
            productType="FUND"
            products={products}
            goal={goal}
            onSubscribe={onSubscribe}
            onViewTerms={onViewTerms}
            onViewContract={onViewContract}
            onTerminate={onTerminate}
            onSubscriptionSuccess={onSubscriptionSuccess}
          />
        </div>
      </CardContent>
    </Card>
  );
} 