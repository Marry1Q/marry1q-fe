import { DashboardInfoCard } from "@/components/ui/DashboardInfoCard";

interface GiftMoneyPeopleCardProps {
  totalCount: number;
  className?: string;
  onCardClick?: () => void;
  isStatisticsActive?: boolean;
}

export function GiftMoneyPeopleCard({
  totalCount,
  className = "w-60 h-60",
  onCardClick,
  isStatisticsActive = false,
}: GiftMoneyPeopleCardProps) {
  return (
    <DashboardInfoCard
      title="총 인원"
      subtitle={`${totalCount}명`}
      description={isStatisticsActive ? "전체 내역을 확인하세요" : "축의금 인원 수를 확인하세요"}
      actionText={isStatisticsActive ? "전체 내역 보기" : "자세히 보기"}
      variant="default"
      color="yellow"
      onClick={onCardClick}
      className={className}
      backgroundImage={{
        src: "/hana3dIcon/hanaIcon3d_4_121.png",
        alt: "인원 아이콘",
        position: "bottom-right",
        size: "w-32 h-32",
      }}
    />
  );
} 