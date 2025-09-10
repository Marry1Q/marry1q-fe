"use client";

import { GoalCard } from "./GoalCard";
import { cn } from "@/lib/utils";

interface Product {
  name: string;
  ratio: number;
  returnRate: number;
  subscribed: boolean;
}

interface FinancialGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  returnRate: number;
  actualReturnRate: number;
  maturityDate: string;
  icon: any;
  color: string;
  status: string;
  subscriptionProgress: number;
  createdDate: string;
  owner: string;
  products: Product[];
}

interface GoalCardListProps {
  goals: FinancialGoal[];
  onGoalClick?: (goalId: number) => void;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

export function GoalCardList({
  goals,
  onGoalClick,
  className,
  variant = "default",
}: GoalCardListProps) {
  const handleGoalClick = (goal: FinancialGoal) => {
    if (onGoalClick) {
      onGoalClick(goal.id);
    }
  };

  if (goals.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 text-center",
          className
        )}
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          목표가 없습니다
        </h3>
        <p className="text-gray-500 max-w-md">
          새로운 금융 목표를 설정하고 AI가 추천하는 맞춤형 포트폴리오로 목표를
          달성해보세요.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6",
        variant === "compact" && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        variant === "detailed" && "grid-cols-1 lg:grid-cols-2",
        variant === "default" && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onClick={() => handleGoalClick(goal)}
          variant={variant}
        />
      ))}
    </div>
  );
}
