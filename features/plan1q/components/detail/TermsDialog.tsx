import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  ratio: number;
  returnRate: number;
  monthlyAmount: number;
  subscribed: boolean;
  currentValue?: number;
  profit?: number;
  contractDate?: string;
  maturityDate?: string;
  terms?: string;
  contract?: string;
  type?: "FUND" | "SAVINGS" | "DEPOSIT" | "BOND" | "ETF";
}

interface TermsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function TermsDialog({ isOpen, onClose, product }: TermsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product?.name} 약관</DialogTitle>
          <DialogDescription>
            상품의 약관 및 주요 내용을 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">상품 약관 및 주요 내용</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm">{product?.terms}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 