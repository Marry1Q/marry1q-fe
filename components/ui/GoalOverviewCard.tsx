import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { HanaIcon } from "@/components/ui/HanaIcon";
import { IconName } from "@/lib/iconMapping";
import { Target, Calendar, TrendingUp, DollarSign } from "lucide-react";
import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils";

interface GoalOverviewCardProps {
  goal: {
    id: number;
    name: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    returnRate: number;
    maturityDate: string;
    icon: IconName;
    color: string;
    status: string;
  };
}

export function GoalOverviewCard({ goal }: GoalOverviewCardProps) {
  const progress = Math.min(
    Math.round((goal.currentAmount / goal.targetAmount) * 100),
    100
  );

  const calculateDaysLeft = (maturityDate: string) => {
    const today = new Date();
    const maturity = new Date(maturityDate);
    const diffTime = maturity.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(goal.maturityDate);
  const isCompleted = goal.status === "완료";
  const isHighProgress = progress >= 80 && !isCompleted;

  const getProgressColor = () => {
    if (isCompleted) {
      return colors.hana.blue.main;
    }
    if (isHighProgress) {
      return colors.hana.red.main;
    }
    return colors.hana.mint.main;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행중":
        return "bg-green-100 text-green-700 border-green-200";
      case "가입진행중":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "완료":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-mint-100 to-mint-200">
              <HanaIcon name={goal.icon} size={40} />
            </div>
            <div>
              <CardTitle
                className="text-2xl text-gray-900 mb-1"
                style={{ fontFamily: "Hana2-CM" }}
              >
                {goal.name}
              </CardTitle>
              <p className="text-gray-600 text-sm">{goal.description}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn("text-xs font-medium", getStatusColor(goal.status))}
          >
            {goal.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 진행률 섹션 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">진행률</span>
            <span
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "Hana2-CM" }}
            >
              {progress}%
            </span>
          </div>
          <Progress
            value={progress}
            className="h-3 rounded-full"
            style={
              {
                backgroundColor: "rgb(229 231 235)",
                "--progress-color": getProgressColor(),
              } as React.CSSProperties
            }
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>현재: {goal.currentAmount.toLocaleString()}원</span>
            <span>목표: {goal.targetAmount.toLocaleString()}원</span>
          </div>
        </div>

        {/* 주요 지표들 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">예상 수익률</span>
            </div>
            <span
              className="text-lg font-bold text-gray-900"
              style={{ fontFamily: "Hana2-CM" }}
            >
              연 {goal.returnRate}%
            </span>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">남은 기간</span>
            </div>
            <span
              className="text-lg font-bold text-gray-900"
              style={{ fontFamily: "Hana2-CM" }}
            >
              {daysLeft}일
            </span>
          </div>
        </div>

        {/* 만기일 정보 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">만기일</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(goal.maturityDate).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
