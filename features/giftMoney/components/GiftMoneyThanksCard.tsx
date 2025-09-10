import { DashboardInfoCard } from "@/components/ui/DashboardInfoCard";

interface GiftMoneyThanksCardProps {
  thanksSentCount: number;
  thanksNotSentCount: number;
  onThanksClick?: () => void;
  className?: string;
}

export function GiftMoneyThanksCard({
  thanksSentCount,
  thanksNotSentCount,
  onThanksClick,
  className = "w-60 h-60",
}: GiftMoneyThanksCardProps) {
  const thanksProgress = (thanksSentCount + thanksNotSentCount) > 0 
    ? (thanksSentCount / (thanksSentCount + thanksNotSentCount)) * 100 
    : 0;

  return (
    <DashboardInfoCard
      title="미완료 현황"
      subtitle={`${thanksNotSentCount}명`}
      description="감사인사를 전달하세요!"
      actionText="미완료 보기"
      variant="default"
      color="red"
      onClick={onThanksClick}
      className={className}
      backgroundImage={{
        src: "/hana3dIcon/hanaIcon3d_4_103.png",
        alt: "감사인사 아이콘",
        position: "bottom-right",
        size: "w-32 h-32",
      }}
    />
  );
} 