"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, Eye, Star, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { colors } from "@/constants/colors";

interface InvitationStats {
  totalInvitations: number;
  completedInvitations: number;
  draftInvitations: number;
  totalViews: number;
  primaryInvitation?: {
    id: number;
    title: string;
    totalViews: number;
  };
}

interface InvitationDashboardProps {
  stats: InvitationStats;
  onAddNew?: () => void;
}

export function InvitationDashboard({ stats, onAddNew }: InvitationDashboardProps) {
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
    const maxSlides = stats.primaryInvitation ? 4 : 3; // 대표 청첩장이 있으면 4개, 없으면 3개
    if (currentSlide < maxSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  // 슬라이드 가능 여부 업데이트
  useEffect(() => {
    setCanSlideLeft(currentSlide > 0);
    const maxSlides = stats.primaryInvitation ? 4 : 3;
    setCanSlideRight(currentSlide < maxSlides - 1);
  }, [currentSlide, stats.primaryInvitation]);

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
            {/* 1. 새로운 청첩장 추가 카드 */}
            <Card className="min-w-[240px] border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">새 청첩장 만들기</h3>
                <p className="text-sm text-gray-500 mb-4">새로운 청첩장을 만들어보세요</p>
                <Link href="/invitation/create">
                  <Button variant="outline" className="w-full">
                    만들기
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 2. 총 청첩장 카드 */}
            <Card className="min-w-[240px]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.hana.mint.light }}>
                    <Heart className="w-5 h-5" style={{ color: colors.hana.mint.main }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">총 청첩장</p>
                    <p className="text-2xl font-bold" style={{ color: colors.hana.mint.main }}>
                      {stats.totalInvitations}개
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">완료: {stats.completedInvitations}개</span>
                  <span className="text-gray-500">초안: {stats.draftInvitations}개</span>
                </div>
              </CardContent>
            </Card>

            {/* 3. 총 조회수 카드 */}
            <Card className="min-w-[240px]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.hana.blue.light }}>
                    <Eye className="w-5 h-5" style={{ color: colors.hana.blue.main }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">총 조회수</p>
                    <p className="text-2xl font-bold" style={{ color: colors.hana.blue.main }}>
                      {stats.totalViews.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  평균 {stats.totalInvitations > 0 ? Math.round(stats.totalViews / stats.totalInvitations) : 0}회/청첩장
                </div>
              </CardContent>
            </Card>

            {/* 4. 대표 청첩장 카드 */}
            {stats.primaryInvitation && (
              <Card className="min-w-[240px] border-2" style={{ borderColor: colors.hana.yellow.main }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.hana.yellow.light }}>
                      <Star className="w-5 h-5" style={{ color: colors.hana.yellow.main }} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">대표 청첩장</p>
                      <p className="text-lg font-bold" style={{ color: colors.hana.yellow.main }}>
                        {stats.primaryInvitation.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    조회수: {stats.primaryInvitation.totalViews}회
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 슬라이드 인디케이터 (모바일에서만 표시) */}
        <div className="flex justify-center gap-2 mt-4 lg:hidden">
          {Array.from({ length: stats.primaryInvitation ? 4 : 3 }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-200 ${
                i === currentSlide
                  ? "bg-blue-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setCurrentSlide(i)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
} 