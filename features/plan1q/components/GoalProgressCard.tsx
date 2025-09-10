import React from "react";
import { DashboardInfoCard } from "@/components/ui/DashboardInfoCard";

interface GoalProgressCardProps {
  totalGoals?: number;
  completedGoals?: number;
  inProgressGoals?: number;
  overallProgress?: number;
  onClick?: () => void;
  className?: string;
}

export function GoalProgressCard({
  totalGoals = 4,
  completedGoals = 1,
  inProgressGoals = 2,
  overallProgress = 65,
  onClick,
  className = "w-60 h-60",
}: GoalProgressCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // 기본 동작
      console.log("목표 현황 보기");
    }
  };

  const getProgressDescription = () => {
    if (completedGoals === totalGoals) {
      return "모든 목표를 달성했습니다!";
    } else if (completedGoals === 0) {
      return `진행 중인 목표 ${inProgressGoals}개`;
    } else {
      return `완료 ${completedGoals}개, 진행 중 ${inProgressGoals}개`;
    }
  };

  return (
    <DashboardInfoCard
      title="전체 목표 달성 현황"
      subtitle={`${overallProgress}% 달성률`}
      description={getProgressDescription()}
      variant="default"
      color="yellow"
      onClick={handleClick}
      className={className}
      actionText=""
      backgroundImage={{
        src: "/hana3dIcon/hanaIcon3d_2_47.png",
        alt: "Hana 3D Icon",
        position: "bottom-right",
        size: "w-32 h-32",
        customClass: "-right-4",
      }}
    />
  );
}
