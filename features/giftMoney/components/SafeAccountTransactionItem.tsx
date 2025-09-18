import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Gift } from "lucide-react"
import { SafeAccountTransactionResponse } from "../api/giftMoneyApi"
import { formatCurrency } from "@/features/finance/utils/currencyUtils"
import { colors } from "@/constants/colors"
import { formatTime } from "@/features/finance/utils/dateUtils"
import { FinanceCategoryIcon } from "@/components/ui/FinanceCategoryIcon"
interface SafeAccountTransactionItemProps {
  transaction: SafeAccountTransactionResponse
  onRegisterToGiftMoney?: (transactionId: number) => void
  onImmediateReviewComplete?: (transactionId: number) => void
  isReviewCompleting?: boolean
}

export function SafeAccountTransactionItem({ 
  transaction, 
  onRegisterToGiftMoney,
  onImmediateReviewComplete,
  isReviewCompleting = false
}: SafeAccountTransactionItemProps) {
  
  const amount = transaction.amount;
  const isIncome = transaction.type === 'deposit';
  const formattedTime = transaction.transactionTime ? formatTime(transaction.transactionTime) : null;
  const formattedDate = transaction.transactionDate
    ? (() => {
        const raw = transaction.transactionDate;
        // If already in YYYY-MM-DD, use as-is
        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
        // Fallback: construct YYYY-MM-DD from Date
        const d = new Date(raw);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      })()
    : null;

  return (
    <div 
      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onRegisterToGiftMoney?.(transaction.transactionId)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center"
          >
            <FinanceCategoryIcon
            iconName='기타'
            colorName='기타'
            size={36}
            variant="display"
          />  
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium" style={{fontFamily: 'Hana2-CM'}}>{transaction.description}</p>
              {formattedDate && (
                <>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{formattedDate}</span>
                </>
              )}
              
              {transaction.fromName && (
                <>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{transaction.fromName}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span
            style={{
              color: isIncome ? colors.hana.blue.main : colors.hana.red.main,
              fontFamily: 'Hana2-Bold',
            }}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(amount)}원
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onRegisterToGiftMoney?.(transaction.transactionId)}>
                축의금 등록하기
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onImmediateReviewComplete?.(transaction.transactionId)}
                disabled={isReviewCompleting}
              >
                {isReviewCompleting ? '리뷰 완료 중...' : '즉시 리뷰 완료'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
