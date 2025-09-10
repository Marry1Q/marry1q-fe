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
import { colors } from "@/constants/colors";

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

interface ContractDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ContractDialog({ isOpen, onClose, product }: ContractDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product?.name} 계약서</DialogTitle>
          <DialogDescription>
            계약서 정보를 확인하고 다운로드할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">계약서 정보</p>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="text-sm">
              <strong>계약명:</strong> {product?.contract}
            </p>
            <p className="text-sm">
              <strong>계약일:</strong> {product?.contractDate}
            </p>
            <p className="text-sm">
              <strong>만기일:</strong> {product?.maturityDate}
            </p>
            <p className="text-sm">
              <strong>월 납부액:</strong>{" "}
              {product?.monthlyAmount?.toLocaleString()}원
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button style={{ backgroundColor: colors.primary.main }}>
            계약서 다운로드
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 