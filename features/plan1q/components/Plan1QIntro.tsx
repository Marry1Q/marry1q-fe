"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { colors } from "@/constants/colors";
import { Laptop, Sparkles } from "lucide-react";

interface Plan1QIntroProps {
  onNext: () => void;
}

export function Plan1QIntro({ onNext }: Plan1QIntroProps) {
  const steps = [
    "나만의 Plan1Q 만들기",
    "AI제안 포트폴리오 설계·가입",
    "목표 달성하기",
  ];

  return (
    <div className="max-w-2xl p-4 space-y-6">
      {/* 헤드라인 */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">
          하나로 끝내는 Plan1Q
        </h1>
        <div className="flex items-center justify-center space-x-4">
          <p className="text-gray-700 text-sm">
            펀드와 적금을 하나의 포트폴리오에 담아 목표를 달성해 보세요.
          </p>
          <div className="relative">
            <Laptop className="w-16 h-16 text-gray-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 단계별 가이드 */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={index} className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                  style={{ backgroundColor: colors.primary.main }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{step}</h3>
                  <p className="text-sm text-gray-600">
                    {index === 0 &&
                      "마음에 드는 목표를 선택하거나 직접 목표를 정해 투자할 금액과 기간을 자유롭게 설정할 수 있어요."}
                    {index === 1 &&
                      "목표로 설정한 금액과 기간을 분석해 최적의 포트폴리오를 제안해 드려요."}
                    {index === 2 &&
                      "가입한 포트폴리오의 목표를 향해 꾸준히 달려가 보세요."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 시작하기 버튼 */}
      <Button
        onClick={onNext}
        className="w-full py-3 text-white font-medium"
        style={{ backgroundColor: colors.primary.main }}
      >
        Plan1Q 시작하기
      </Button>
    </div>
  );
}
