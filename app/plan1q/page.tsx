"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Home,
  GraduationCap,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { InvestmentProfileCard } from "@/features/plan1q/components/InvestmentProfileCard";
import { InProgressGoalsCard } from "@/features/plan1q/components/InProgressGoalsCard";
import { NewGoalCard } from "@/features/plan1q/components/NewGoalCard";
import { GoalProgressCard } from "@/features/plan1q/components/GoalProgressCard";
import { GoalCardList } from "@/features/plan1q/components/GoalCardList";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { Pagination } from "@/components/layout/Pagination";
import { usePlan1QStore } from "@/features/plan1q";
import { useAuth } from "@/lib/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Plan1QPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("goals");
  
  // 인증 상태 확인
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Store 사용
  const { 
    investmentProfile, 
    goals,
    isProfileLoading, 
    isGoalsLoading,
    fetchInvestmentProfile,
    fetchGoals
  } = usePlan1QStore();

  // 인증 확인 후 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, authLoading, router]);

  // 투자성향 프로필과 목표 목록 조회 (인증된 사용자만)
  useEffect(() => {
    if (isAuthenticated) {
      fetchInvestmentProfile();
      fetchGoals();
    }
  }, [isAuthenticated, fetchInvestmentProfile, fetchGoals]);

  // 필터 및 검색 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [periodFilter, setPeriodFilter] = useState("전체");
  const [sortBy, setSortBy] = useState("최신순");

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 3개씩 2줄

  // 슬라이드 상태
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canSlideLeft, setCanSlideLeft] = useState(false);
  const [canSlideRight, setCanSlideRight] = useState(true);

  // 슬라이드 컨테이너 ref
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

  // API 데이터를 기존 컴포넌트 형식에 맞게 변환
  const allFinancialGoals = goals.map(goal => ({
    id: goal.goalId,
    name: goal.goalName,
    status: goal.statusName || "진행중",
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount || 0,
    returnRate: goal.totalExpectedReturn || 0,
    actualReturnRate: goal.actualReturnRate || 0,
    maturityDate: goal.maturityDate,
    icon: goal.icon || "house_deposit",
    color: goal.color || "bg-blue-100 text-blue-600",
    subscriptionProgress: goal.subscriptionProgress || 0,
    createdDate: goal.createdAt,
    owner: "사용자",
    products: goal.products.map(product => ({
      name: product.productName,
      amount: product.investmentAmount,
      ratio: product.investmentRatio,
      returnRate: product.returnRate,
      subscribed: product.subscribed
    })),
  }));

  // 전체 목표 데이터 (필터링과 독립적)
  const totalGoals = allFinancialGoals.length;
  const completedGoals = allFinancialGoals.filter((goal) => goal.status === "완료").length;
  const inProgressGoalsCount = allFinancialGoals.filter((goal) => goal.status === "가입진행중").length;
  const inProgressGoals = allFinancialGoals.filter((goal) => goal.status === "가입진행중");
  const overallProgress = Math.round(
    allFinancialGoals.reduce((sum, goal) => {
      const progress = Math.min(
        Math.round((goal.currentAmount / goal.targetAmount) * 100),
        100
      );
      return sum + progress;
    }, 0) / Math.max(totalGoals, 1)
  );

  // 필터링된 목표 목록
  const filteredGoals = allFinancialGoals.filter((goal) => {
    const matchesSearch =
      goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.products.some((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "전체" || goal.status === statusFilter;
    const matchesPeriod =
      periodFilter === "전체" ||
      (periodFilter === "이번달" &&
        new Date(goal.createdDate).getMonth() === new Date().getMonth());

    return matchesSearch && matchesStatus && matchesPeriod;
  });

  // 정렬된 목표 목록
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    switch (sortBy) {
      case "최신순":
        return (
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      case "수익률순":
        return b.returnRate - a.returnRate;
      case "가입일순":
        return (
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      default:
        return 0;
    }
  });

  // 가입 진행중인 목표 (상단 고정) - 전체 데이터에서 계산
  const otherGoals = sortedGoals.filter((goal) => goal.status !== "가입진행중");

  // 페이지네이션 계산 - 가입진행중 목표도 포함
  const allGoalsForPagination = sortedGoals;
  const totalPages = Math.ceil(allGoalsForPagination.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGoals = allGoalsForPagination.slice(startIndex, endIndex);

  // 페이지 변경 시 첫 페이지로 이동
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 필터나 검색 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, periodFilter, sortBy]);

  // 새 목표 생성 처리 (투자성향 검사 필요 시)
  const handleCreateNewGoal = () => {
    if (investmentProfile?.isExpired) {
      // 새 탭에서 투자성향 검사 페이지 열기
      window.open("/plan1q/test", "_blank");
      return;
    }
    
    // store 데이터 초기화
    if (typeof window !== "undefined") {
      localStorage.removeItem("plan1q-store");
    }
    
    // 새 목표 생성 페이지로 이동
    router.push("/plan1q/create");
  };

  // 슬라이드 네비게이션 함수들
  const handleSlideLeft = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSlideRight = () => {
    // 총 카드 개수 계산 (고정 카드들 + 진행중 목표 카드 1장 고정)
    const fixedCards = 3; // NewGoalCard, InvestmentProfileCard, GoalProgressCard
    const totalCards = fixedCards + (inProgressGoals.length > 0 ? 1 : 0);

    if (currentSlide < totalCards - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  // 슬라이드 가능 여부 업데이트
  useEffect(() => {
    const fixedCards = 3;
    const totalCards = fixedCards + (inProgressGoals.length > 0 ? 1 : 0);

    setCanSlideLeft(currentSlide > 0);
    setCanSlideRight(currentSlide < totalCards - 1);
  }, [currentSlide, inProgressGoals.length]);

  // 필터 옵션 정의
  const statusOptions = [
    { value: "전체", label: "전체 상태" },
    { value: "진행중", label: "진행중" },
    { value: "가입진행중", label: "가입진행중" },
    { value: "완료", label: "완료" },
    { value: "취소", label: "취소" },
  ];

  const periodOptions = [
    { value: "전체", label: "전체 기간" },
    { value: "이번달", label: "이번달" },
    { value: "지난달", label: "지난달" },
    { value: "3개월", label: "3개월" },
    { value: "6개월", label: "6개월" },
  ];

  const sortOptions = [
    { value: "최신순", label: "날짜 최신순" },
    { value: "수익률순", label: "높은 수익률순" },
    { value: "가입일순", label: "가입일 최신순" },
  ];

  // 데이터 로딩 중 표시
  if (isProfileLoading || isGoalsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner
          variant="default"
          text="로딩중..."
        />
      </div>
    );
  }

  // 목표가 없을 때 표시
  if (goals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainLayout>
          <main className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
              <h1
                className="text-3xl text-gray-800 ml-1"
                style={{ fontFamily: "Hana2-Bold" }}
              >
                Plan1Q
              </h1>
            </div>

            <p className="text-gray-600 mb-6">
              AI가 추천하는 맞춤형 금융 포트폴리오로 신혼생활 목표를 달성하세요.
            </p>

            {/* 대시보드 카드들 */}
            <div className="mb-8">
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
                <div className="flex gap-4 mx-auto">
                  {/* 1. 새로운 Plan1Q 시작하기 카드 */}
                  <NewGoalCard onStartNewGoal={handleCreateNewGoal} />
                  
                  {/* 2. 투자 성향 카드 */}
                  <InvestmentProfileCard
                    profile={investmentProfile ? {
                      type: investmentProfile.typeName,
                      description: `${investmentProfile.typeName} 투자 성향`,
                      isExpired: investmentProfile.isExpired,
                      expiredDate: investmentProfile.expiredAt
                    } : null}
                    onExpiredClick={() => window.open("/plan1q/test", "_blank")}
                  />
                </div>
              </div>
            </div>

            {/* 첫 번째 목표 생성 안내 */}
            
          </main>
        </MainLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <MainLayout>
        <main className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1
              className="text-3xl text-gray-800 ml-1"
              style={{ fontFamily: "Hana2-Bold" }}
            >
              Plan1Q
            </h1>
          </div>

          <p className="text-gray-600 mb-6">
            AI가 추천하는 맞춤형 금융 포트폴리오로 신혼생활 목표를 달성하세요.
          </p>

          {/* 사용자 맞춤형 알림 대시보드 */}
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
                  {/* 1. 새로운 Plan1Q 시작하기 카드 */}
                  <NewGoalCard />
                  {/* 2. 투자 성향 카드 */}
                  <InvestmentProfileCard
                    profile={investmentProfile ? {
                      type: investmentProfile.typeName,
                      description: `${investmentProfile.typeName} 투자 성향`,
                      isExpired: investmentProfile.isExpired,
                      expiredDate: investmentProfile.expiredAt
                    } : null}
                    onExpiredClick={() => window.open("/plan1q/test", "_blank")}
                  />

                  {/* 3. 미완료 가입건 카드들 */}
                  <InProgressGoalsCard inProgressGoals={inProgressGoals} />

                  {/* 4. 목표 달성 현황 카드 */}
                  <GoalProgressCard
                    totalGoals={totalGoals}
                    completedGoals={completedGoals}
                    inProgressGoals={inProgressGoalsCount}
                    overallProgress={overallProgress}
                    onClick={() => {
                      // 목표 현황 보기 로직
                      console.log("목표 현황 보기");
                    }}
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

          {/* 필터와 검색 영역 */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="목표명 또는 상품명으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <FilterSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={statusOptions}
              placeholder="상태"
              className="w-40"
            />
            <FilterSelect
              value={periodFilter}
              onValueChange={setPeriodFilter}
              options={periodOptions}
              placeholder="기간"
              className="w-32"
            />
            <FilterSelect
              value={sortBy}
              onValueChange={setSortBy}
              options={sortOptions}
              placeholder="정렬"
              className="w-40"
            />
          </div>

          {/* 가입한 plan1q 목표 목록 */}
          <GoalCardList
            goals={paginatedGoals}
            onGoalClick={(goalId) => router.push(`/plan1q/${goalId}`)}
            variant="default"
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </MainLayout>
    </div>
  );
}
