import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import { colors } from "@/constants/colors";

interface SubscriptionProgressAlertProps {
  subscribedCount: number;
  totalCount: number;
  progress: number;
}

export function SubscriptionProgressAlert({
  subscribedCount,
  totalCount,
  progress,
}: SubscriptionProgressAlertProps) {
  if (subscribedCount === totalCount) return null;

  // 항상 Hana red 색상 사용
  const progressColor = colors.hana.red.main;
  const backgroundColor = colors.hana.red.light + "20";
  const borderColor = colors.hana.red.light;

  return (
    <Card
      className="mb-6"
      style={{
        borderColor,
        backgroundColor,
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="w-5 h-5 mt-0.5"
            style={{ color: progressColor }}
          />
          <div className="flex-1">
            <h3
              className="text-sm font-bold mb-2"
              style={{ color: progressColor }}
            >
              상품 가입 진행률
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span
                  className="text-xs"
                  style={{ color: progressColor }}
                >
                  {subscribedCount}/{totalCount} 상품 가입 완료
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: progressColor }}
                >
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress
                value={progress}
                className="h-2"
                color={progressColor}
                backgroundColor={backgroundColor}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 