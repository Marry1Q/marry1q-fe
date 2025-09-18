"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SafeAccountReviewCard } from "./SafeAccountReviewCard";
import { GiftMoneyTotalCard } from "./GiftMoneyTotalCard";
import { GiftMoneyPeopleCard } from "./GiftMoneyPeopleCard";
import { GiftMoneyThanksCard } from "./GiftMoneyThanksCard";

interface GiftMoneyDashboardProps {
  totalAmount: number;
  totalCount: number;
  thanksSentCount: number;
  thanksNotSentCount: number;
  safeAccountPendingCount?: number;
  isSafeAccountReviewMode?: boolean;
  onAddNew?: () => void;
  onThanksClick?: () => void;
  onStatisticsClick?: () => void;
  onSafeAccountReviewClick?: () => void;
}

export function GiftMoneyDashboard({
  totalAmount,
  totalCount,
  thanksSentCount,
  thanksNotSentCount,
  safeAccountPendingCount = 0,
  isSafeAccountReviewMode = false,
  onAddNew,
  onThanksClick,
  onStatisticsClick,
  onSafeAccountReviewClick,
}: GiftMoneyDashboardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canSlideLeft, setCanSlideLeft] = useState(false);
  const [canSlideRight, setCanSlideRight] = useState(true);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // 마우스 오버 시 휠로 좌우 스크롤
  useEffect(() => {
    const container = slideContainerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, []);

  // 슬라이드 네비게이션 함수들
  const handleSlideLeft = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSlideRight = () => {
    if (currentSlide < 3) { // 4개 카드 (0-3 인덱스)
      setCurrentSlide(currentSlide + 1);
    }
  };

  // 슬라이드 가능 여부 업데이트
  useEffect(() => {
    setCanSlideLeft(currentSlide > 0);
    setCanSlideRight(currentSlide < 3);
  }, [currentSlide]);



  return (
    <div className="mb-8">
      {/* 슬라이드 컨테이너 */}
      <div className="relative">
        {/* 이전 화살표 */}
        {canSlideLeft && (
          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 opacity-0 hover:opacity-100"
            onClick={handleSlideLeft}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
            <span className="sr-only">이전</span>
          </button>
        )}

        {/* 다음 화살표 */}
        {canSlideRight && (
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 opacity-0 hover:opacity-100"
            onClick={handleSlideRight}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
            <span className="sr-only">다음</span>
          </button>
        )}

        <div
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          ref={slideContainerRef}
        >
          <div
            className="flex gap-4 mx-auto transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 264}px)`, // 240px (카드 너비) + 24px (gap)
            }}
          >
            {/* 1. 안심계좌 리뷰 카드 */}
            <SafeAccountReviewCard 
              pendingCount={safeAccountPendingCount}
              isReviewMode={isSafeAccountReviewMode}
              onCardClick={onSafeAccountReviewClick}
            />

            {/* 2. 총 축의금 카드 */}
            <GiftMoneyTotalCard 
              totalAmount={totalAmount} 
              onCardClick={onStatisticsClick}
            />

            {/* 3. 총 인원 카드 */}
            <GiftMoneyPeopleCard 
              totalCount={totalCount} 
              onCardClick={onStatisticsClick}
            />

            {/* 4. 미완료 감사연락 카드 */}
            <GiftMoneyThanksCard
              thanksSentCount={thanksSentCount}
              thanksNotSentCount={thanksNotSentCount}
              onThanksClick={onThanksClick}
            />
          </div>
        </div>

        {/* 슬라이드 인디케이터 (모바일에서만 표시) */}
        <div className="flex justify-center gap-2 mt-4 lg:hidden">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-200 ${
                index === currentSlide
                  ? "bg-blue-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
} 