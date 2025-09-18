import { Card, CardContent } from "@/components/ui/card"
import { SafeAccountTransactionResponse } from "../api/giftMoneyApi"
import { SafeAccountTransactionItem } from "./SafeAccountTransactionItem"
import { groupTransactionsByDate } from "@/features/finance/utils/dateUtils"
import { Skeleton } from "@/components/ui/skeleton"

interface SafeAccountTransactionListProps {
  transactions: SafeAccountTransactionResponse[]
  onRegisterToGiftMoney?: (transactionId: number) => void
  onImmediateReviewComplete?: (transactionId: number) => void
  loading?: boolean
  isReviewCompleting?: boolean
}

export function SafeAccountTransactionList({ 
  transactions, 
  onRegisterToGiftMoney,
  onImmediateReviewComplete,
  loading = false,
  isReviewCompleting = false
}: SafeAccountTransactionListProps) {
  console.log('🔍 SafeAccountTransactionList 렌더링:', {
    transactions,
    transactionsLength: transactions.length,
    loading
  });

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
          <p className="text-gray-500">안심계좌 입금 내역이 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  // 안심계좌 거래내역을 가계부 형식으로 변환
  const financeTransactions = transactions.map(transaction => ({
    transactionId: transaction.transactionId,
    description: transaction.description,
    amount: transaction.amount.toString(),
    transactionType: transaction.type === 'deposit' ? 'INCOME' : 'EXPENSE',
    transactionDate: transaction.transactionDate,
    transactionTime: transaction.transactionTime,
    memo: transaction.memo,
    userName: transaction.fromName,
    categoryName: '안심계좌',
    iconName: 'Gift',
    colorName: 'yellow'
  }));

  const groupedTransactions = groupTransactionsByDate(financeTransactions)

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
                  <SafeAccountTransactionItem
                    key={transaction.transactionId}
                    transaction={transactions.find(t => t.transactionId === transaction.transactionId)!}
                    onRegisterToGiftMoney={onRegisterToGiftMoney}
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
