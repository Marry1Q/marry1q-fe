import React from 'react';
import { colors } from '../../../constants/colors';

interface CategoryBudget {
  id: string;
  name: string;
  amount: number;
  color: string;
}

interface CategoryBudgetProgressProps {
  categories: CategoryBudget[];
  totalBudget: number;
  className?: string;
  barHeight?: number; // 진행률 바 높이 (기본값: 24px)
}

const DEFAULT_COLORS = [
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

export function CategoryBudgetProgress({
  categories,
  totalBudget,
  className = "",
  barHeight = 18,
}: CategoryBudgetProgressProps) {
  const usedBudget = categories.reduce((sum, category) => sum + category.amount, 0);
  const remainingBudget = totalBudget - usedBudget;
  const isOverBudget = usedBudget > totalBudget;

  // 카테고리별 비율 계산
  const categorySegments = categories.map((category, index) => ({
    ...category,
    percentage: totalBudget > 0 ? (category.amount / totalBudget) * 100 : 0,
    color: category.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  // 남은 예산 비율
  const remainingPercentage = totalBudget > 0 ? (remainingBudget / totalBudget) * 100 : 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 진행률 바 */}
      <div 
        className="relative bg-gray-200 rounded-full overflow-hidden"
        style={{ height: `${barHeight}px` }}
      >
        {/* 카테고리별 세그먼트 */}
        {categorySegments.map((segment, index) => {
          const previousWidth = categorySegments
            .slice(0, index)
            .reduce((sum, cat) => sum + cat.percentage, 0);
          
          return (
            <div
              key={segment.id}
              className="absolute h-full transition-all duration-300"
              style={{
                left: `${previousWidth}%`,
                width: `${segment.percentage}%`,
                backgroundColor: segment.color,
              }}
            />
          );
        })}
        
        {/* 남은 예산 세그먼트 */}
        {remainingBudget > 0 && (
          <div
            className="absolute h-full transition-all duration-300"
            style={{
              left: `${100 - remainingPercentage}%`,
              width: `${remainingPercentage}%`,
              backgroundColor: '#e5e7eb', // medium light gray
            }}
          />
        )}
      </div>

      {/* 범례 - 4개씩 한 줄에 표시 */}
      <div className="flex flex-wrap gap-2 text-xs">
        {categorySegments.map((segment) => (
          <div key={segment.id} className="flex items-center space-x-1 min-w-0">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-gray-700 truncate text-xs">{segment.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
