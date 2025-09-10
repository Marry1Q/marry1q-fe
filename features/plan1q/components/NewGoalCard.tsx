import React from "react";
import { useRouter } from "next/navigation";
import { DashboardInfoCard } from "@/components/ui/DashboardInfoCard";

interface NewGoalCardProps {
  onStartNewGoal?: () => void;
  className?: string;
}

export function NewGoalCard({
  onStartNewGoal,
  className = "w-60 h-60",
}: NewGoalCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onStartNewGoal) {
      onStartNewGoal();
    } else {
      // store 데이터 초기화
      if (typeof window !== "undefined") {
        localStorage.removeItem("plan1q-store");
      }
      // 기본 동작: 새 목표 생성 페이지로 이동
      router.push("/plan1q/create");
    }
  };

  return (
    <DashboardInfoCard
      title="새로운 목표"
      subtitle="Plan1Q 시작하기"
      variant="default"
      color="mint"
      description="AI 포트폴리오로 신혼생활을 시작해보세요"
      onClick={handleClick}
      className={className}
      actionText="시작하기"
      backgroundImage={{
        src: "/hana3dIcon/hanaIcon3d_103.png",
        alt: "Hana 3D Icon",
        position: "bottom-right",
        size: "w-32 h-32",
        customClass: "-right-4",
        customStyle: { bottom: "-8px" },
      }}
    />
  );
}
