"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AutoTransfer } from "@/features/account/types/account"
import { colors } from "@/constants/colors"

interface AutoTransferItemProps {
  deposit: AutoTransfer
  onEdit: (deposit: AutoTransfer) => void
  onDelete: (deposit: AutoTransfer) => void
}

export function AutoTransferItem({ deposit, onEdit, onDelete }: AutoTransferItemProps) {
  // nextDate를 기반으로 송금까지 남은 일수 계산
  const calculateDaysUntilTransfer = (nextDate: string) => {
    const today = new Date();
    const transferDate = new Date(nextDate);
    const diffTime = transferDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilTransfer = calculateDaysUntilTransfer(deposit.nextDate);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image 
              src="/hana3dIcon/hanaIcon3d_6_67.png" 
              alt="자동이체 아이콘" 
              width={40} 
              height={40} 
              className="object-contain"
            />
                      <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium">{deposit.memo || '메모 없음'}</p>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{deposit.frequency}</span>
              </div>
              <p className="text-sm text-gray-500">{daysUntilTransfer}일 후에 송금됩니다</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              style={{
                color: colors.hana.red.main,
                fontFamily: 'Hana2-Bold',
              }}
            >
              -{deposit.amount.toLocaleString()}원
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(deposit)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  수정
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(deposit)} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
