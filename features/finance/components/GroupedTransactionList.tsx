import { Card, CardContent } from "@/components/ui/card"
import { TransactionResponse } from "../types/transaction"
import { GroupedTransactionItem } from "./GroupedTransactionItem"
import { groupTransactionsByDate } from "../utils/dateUtils"
import { Skeleton } from "@/components/ui/skeleton"

interface GroupedTransactionListProps {
  transactions: TransactionResponse[]
  isReviewMode?: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onRegisterToFinance?: (id: number) => void
  onImmediateReviewComplete?: (id: number) => void
  loading?: boolean
  isReviewCompleting?: boolean
}

export function GroupedTransactionList({ 
  transactions, 
  isReviewMode = false,
  onEdit, 
  onDelete, 
  onRegisterToFinance,
  onImmediateReviewComplete,
  loading = false,
  isReviewCompleting = false
}: GroupedTransactionListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, groupIndex) => (
          <div key={groupIndex} className="space-y-2">
            <div className="px-4">
              <Skeleton className="h-4 w-24" />
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {Array.from({ length: 3 }).map((_, index) => (
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
          </div>
        ))}
      </div>
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

  const groupedTransactions = groupTransactionsByDate(transactions)

  return (
    <div className="space-y-4">
      {groupedTransactions.map((group) => (
        <div key={group.date} className="space-y-2">
          <div className="px-2">
            <span className="text-sm font-medium text-gray-700">{group.displayDate}</span>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                {group.transactions.map((transaction, index) => (
                  <GroupedTransactionItem
                    key={transaction.transactionId}
                    transaction={transaction}
                    isReviewMode={isReviewMode}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onRegisterToFinance={onRegisterToFinance}
                    onImmediateReviewComplete={onImmediateReviewComplete}
                    isReviewCompleting={isReviewCompleting}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
