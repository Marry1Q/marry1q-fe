import { Card, CardContent } from "@/components/ui/card"
import { TransactionItem } from "./TransactionItem"
import { TransactionResponse } from "../types/transaction"
import { Skeleton } from "@/components/ui/skeleton"

interface TransactionListProps {
  transactions: TransactionResponse[]
  isReviewMode?: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onRegisterToFinance?: (id: number) => void
  loading?: boolean
}

export function TransactionList({ 
  transactions, 
  isReviewMode = false,
  onEdit, 
  onDelete, 
  onRegisterToFinance,
  loading = false 
}: TransactionListProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">거래 내역이 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.transactionId}
              transaction={transaction}
              isReviewMode={isReviewMode}
              onEdit={onEdit}
              onDelete={onDelete}
              onRegisterToFinance={onRegisterToFinance}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 