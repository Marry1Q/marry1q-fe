import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { colors } from "@/constants/colors";

interface GoalNotFoundProps {
  onBack: () => void;
}

export function GoalNotFound({ onBack }: GoalNotFoundProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          목표를 찾을 수 없습니다
        </h2>
        <p className="text-gray-600 mb-4">
          요청하신 목표가 존재하지 않거나 삭제되었습니다.
        </p>
        <Link href="/plan1q">
          <Button style={{ backgroundColor: colors.primary.main }}>
            Plan1Q 목록으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
} 