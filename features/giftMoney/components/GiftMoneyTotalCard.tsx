import { DashboardInfoCard } from "@/components/ui/DashboardInfoCard";

interface GiftMoneyTotalCardProps {
  totalAmount: number;
  className?: string;
  onCardClick?: () => void;
  isStatisticsActive?: boolean;
}

export function GiftMoneyTotalCard({
  totalAmount,
  className = "w-60 h-60",
  onCardClick,
  isStatisticsActive = false,
}: GiftMoneyTotalCardProps) {
  return (
    <DashboardInfoCard
      title="총 축의금"
      subtitle={`${totalAmount.toLocaleString()}원`}
      description={isStatisticsActive ? "전체 내역을 확인하세요" : "축의금 총액을 확인하세요"}
      actionText={isStatisticsActive ? "전체 내역 보기" : "자세히 보기"}
      variant="default"
      color="blue"
      onClick={onCardClick}
      className={className}
      backgroundImage={{
        src: "/hana3dIcon/hanaIcon3d_2_53.png",
        alt: "축의금 아이콘",
        position: "bottom-right",
        size: "w-32 h-32",
      }}
    />
  );
} 