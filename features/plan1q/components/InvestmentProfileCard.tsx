import React from "react";
import { DashboardInfoCard } from "@/components/ui/DashboardInfoCard";
import { useRouter } from "next/navigation";

interface InvestmentProfile {
  type: string;
  description: string;
  isExpired: boolean;
  expiredDate?: string; // 검사 만료일 추가
}

interface InvestmentProfileCardProps {
  profile: InvestmentProfile | null;
  onExpiredClick?: () => void;
  className?: string;
}

export function InvestmentProfileCard({
  profile,
  onExpiredClick,
  className = "w-60 h-60",
}: InvestmentProfileCardProps) {
  const router = useRouter();

  // 투자성향 프로필이 없는 경우 (검사가 필요한 상태)
  if (!profile) {
    return (
      <DashboardInfoCard
        title="투자 성향"
        subtitle="검사 필요"
        description="투자성향 검사 후 Plan1Q를 이용할 수 있습니다"
        actionText="검사하기"
        variant="default"
        color="blue"
        className={className}
        onClick={() => {
          if (onExpiredClick) {
            onExpiredClick();
          } else {
            router.push("/plan1q/test");
          }
        }}
        backgroundImage={{
          src: "/hana3dIcon/hanaIcon3d_67.png",
          alt: "Hana 3D Icon",
          position: "bottom-right",
          size: "w-32 h-32",
          customClass: "-right-4",
          customStyle: { bottom: "-4px" },
        }}
      />
    );
  }

  const handleClick = () => {
    if (profile.isExpired) {
      if (onExpiredClick) {
        onExpiredClick();
      } else {
        // 기본 동작: 투자성향 검사 페이지로 이동
        router.push("/plan1q/test");
      }
    }
  };

  const getDescription = () => {
    if (profile.isExpired) {
      return "투자성향 검사 후 Plan1Q를 이용할 수 있습니다";
    }
    if (profile.expiredDate) {
      return `만료일: ${profile.expiredDate}`;
    }
    return profile.description;
  };

  const getActionText = () => {
    if (profile.isExpired) {
      return "검사하기";
    }
    return "";
  };

  return (
    <DashboardInfoCard
      title="투자 성향"
      subtitle={profile.isExpired ? "검사 만료" : profile.type}
      description={getDescription()}
      actionText={getActionText()}
      variant="default"
      color="blue"
      className={className}
      onClick={handleClick}
      backgroundImage={{
        src: profile.isExpired ? "/hana3dIcon/hanaIcon3d_67.png" : "/hana3dIcon/hanaIcon3d_3_103.png",
        alt: "Hana 3D Icon",
        position: "bottom-right",
        size: "w-32 h-32",
        customClass: "-right-4",
        customStyle: { bottom: "-4px" },
      }}
    />
  );
}
