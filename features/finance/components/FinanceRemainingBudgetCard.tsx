import { Card, CardContent } from "@/components/ui/card";
import { CategoryBudgetProgress } from "./CategoryBudgetProgress";
import { CategoryBudgetResponse } from "../types/budget";
import { colors } from "../../../constants/colors";

// 카테고리별 색상 매핑 함수
const getCategoryColor = (index: number): string => {
  const categoryColors = [
    colors.hana.red.main, // red
    colors.hana.yellow.main, // yellow
    colors.hana.green.main, // green
    colors.hana.blue.main, // blue
    colors.hana.purple.main, // purple
    colors.hana.mint.main, // mint
    colors.hana.brown.main, // brown
    colors.point.main, // point
    colors.secondary.main, // secondary
    colors.gray.main, // gray
  ];
  return categoryColors[index % categoryColors.length];
};

interface FinanceRemainingBudgetCardProps {
  totalBudget: number;
  totalSpent: number;
  categoryBudgets?: CategoryBudgetResponse[];
  className?: string;
  onCardClick?: () => void;
}

export function FinanceRemainingBudgetCard({
  totalBudget,
  totalSpent,
  categoryBudgets = [],
  className = "w-full h-60", // 그리드 컨테이너에 맞춤
  onCardClick,
}: FinanceRemainingBudgetCardProps) {
  const remaining = totalBudget - totalSpent;
  const progressPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOverBudget = totalSpent > totalBudget;

  // CategoryBudgetResponse를 CategoryBudgetProgress에서 사용할 수 있는 형태로 변환
  const categories = categoryBudgets.map((budget, index) => ({
    id: budget.categoryId.toString(),
    name: budget.categoryName,
    amount: parseFloat(budget.spentAmount), // string을 number로 변환
    color: getCategoryColor(index), // 색상 매핑 함수
  }));

  return (
    <Card 
      className={`${className} cursor-pointer rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300`}
      style={{
        backgroundColor: '#ffffff'
      }}
      onClick={onCardClick}
    >
      <CardContent className="p-6 h-full flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-700" style={{ fontFamily: "Hana2-CM" }}>
            남은 예산
          </h3>
        </div>

        <div className="flex flex-col justify-between h-full">
          {/* 남은 예산 정보 - 중앙 배치 */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                총 {totalBudget.toLocaleString()}원 중
              </p>
              <p className="text-3xl text-gray-900" style={{ fontFamily: "Hana2-CM" }}>  
                {remaining.toLocaleString()}원
              </p>
              
            </div>
          </div>

          {/* 카테고리별 예산 진행률 - 하단 배치 */}
          {categories.length > 0 ? (
            <CategoryBudgetProgress
              categories={categories}
              totalBudget={totalBudget}
            />
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">사용률</span>
                <span 
                  className="font-medium"
                  style={{ 
                    color: isOverBudget ? colors.danger.main : colors.secondary.main 
                  }}
                >
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(progressPercentage, 100)}%`,
                    backgroundColor: isOverBudget ? colors.danger.main : colors.secondary.main
                  }}
                />
              </div>
            </div>
          )}


        </div>


      </CardContent>
    </Card>
  );
}
