import React, { useState } from "react";
import { DashboardInfoCard } from "@/components/ui/DashboardInfoCard";
import { useRouter } from "next/navigation";

interface InProgressGoalsCardProps {
  inProgressGoals: any[]; // 실제 타입에 맞게 수정 필요
  className?: string;
}

export function InProgressGoalsCard({
  inProgressGoals,
  className = "w-60 h-60",
}: InProgressGoalsCardProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleGoalClick = (goalId: number) => {
    router.push(`/plan1q/${goalId}`);
  };

  // 진행중 목표가 없으면 렌더링하지 않음
  if (inProgressGoals.length === 0) {
    return null;
  }

  const goal = inProgressGoals[Math.min(activeIndex, inProgressGoals.length - 1)];

  const unsubscribedCount = Array.isArray(goal.products)
    ? goal.products.filter((p: any) => !p.subscribed).length
    : 0;

  return (
    <div className="relative">
      <DashboardInfoCard
        title="상품 가입 대기중"
        subtitle={goal.name}
        description={`${unsubscribedCount}건의 상품가입을 완료해주세요`}
        variant="default"
        color="mint"
        onClick={() => handleGoalClick(goal.id)}
        className={className}
        backgroundImage={{
          src: "/hana3dIcon/hanaIcon3d_11.png",
          alt: "Hana 3D Icon",
          position: "bottom-right",
          size: "w-32 h-32",
          customClass: "-right-4",
        }}
        actionText=""
        disableHover={true}
      />

      {inProgressGoals.length > 1 && (
        <div className="absolute bottom-6 left-6 right-2">
          <div className="flex justify-center gap-1">
            {inProgressGoals.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === activeIndex
                    ? "bg-gray-800"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
