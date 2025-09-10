import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils";

interface PerformanceCardProps {
  totalInvestment: number;
  currentValue: number;
  totalProfit: number;
  returnRate: number;
  products: Array<{
    id: number;
    name: string;
    profit: number;
    returnRate: number;
  }>;
}

export function PerformanceCard({
  totalInvestment,
  currentValue,
  totalProfit,
  returnRate,
  products,
}: PerformanceCardProps) {
  const isPositive = totalProfit >= 0;
  const profitPercentage =
    totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <PieChart className="w-5 h-5 text-blue-500" />
          <span style={{ fontFamily: "Hana2-CM" }}>수익 현황</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 전체 수익 요약 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">총 투자금액</span>
            </div>
            <span
              className="text-lg font-bold text-gray-900"
              style={{ fontFamily: "Hana2-CM" }}
            >
              {totalInvestment.toLocaleString()}원
            </span>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">현재 가치</span>
            </div>
            <span
              className="text-lg font-bold text-gray-900"
              style={{ fontFamily: "Hana2-CM" }}
            >
              {currentValue.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 수익률 및 수익 */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">총 수익</span>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              )}
              <span
                className={cn(
                  "text-lg font-bold",
                  isPositive ? "text-green-600" : "text-red-600"
                )}
                style={{ fontFamily: "Hana2-CM" }}
              >
                {isPositive ? "+" : ""}
                {totalProfit.toLocaleString()}원
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">수익률</span>
            <span
              className={cn(
                "text-lg font-bold",
                isPositive ? "text-green-600" : "text-red-600"
              )}
              style={{ fontFamily: "Hana2-CM" }}
            >
              {isPositive ? "+" : ""}
              {returnRate.toFixed(2)}%
            </span>
          </div>

          <div className="mt-3">
            <Progress
              value={Math.abs(profitPercentage)}
              className="h-2 rounded-full"
              style={
                {
                  backgroundColor: "rgb(229 231 235)",
                  "--progress-color": isPositive
                    ? colors.hana.mint.main
                    : colors.hana.red.main,
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        {/* 상품별 수익률 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">상품별 수익률</h4>
          <div className="space-y-2">
            {products.map((product) => {
              const isProductPositive = product.profit >= 0;
              return (
                <div
                  key={product.id}
                  className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-100"
                >
                  <span className="text-sm text-gray-700">{product.name}</span>
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isProductPositive ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {isProductPositive ? "+" : ""}
                      {product.returnRate.toFixed(2)}%
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        isProductPositive ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {isProductPositive ? "+" : ""}
                      {product.profit.toLocaleString()}원
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
