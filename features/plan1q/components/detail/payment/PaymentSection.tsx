import React from "react";
import { Badge } from "@/components/ui/badge";
import { PaymentProductCard } from "./PaymentProductCard";

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

interface PaymentSectionProps {
  title: string;
  productType: "FUND" | "SAVINGS" | "DEPOSIT" | "BOND" | "ETF";
  products: Product[];
  paymentData: PaymentData;
  productPaymentData?: Record<number, PaymentData>;
  onViewTerms?: (product: Product) => void;
  onViewContract?: (product: Product) => void;
  onTerminate?: (productId: number) => void;
  onPayment?: (productId: number) => void;
}

export function PaymentSection({
  title,
  productType,
  products,
  paymentData,
  productPaymentData,
  onViewTerms,
  onViewContract,
  onTerminate,
  onPayment,
}: PaymentSectionProps) {
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
          <PaymentProductCard
            key={product.id}
            product={product}
            paymentData={productPaymentData?.[product.id] || paymentData}
            onViewTerms={onViewTerms}
            onViewContract={onViewContract}
            onTerminate={onTerminate}
            onPayment={onPayment}
          />
        ))}
      </div>
    </div>
  );
}