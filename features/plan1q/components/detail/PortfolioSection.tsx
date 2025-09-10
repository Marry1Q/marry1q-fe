import React from "react";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "./ProductCard";

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

interface PortfolioSectionProps {
  title: string;
  productType: "FUND" | "SAVINGS" | "DEPOSIT" | "BOND" | "ETF";
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

export function PortfolioSection({
  title,
  productType,
  products,
  goal,
  onSubscribe,
  onViewTerms,
  onViewContract,
  onTerminate,
  onSubscriptionSuccess,
}: PortfolioSectionProps) {
  const filteredProducts = products.filter((p) => (p.type || "FUND").toUpperCase() === productType.toUpperCase());

  if (filteredProducts.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg text-gray-900" style={{ fontFamily: "Hana2-CM" }}>
          {title}
        </h3>
        <Badge variant="outline" className="text-sm" style={{ fontFamily: "Hana2-CM" }}>
          {filteredProducts.length}개
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            goal={goal}
            onSubscribe={onSubscribe}
            onViewTerms={onViewTerms}
            onViewContract={onViewContract}
            onTerminate={onTerminate}
            onSubscriptionSuccess={onSubscriptionSuccess}
          />
        ))}
      </div>
    </div>
  );
} 