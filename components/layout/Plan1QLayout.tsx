import { Button } from "@/components/ui/button";
import { ChevronLeft, Check } from "lucide-react";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { colors } from "@/constants/colors";
import { FormHeader } from "./FormHeader";

interface Plan1QHeaderProps {
  title: string;
  onBack?: () => void;
}

export function Plan1QHeader({ title, onBack }: Plan1QHeaderProps) {
  return (
            <FormHeader title={title} onBack={onBack} maxWidth="6xl" />
  );
}

interface Plan1QLayoutProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  steps: string[];
  stepDescriptions?: Record<number, string>;
  completedSteps?: number[];
  onBack?: () => void;
  onStepClick?: (step: number) => void;
  children: React.ReactNode;
}

// 기본 단계별 설명
const defaultStepDescriptions = {
  1: "원하는 목표 선택하기",
  2: "세부 정보 입력하기",
  3: "최종 확인 및 생성",
} as const;

export function Plan1QLayout({
  title,
  currentStep,
  totalSteps,
  steps,
  stepDescriptions,
  completedSteps = [],
  onBack,
  onStepClick,
  children,
}: Plan1QLayoutProps) {
  const handleStepClick = (stepNumber: number) => {
    // 완료된 단계나 현재 단계로 이동 가능
    if (
      (stepNumber <= currentStep || completedSteps.includes(stepNumber)) &&
      onStepClick
    ) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Plan1QHeader title={title} onBack={onBack} />

      <main className="pt-6">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex bg-white rounded-lg shadow-sm">
            {/* 왼쪽 사이드바 - 진행상황 */}
            <div className="hidden lg:block w-96 p-6">
              <div className="sticky top-24 bg-gray-50 rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col space-y-4">
                  {Array.from({ length: totalSteps }).map((_, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = completedSteps.includes(stepNumber);
                    const isCurrent = stepNumber === currentStep;
                    const isClickable =
                      (stepNumber <= currentStep ||
                        completedSteps.includes(stepNumber)) &&
                      onStepClick;
                    const descriptions = stepDescriptions || defaultStepDescriptions;
                    const description =
                      descriptions[
                        stepNumber as keyof typeof descriptions
                      ];

                    return (
                      <div key={index}>
                        <div
                          className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                            isCurrent
                              ? `bg-[${colors.primary.main}]/10 border border-[${colors.primary.main}]/20`
                              : isClickable
                              ? "cursor-pointer hover:bg-gray-50 hover:shadow-sm"
                              : ""
                          }`}
                          onClick={() => handleStepClick(stepNumber)}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                              isCompleted
                                ? `bg-[${colors.primary.main}] text-white`
                                : isCurrent
                                ? `bg-[${colors.primary.main}] text-white`
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w- h-4" />
                            ) : (
                              <span className="font-semibold">{stepNumber}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div
                              className={`text-sm font-medium ${
                                isCurrent || isCompleted
                                  ? "text-gray-900"
                                  : "text-gray-500"
                              }`}
                            >
                              {steps[stepNumber - 1]}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {description}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex-1">
              {/* 모바일용 진행상황 표시 */}
              <div className="lg:hidden p-4 bg-gray-50 border-b border-gray-200">
                <StepIndicator
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  steps={steps}
                  completedSteps={completedSteps}
                  className="justify-center"
                />
              </div>

              {/* 단계별 콘텐츠 */}
              <div className="py-6 px-6 w-full">{children}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
