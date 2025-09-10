import { DashboardInfoCard } from "@/components/ui/DashboardInfoCard";

interface GiftMoneyNewCardProps {
  onAddNew?: () => void;
  className?: string;
}

export function GiftMoneyNewCard({
  onAddNew,
  className = "w-60 h-60",
}: GiftMoneyNewCardProps) {
  return (
    <DashboardInfoCard
      title="새 축의금"
      subtitle="추가하기"
      description="새로운 축의금을 추가하고 관리해보세요"
      actionText="추가하기"
      variant="default"
      color="mint"
      onClick={onAddNew}
      className={className}
      backgroundImage={{
        src: "/hana3dIcon/hanaIcon3d_2_83.png",
        alt: "새 축의금 아이콘",
        position: "bottom-right",
        size: "w-32 h-32",
      }}
    />
  );
} 