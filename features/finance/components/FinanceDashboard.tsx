"use client";

import { FinanceRemainingBudgetCard } from "./FinanceRemainingBudgetCard";
import { FinanceUnreviewedTransactionsCard } from "./FinanceUnreviewedTransactionsCard";
import { FinanceWeddingDateCard } from "./FinanceWeddingDateCard";
import { CategoryBudgetResponse } from "../types/budget";

interface FinanceDashboardProps {
  totalBudget: number;
  totalSpent: number;
  categoryBudgets?: CategoryBudgetResponse[];
  unreviewedCount?: number;
  isReviewMode?: boolean;
  onBudgetClick?: () => void;
  onUnreviewedClick?: () => void;
  onWeddingDateClick?: () => void;
}

export function FinanceDashboard({
  totalBudget,
  totalSpent,
  categoryBudgets = [],
  unreviewedCount = 0,
  isReviewMode = false,
  onBudgetClick,
  onUnreviewedClick,
  onWeddingDateClick,
}: FinanceDashboardProps) {

  return (
    <div className="mb-8">
      {/* 카드 컨테이너 - 직접 여백 조절 */}
      <div className="flex flex-wrap gap-6">
        {/* 1. 남은 예산 카드 */}
        <div className="flex-1 ">
          <FinanceRemainingBudgetCard 
            totalBudget={totalBudget}
            totalSpent={totalSpent}
            categoryBudgets={categoryBudgets}
            onCardClick={onBudgetClick}
          />
        </div>

        {/* 2. 리뷰되지 않은 거래내역 카드 */}
        <div className="mr-8">
          <FinanceUnreviewedTransactionsCard 
            unreviewedCount={unreviewedCount}
            isReviewMode={isReviewMode}
            onCardClick={onUnreviewedClick}
          />
        </div>

        {/* 3. 결혼 예정일 카드 */}
        <div className="ml-8">
          <FinanceWeddingDateCard
            onCardClick={onWeddingDateClick}
          />
        </div>
      </div>
    </div>
  );
}
