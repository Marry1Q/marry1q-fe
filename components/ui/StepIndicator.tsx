import { CheckCircle } from "lucide-react";
import { colors } from "@/constants/colors";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
  completedSteps?: number[];
  className?: string;
}

export function StepIndicator({
  currentStep,
  totalSteps,
  steps,
  completedSteps = [],
  className = "",
}: StepIndicatorProps) {
  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = completedSteps.includes(stepNumber);
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                isCompleted
                  ? `bg-[${colors.primary.main}] text-white`
                  : isCurrent
                  ? `bg-[${colors.primary.main}] text-white`
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="font-semibold text-sm">{stepNumber}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
