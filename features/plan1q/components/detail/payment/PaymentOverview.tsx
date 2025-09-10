import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentSection } from "./PaymentSection";

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

interface PaymentOverviewProps {
  products: Product[];
  paymentData: PaymentData;
  productPaymentData?: Record<number, PaymentData>;
  onViewTerms?: (product: Product) => void;
  onViewContract?: (product: Product) => void;
  onTerminate?: (productId: number) => void;
  onPayment?: (productId: number) => void;
}

export function PaymentOverview({
  products,
  paymentData,
  productPaymentData,
  onViewTerms,
  onViewContract,
  onTerminate,
  onPayment,
}: PaymentOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900" style={{ fontFamily: "Hana2-CM" }}>
          납입 관리
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <PaymentSection
            title="적금"
            productType="SAVINGS"
            products={products}
            paymentData={paymentData}
            productPaymentData={productPaymentData}
            onViewTerms={onViewTerms}
            onViewContract={onViewContract}
            onTerminate={onTerminate}
            onPayment={onPayment}
          />
          <PaymentSection
            title="펀드"
            productType="FUND"
            products={products}
            paymentData={paymentData}
            productPaymentData={productPaymentData}
            onViewTerms={onViewTerms}
            onViewContract={onViewContract}
            onTerminate={onTerminate}
            onPayment={onPayment}
          />
        </div>
      </CardContent>
    </Card>
  );
} 