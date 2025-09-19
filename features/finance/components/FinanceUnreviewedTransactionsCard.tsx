import { DashboardInfoCard } from "@/components/ui/DashboardInfoCard";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { colors } from "@/constants/colors";

interface FinanceUnreviewedTransactionsCardProps {
  unreviewedCount: number;
  isReviewMode?: boolean;
  className?: string;
  onCardClick?: () => void;
}

export function FinanceUnreviewedTransactionsCard({
  unreviewedCount,
  isReviewMode = false,
  className = "w-60 h-60",
  onCardClick,
}: FinanceUnreviewedTransactionsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLockedHover, setIsLockedHover] = useState(false);

  // 미리뷰 내역이 0건일 때와 그렇지 않을 때를 구분
  const isAllReviewed = unreviewedCount === 0;

  const isActive = !isAllReviewed && (isHovered || isLockedHover || isReviewMode);

  const handleClick = () => {
    if (isAllReviewed) return;
    // 클릭 시 호버 스타일을 고정/해제
    setIsLockedHover(prev => !prev);
    // 기존 클릭 콜백 유지
    if (onCardClick) onCardClick();
  };

  return (
    <div
      className={cn(
        "flex-shrink-0 snap-start", 
        className,
        isAllReviewed ? "" : "cursor-pointer group"
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 h-full",
          isAllReviewed ? "" : "hover:shadow-xl"
        )}
        style={{ 
          backgroundColor: isActive ? colors.hana.yellow.main : '#ffffff',
          border: isAllReviewed ? '1px solid #e5e7eb' : (isActive || isReviewMode ? `2px solid ${colors.hana.yellow.main}` : '1px solid #e5e7eb')
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 배경 이미지 */}
        <div className="absolute bottom-0 -right-8 w-32 h-32">
          <img
            src={isAllReviewed ? "/hana3dIcon/hanaIcon3d_4_121.png" : "/hana3dIcon/hanaIcon3d_4_125.png"}
            alt="리뷰 아이콘"
            className="w-full h-full object-contain"
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="relative p-6 h-full flex flex-col">
          <div className="flex-1 flex flex-col">
            <div className="mb-2">
              <p className="text-sm mb-1" style={{ color: isActive ? '#ffffff' : '#000000' }}>미리뷰 내역</p>
              <h3
                className="text-xl mb-2"
                style={{ fontFamily: "Hana2-CM", color: isActive ? '#ffffff' : '#000000' }}
              >
                {unreviewedCount}건
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: isActive ? '#ffffff' : '#000000' }}>
                {isAllReviewed 
                  ? "모임통장의 모든 내역을 리뷰하였습니다!" 
                  : (isReviewMode ? "거래내역을 확인 중입니다" : "가계부를 작성해주세요")
                }
              </p>
            </div>
            {!isAllReviewed && (
              <div className="flex items-center text-sm mt-auto" style={{ color: isActive ? '#ffffff' : '#000000' }}>
                <span>{isReviewMode ? "일반 내역 보기" : "확인하기"}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: isActive ? '#ffffff' : '#000000' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
