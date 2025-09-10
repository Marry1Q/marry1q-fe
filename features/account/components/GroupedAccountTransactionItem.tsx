"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { colors } from "@/constants/colors"
import { formatTime } from "../utils/dateUtils"

interface Transaction {
  id: number
  type: string
  description: string
  amount: number
  date: string
  time: string
  from: string
  to: string
  color: string
  category: string
  categoryIcon?: string
  balanceAfterTransaction?: number
}

interface GroupedAccountTransactionItemProps {
  transaction: Transaction
  accountBalance: number
}

export function GroupedAccountTransactionItem({ transaction, accountBalance }: GroupedAccountTransactionItemProps) {
  // 카테고리별 색상 매핑
  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      "식비": "bg-orange-100 text-orange-800",
      "교통비": "bg-blue-100 text-blue-800",
      "쇼핑": "bg-purple-100 text-purple-800",
      "주거비": "bg-red-100 text-red-800",
      "카페": "bg-amber-100 text-amber-800",
      "오락": "bg-pink-100 text-pink-800",
      "업무": "bg-gray-100 text-gray-800",
      "의료": "bg-green-100 text-green-800",
      "선물": "bg-rose-100 text-rose-800",
      "수입": "bg-emerald-100 text-emerald-800",
      "기타": "bg-slate-100 text-slate-800",
    };
    return colorMap[category] || "bg-slate-100 text-slate-800";
  };

  const formattedTime = formatTime(transaction.time);

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image 
            src={transaction.type === '입금' ? "/hana3dIcon/hanaIcon3d_6_65.png" : "/hana3dIcon/hanaIcon3d_6_83.png"}
            alt={transaction.type === '입금' ? "입금 아이콘" : "출금 아이콘"}
            width={36} 
            height={36} 
            className="object-contain"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium">{transaction.description}</p>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{transaction.category}</span>
              {formattedTime && (
                <>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{formattedTime}</span>
                </>
              )}
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{transaction.from}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span
            style={{
              color: transaction.type === '입금' ? colors.hana.blue.main : colors.hana.red.main,
              fontFamily: 'Hana2-Bold',
            }}
          >
            {transaction.type === '입금' ? "+" : "-"}
            {transaction.amount.toLocaleString()}원
          </span>
          <div className="text-xs text-gray-500 mt-1">
            잔액: {(transaction.balanceAfterTransaction || accountBalance).toLocaleString()}원
          </div>
        </div>
      </div>
    </div>
  )
}
