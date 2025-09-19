"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, ChevronRight, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { colors } from "@/constants/colors";
import { HanaIcon } from "@/components/ui/HanaIcon";

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

interface GoalCardProps {
  goal: FinancialGoal;
  onClick?: () => void;
  variant?: "default" | "compact" | "detailed";
}

export function GoalCard({
  goal,
  onClick,
  variant = "default",
}: GoalCardProps) {
  const IconComponent = goal.icon;
  
  // 모든 상품이 가입된 경우에만 진행상황 계산
  const allProductsSubscribed = goal.products.every(product => product.subscribed);
  const progress = allProductsSubscribed 
    ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
    : 0;



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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행중":
        return "bg-green-100 text-green-700 border-green-200";
      case "가입진행중":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "만료":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "취소":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Progress bar 색상 결정
  const getProgressColor = () => {
    if (isCompleted) {
      return colors.hana.blue.main;
    }
    if (isHighProgress) {
      return colors.hana.red.main;
    }
    return colors.hana.mint.main;
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        onClick && "cursor-pointer",
        "bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-md",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-700 hover:before:translate-x-[100%]"
      )}
      onClick={onClick}
    >
    {/* 상단 그라데이션 배경 */}
    <div
      className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
        goal.status === "진행중" && "from-green-400 to-emerald-500",
        goal.status === "가입진행중" && "from-blue-400 to-cyan-500",
        goal.status === "만료" && "from-gray-400 to-slate-500",
        goal.status === "취소" && "from-red-400 to-pink-500"
      )}
    />

    <CardHeader>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3
            className="text-2xl text-gray-900 group-hover:text-gray-700 transition-colors mb-2"
            style={{ fontFamily: "Hana2-CM" }}
          >
            {goal.name}
          </h3>
          <span className="text-sm text-gray-500">
            목표 금액 {(goal.targetAmount || 0).toLocaleString()}원
          </span>
          {allProductsSubscribed && (
            <>
              <br />
              <span className="text-sm text-gray-500">
                현재 모은 금액 {(goal.currentAmount || 0).toLocaleString()}원
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <HanaIcon name={goal.icon} size={56} className="flex-shrink-0" />
        </div>
      </div>
    </CardHeader>

    <CardContent className="space-y-4">
      {/* 진행률 섹션 */}
      <div className="space-y-3">
        <div className="flex items-center">
          <span
            className="text-xl text-gray-900"
            style={{ fontFamily: "Hana2-CM" }}
          >
            {progress}%
          </span>
        </div>

        <div className="relative">
          <Progress
            value={progress}
            className="h-2 rounded-full overflow-hidden"
            color={getProgressColor()}
            backgroundColor="rgb(229 231 235)"
          />
        </div>

        <div className="flex justify-between items-baseline"></div>
      </div>



      {/* 수익률 섹션 */}
      <div className="flex justify-between items-center bg-gray-50/50 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            {goal.products.every(product => product.subscribed) ? "수익률" : "예상 수익률"}
          </span>
        </div>
        <span
          className="text text-gray-900"
          style={{ fontFamily: "Hana2-CM" }}
        >
          {goal.products.every(product => product.subscribed) ? goal.actualReturnRate : goal.returnRate}%
        </span>
      </div>

      {/* 만기일 및 상태 */}
      <div
        className={cn(
          "flex items-center bg-gray-50/50 rounded-lg",
          isCompleted ? "justify-end" : "justify-between"
        )}
      >
        {!isCompleted && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              {new Date(goal.maturityDate).toLocaleDateString()}까지
            </span>
          </div>
        )}
        {isCompleted ? (
          <span className="text-sm text-gray-600">
            {new Date(goal.maturityDate).toLocaleDateString()} 만료됨
          </span>
        ) : (
          <span className="text-sm text-gray-600">
            {`${Math.abs(daysLeft)}일 ${daysLeft >= 0 ? '남음' : '지남'}`}
          </span>
          // <Badge
          //   variant="outline"
          //   className={cn(
          //     "text-xs font-medium flex items-center justify-center",
          //     getStatusColor(goal.status)
          //   )}
          // >
          //   {`${daysLeft}일 남음`}
          // </Badge>
        )}
      </div>
    </CardContent>

    {/* {onClick && (
      <CardFooter>
        <Button
          variant="primary-hover"
          className="w-full group/btn transition-all duration-300"
          onClick={onClick}
        >
          <span className="group-hover/btn:translate-x-1 transition-transform duration-300">
            상세 보기
          </span>
          <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </Button>
      </CardFooter>
    )} */}
  </Card>
  );
}
