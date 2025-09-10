import React from "react";
import { PaymentOverview } from "./payment";

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

interface PaymentManagementCardProps {
  products: Product[];
  paymentData: PaymentData;
  productPaymentData?: Record<number, PaymentData>;
  onViewTerms?: (product: Product) => void;
  onViewContract?: (product: Product) => void;
  onTerminate?: (productId: number) => void;
  onPayment?: (productId: number) => void;
}

export function PaymentManagementCard({ 
  products, 
  paymentData,
  productPaymentData,
  onViewTerms,
  onViewContract,
  onTerminate,
  onPayment,
}: PaymentManagementCardProps) {
  return (
    <PaymentOverview
      products={products}
      paymentData={paymentData}
      productPaymentData={productPaymentData}
      onViewTerms={onViewTerms}
      onViewContract={onViewContract}
      onTerminate={onTerminate}
      onPayment={onPayment}
    />
  );
} 