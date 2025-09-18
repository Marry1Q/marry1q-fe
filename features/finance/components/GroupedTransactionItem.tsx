import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, HelpCircle, Utensils, Car, ShoppingBag, Home, Coffee, Gift, Heart, Briefcase, Stethoscope, TrendingUp } from "lucide-react"
import { TransactionResponse } from "../types/transaction"
import { formatCurrency, parseBigDecimal } from "../utils/currencyUtils"
import { FinanceCategoryIcon } from "@/components/ui/FinanceCategoryIcon"
import { colors } from "@/constants/colors"
import { formatTime } from "../utils/dateUtils"

interface GroupedTransactionItemProps {
  transaction: TransactionResponse
  isReviewMode?: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onRegisterToFinance?: (id: number) => void
  onImmediateReviewComplete?: (id: number) => void
  isReviewCompleting?: boolean
}

export function GroupedTransactionItem({ 
  transaction, 
  isReviewMode = false,
  onEdit, 
  onDelete,
  onRegisterToFinance,
  onImmediateReviewComplete,
  isReviewCompleting = false
}: GroupedTransactionItemProps) {
  
  const amount = parseBigDecimal(transaction.amount);
  const isIncome = transaction.transactionType === 'INCOME';

  // 카테고리별 기본 아이콘 매핑
  const getDefaultIcon = (categoryName: string) => {
    const categoryIconMap: Record<string, string> = {
      '식비': 'Utensils',
      '교통비': 'Car',
      '쇼핑': 'ShoppingBag',
      '주거비': 'Home',
      '카페': 'Coffee',
      '선물': 'Gift',
      '결혼': 'Heart',
      '업무': 'Briefcase',
      '의료': 'Stethoscope',
      '수입': 'TrendingUp',
      '급여': 'TrendingUp',
      '기타': 'HelpCircle'
    };
    
    return categoryIconMap[categoryName] || 'HelpCircle';
  };

  // 카테고리별 기본 색상 매핑
  const getDefaultColor = (categoryName: string) => {
    const categoryColorMap: Record<string, string> = {
      '식비': 'orange',
      '교통비': 'blue',
      '쇼핑': 'purple',
      '주거비': 'red',
      '카페': 'amber',
      '선물': 'rose',
      '결혼': 'pink',
      '업무': 'gray',
      '의료': 'green',
      '수입': 'emerald',
      '급여': 'emerald',
      '기타': 'gray'
    };
    
    return categoryColorMap[categoryName] || 'gray';
  };

  const iconName = transaction.iconName || getDefaultIcon(transaction.categoryName || '기타');
  const colorName = transaction.colorName || getDefaultColor(transaction.categoryName || '기타');
  const formattedTime = transaction.transactionTime ? formatTime(transaction.transactionTime) : null;

  return (
    <div 
      className={`p-4 hover:bg-gray-50 transition-colors ${
        isReviewMode ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FinanceCategoryIcon
            iconName={iconName}
            colorName={colorName}
            size={36}
            variant="display"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium" style={{fontFamily: 'Hana2-CM'}}>{transaction.description}</p>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{transaction.categoryName}</span>
              {formattedTime && (
                <>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{formattedTime}</span>
                </>
              )}
              {transaction.userName && (
                <>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{transaction.userName}</span>
                </>
              )}
            </div>
            {transaction.memo && <p className="text-sm text-gray-600 mt-1">{transaction.memo}</p>}
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
              {isReviewMode ? (
                <>
                  <DropdownMenuItem onClick={() => onRegisterToFinance?.(transaction.transactionId)}>
                    가계부 등록하기
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onImmediateReviewComplete?.(transaction.transactionId)}
                    disabled={isReviewCompleting}
                  >
                    {isReviewCompleting ? '리뷰 완료 중...' : '리뷰 완료'}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => onEdit(transaction.transactionId)}>수정</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(transaction.transactionId)} className="text-red-600">
                    삭제
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
