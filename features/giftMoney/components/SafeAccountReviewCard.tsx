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

  // 토글 기능을 위한 텍스트 결정
  const getCardTexts = () => {
    if (isAllReviewed) {
      return {
        title: "미리뷰 내역",
        subtitle: "0건",
        description: "모든 내역을 리뷰하였습니다!",
        actionText: undefined
      };
    }

    if (isReviewMode) {
      return {
        title: "미리뷰 내역",
        subtitle: `${pendingCount}건`,
        description: "입금 내역을 확인 중입니다",
        actionText: "전체 내역 보기"
      };
    }

    return {
      title: "미리뷰 내역",
      subtitle: `${pendingCount}건`,
      description: "축의금으로 등록해주세요",
      actionText: "확인하기"
    };
  };

  const cardTexts = getCardTexts();

  return (
    <DashboardInfoCard
      title={cardTexts.title}
      subtitle={cardTexts.subtitle}
      description={cardTexts.description}
      actionText={cardTexts.actionText}
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
