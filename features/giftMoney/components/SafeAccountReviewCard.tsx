import { DashboardInfoCard } from "@/components/ui/DashboardInfoCard";

interface SafeAccountReviewCardProps {
  pendingCount: number;
  isReviewMode?: boolean;
  className?: string;
  onCardClick?: () => void;
}

export function SafeAccountReviewCard({
  pendingCount,
  isReviewMode = false,
  className = "w-60 h-60",
  onCardClick,
}: SafeAccountReviewCardProps) {
  // 리뷰 대기 내역이 0건일 때와 그렇지 않을 때를 구분
  const isAllReviewed = pendingCount === 0;

  return (
    <DashboardInfoCard
      title="축의금 입금 확인"
      subtitle={`${pendingCount}건`}
      description={isAllReviewed
        ? "모든 내역을 리뷰하였습니다!"
        : (isReviewMode ? "입금 내역을 확인 중입니다" : "축의금으로 등록해주세요")
      }
      actionText={isAllReviewed ? undefined : (isReviewMode ? "일반 내역 보기" : "확인하기")}
      variant="default"
      color="mint"
      active={!isAllReviewed && isReviewMode}
      onClick={isAllReviewed ? undefined : onCardClick}
      className={className}
      backgroundImage={{
        src: "/hana3dIcon/hanaIcon3d_2_83.png",
        alt: "안심계좌 리뷰 아이콘",
        position: "bottom-right",
        size: "w-32 h-32",
      }}
    />
  );
}
