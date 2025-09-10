import { Card, CardContent } from "@/components/ui/card";

interface BudgetCategoryCardProps {
  name: string;
  spent: number;
  budget: number;
  color: string;
  size?: "small" | "large";
}

export function BudgetCategoryCard({
  name,
  spent,
  budget,
  color,
  size = "small",
}: BudgetCategoryCardProps) {
  const percentage = (spent / budget) * 100;
  const radius = size === "large" ? 3.5 : 2.5; // rem 단위
  const strokeWidth = size === "large" ? 0.6 : 0.4; // rem 단위
  const svgSize = size === "large" ? 8 : 6; // rem 단위

  const radiusPx = radius * 16; // rem to px for calculation
  const circumference = 2 * Math.PI * radiusPx;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="h-full">
      <CardContent
        className={`${
          size === "large" ? "p-6" : "p-4"
        } h-full flex flex-col justify-center`}
      >
        <div className="flex flex-col items-center space-y-3">
          <h3
            className={`font-medium text-center ${
              size === "large" ? "text-lg" : "text-sm"
            }`}
          >
            {name}
          </h3>

          {/* 원형 진행 바 */}
          <div className="relative">
            <svg
              width={`${svgSize}rem`}
              aspect-ratio="1/1"
              viewBox={`0 0 ${svgSize * 16} ${svgSize * 16}`}
            >
              {/* 배경 원 */}
              <circle
                cx={`${svgSize * 8}`}
                cy={`${svgSize * 8}`}
                r={radiusPx}
                stroke="lightgray"
                strokeWidth={strokeWidth * 16}
                fill="transparent"
                className="text-gray-200"
              />
              {/* 진행 원 */}
              <circle
                cx={`${svgSize * 8}`}
                cy={`${svgSize * 8}`}
                r={radiusPx}
                stroke={color}
                strokeWidth={strokeWidth * 16}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${svgSize * 8} ${svgSize * 8})`}  // 시작점 12시로 회전
                className="transition-all duration-300 ease-in-out"
              />
            </svg>

            {/* 중앙 퍼센티지 표시 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`font-bold ${
                  size === "large" ? "text-2xl" : "text-lg"
                }`}
                style={{ color }}
              >
                {Math.round(percentage)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
