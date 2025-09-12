"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { colors } from "@/constants/colors";
import {
  Plus,
  Search,
  Heart,
  Home,
  Car,
  ShoppingBag,
  Coffee,
  MoreHorizontal,
  TrendingUp,
  CalendarIcon,
  User,
  Target,
  Users,
  Gift,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Gamepad2,
  Briefcase,
  Stethoscope,
  CreditCard,
  Camera,
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sidebar } from "@/components/layout/Sidebar";
import { Pagination } from "@/components/layout/Pagination";
import { TransactionList } from "@/features/finance/components/TransactionList";
import { GroupedTransactionList } from "@/features/finance/components/GroupedTransactionList";
import { DateRange } from "react-day-picker";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { MainBudgetCard } from "@/features/finance/components/MainBudgetCard";
import { BudgetCategoryCard } from "@/features/finance/components/BudgetCategoryCard";
import MainLayout from "@/components/layout/MainLayout";
import { AddButton } from "@/components/ui/AddButton";
import { toast } from "sonner";
import { useFinanceData } from "@/features/finance/hooks/useFinanceData";
import { useFinanceStore } from "@/features/finance/store";
import { X } from "lucide-react";
import { formatCurrency, parseBigDecimal } from "@/features/finance/utils/currencyUtils";
import { FinanceDashboard } from "@/features/finance";
import { FinanceCategoryIcon } from "@/components/ui/FinanceCategoryIcon";
import { coupleApi } from "@/lib/api/coupleApi";
import { showConfirmDialog } from "@/components/ui/CustomAlert";
import { useAuth } from "@/lib/hooks/useAuth";

// 카테고리 아이콘 매핑 제거 (새로운 시스템 사용)
// const categoryIconMap: Record<string, any> = { ... };
// const categoryColorMap: Record<string, string> = { ... };

export default function CoupleFinancePage() {
  const { isAuthenticated } = useAuth();
  
  // API 데이터 훅 사용 - 인증 상태 전달
  const {
    transactions,
    budgetOverview,
    categories,
    reviewPendingTransactions,
    isReviewMode,
    loading,
    error,
    pagination,
    filters,
    fetchTransactions,
    fetchBudgetOverview,
    fetchReviewPendingTransactions,
    updateTransactionReviewStatus,
    deleteTransaction,
    setIsReviewMode,
  } = useFinanceData(isAuthenticated);

  const { setFilters } = useFinanceStore();

  const [selectedPeriod, setSelectedPeriod] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [userFilter, setUserFilter] = useState("전체");
  const [typeFilter, setTypeFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [coupleMembers, setCoupleMembers] = useState<string[]>([]);
  const [isReviewCompleting, setIsReviewCompleting] = useState(false);

  // 예산 데이터
  const totalBudget = budgetOverview ? parseBigDecimal(budgetOverview.totalBudget) : 0;
  const totalSpent = budgetOverview ? parseBigDecimal(budgetOverview.totalSpent) : 0;
  const remaining = totalBudget - totalSpent;

  // 리뷰 대기 거래내역 수
  const unreviewedCount = reviewPendingTransactions.length;

  // 필터가 적용되었는지 확인
  const isFilterApplied = searchTerm || categoryFilter !== "전체" || userFilter !== "전체" || typeFilter !== "전체" || selectedPeriod !== "전체" || dateRange;

  // 필터 초기화 함수
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("전체");
    setUserFilter("전체");
    setTypeFilter("전체");
    setSelectedPeriod("전체");
    setDateRange(undefined);
  };

  const periodOptions = [
    { value: "전체", label: "전체 기간" },
    { value: "이번 달", label: "이번 달" },
    { value: "지난 달", label: "지난 달" },
    { value: "3개월 전", label: "3개월 전" },
    { value: "6개월 전", label: "6개월 전" },
    { value: "직접 입력", label: "직접 입력" },
  ];

  // 카테고리 옵션 (API 데이터 기반)
  const categoryOptions = [
    { value: "전체", label: "전체 카테고리" },
    ...categories.map((category: any) => ({
      value: category.name,
      label: category.name
    }))
  ];

  // 사용자 옵션 (커플 멤버 기반)
  const userOptions = [
    { value: "전체", label: "전체 사용자" },
    ...coupleMembers.map((memberName: string) => ({
      value: memberName,
      label: memberName
    }))
  ];

  const typeOptions = [
    { value: "전체", label: "수입/지출" },
    { value: "expense", label: "지출" },
    { value: "income", label: "수입" },
  ];

  // 필터 적용 함수
  const applyFilters = useCallback(() => {
    const filterParams: any = {
      page: currentPage - 1, // API는 0부터 시작
      size: 10,
    };

    if (searchTerm) filterParams.searchTerm = searchTerm;
    if (categoryFilter !== "전체") {
      const category = categories.find((c: any) => c.name === categoryFilter);
      if (category) filterParams.categoryId = category.financeCategoryId;
    }
    if (userFilter !== "전체") filterParams.userSeqNo = userFilter;
    if (typeFilter !== "전체") {
      filterParams.transactionType = typeFilter === "expense" ? "EXPENSE" : "INCOME";
    }

    // 날짜 필터링
    if (selectedPeriod === "이번 달") {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      filterParams.startDate = startOfMonth.toISOString().split('T')[0];
      filterParams.endDate = endOfMonth.toISOString().split('T')[0];
    } else if (selectedPeriod === "지난 달") {
      const today = new Date();
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      filterParams.startDate = startOfLastMonth.toISOString().split('T')[0];
      filterParams.endDate = endOfLastMonth.toISOString().split('T')[0];
    } else if (selectedPeriod === "3개월 전") {
      const today = new Date();
      const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
      filterParams.startDate = threeMonthsAgo.toISOString().split('T')[0];
    } else if (selectedPeriod === "6개월 전") {
      const today = new Date();
      const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
      filterParams.startDate = sixMonthsAgo.toISOString().split('T')[0];
    } else if (selectedPeriod === "직접 입력" && dateRange?.from) {
      filterParams.startDate = dateRange.from.toISOString().split('T')[0];
      if (dateRange.to) {
        filterParams.endDate = dateRange.to.toISOString().split('T')[0];
      }
    }

    fetchTransactions(filterParams);
  }, [searchTerm, categoryFilter, userFilter, typeFilter, selectedPeriod, dateRange, currentPage, categories, fetchTransactions]);

  // 필터 변경 시 API 호출
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // 커플 멤버 목록 불러오기
  const loadCoupleMembers = useCallback(async () => {
    try {
      const response = await coupleApi.getCurrentCoupleInfo(true) // silent = true;
      if (response.success && response.data) {
        setCoupleMembers(response.data.memberNames || []);
      }
    } catch (error) {
      console.error("커플 정보 조회 실패:", error);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    loadCoupleMembers();
  }, [loadCoupleMembers]);

  // 리뷰 대기 거래내역이 0개가 되면 자동으로 일반 모드로 전환
  useEffect(() => {
    if (isReviewMode && reviewPendingTransactions.length === 0) {
      setIsReviewMode(false);
      applyFilters();
    }
  }, [reviewPendingTransactions.length, isReviewMode, setIsReviewMode, applyFilters]);

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      setSelectedPeriod("직접 입력");
    }
  };

  const handleEditTransaction = (transactionId: number) => {
    window.location.href = `/finance/edit/${transactionId}`;
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    const response = await deleteTransaction(transactionId);
    
    if (response.success) {
      toast.success('거래 내역이 삭제되었습니다.', {
        style: {
          background: colors.primary.toastBg,
          color: colors.primary.main,
          border: `1px solid ${colors.primary.main}`,
          fontFamily: "Hana2-Medium",
        },
      });
    } else {
      toast.error(response.message || '거래 내역 삭제에 실패했습니다.');
    }
  };

  // 대시보드 이벤트 핸들러
  const handleBudgetClick = () => {
    // 예산 설정 페이지로 이동
    window.location.href = "/budget-settings";
  };

  const handleUnreviewedClick = () => {
    // 리뷰 모드 토글
    const newReviewMode = !isReviewMode;
    setIsReviewMode(newReviewMode);
    
    if (newReviewMode) {
      // 리뷰 모드로 전환 시 리뷰 대기 거래내역 조회
      fetchReviewPendingTransactions();
    } else {
      // 일반 모드로 전환 시 기존 거래내역 조회
      applyFilters();
    }
  };

  const handleWeddingDateClick = () => {
    // 예산 설정 페이지로 이동
    window.location.href = "/budget-settings";
  };

  // 가계부 등록하기 핸들러
  const handleRegisterToFinance = (transactionId: number) => {
    // 해당 리뷰 대기 거래내역 찾기
    const reviewTransaction = reviewPendingTransactions.find((t: any) => t.transactionId === transactionId);
    
    if (reviewTransaction) {
      // 모든 리뷰 데이터를 URL 파라미터로 전달
      const params = new URLSearchParams({
        reviewId: transactionId.toString(),
        amount: reviewTransaction.amount.toString(),
        description: reviewTransaction.description,
        type: reviewTransaction.type === 'INCOME' ? 'deposit' : 'withdraw',
        date: reviewTransaction.transactionDate,
        time: reviewTransaction.transactionTime,
        memo: reviewTransaction.memo || '',
        fromName: reviewTransaction.userName,
        toName: reviewTransaction.userName
      });
      
      window.location.href = `/finance/create?${params.toString()}`;
    } else {
      toast.error('리뷰 대기 거래내역을 찾을 수 없습니다.');
    }
  };

  // 가계부 등록 완료 후 리뷰 상태 변경 핸들러
  const handleFinanceRegistrationComplete = async (reviewId: number, categoryId?: number, memo?: string) => {
    try {
      const response = await updateTransactionReviewStatus(reviewId, {
        reviewStatus: 'reviewed',
        categoryId,
        memo
      });
      
      if (response.success) {
        // 리뷰 모드에서 일반 모드로 전환
        setIsReviewMode(false);
        applyFilters();
        
        toast.success('가계부 등록이 완료되었습니다.', {
          style: {
            background: colors.primary.toastBg,
            color: colors.primary.main,
            border: `1px solid ${colors.primary.main}`,
            fontFamily: "Hana2-Medium",
          },
        });
      } else {
        toast.error(response.message || '가계부 등록 완료 처리에 실패했습니다.');
      }
    } catch (error) {
      toast.error('가계부 등록 완료 처리에 실패했습니다.');
    }
  };

  // 즉시 리뷰 완료 핸들러
  const handleImmediateReviewComplete = async (transactionId: number) => {
    // 중복 클릭 방지
    if (isReviewCompleting) {
      return;
    }
    
    // 프로젝트의 CustomAlert 사용
    const result = await showConfirmDialog({
      title: "리뷰 완료",
      text: "이 거래내역을 리뷰 완료하시겠습니까?",
      confirmButtonText: "완료",
      cancelButtonText: "취소",
      showCancelButton: true
    });
    
    if (!result.isConfirmed) {
      return;
    }
    
    try {
      setIsReviewCompleting(true);
      const response = await updateTransactionReviewStatus(transactionId, {
        reviewStatus: 'reviewed'
      });
      
      if (response.success) {
        toast.success('리뷰가 완료되었습니다.', {
          style: {
            background: colors.primary.toastBg,
            color: colors.primary.main,
            border: `1px solid ${colors.primary.main}`,
            fontFamily: "Hana2-Medium",
          },
        });
      } else {
        toast.error(response.message || '리뷰 완료에 실패했습니다.');
      }
    } catch (error) {
      toast.error('리뷰 완료에 실패했습니다.');
    } finally {
      setIsReviewCompleting(false);
    }
  };

  return (
    <MainLayout>
      {/* Main Content */}
      <div>
        {/* Budget Overview */}
        <main className="container mx-auto p-4">
          <h1 className="text-3xl mb-6" style={{ fontFamily: "Hana2-CM" }}>
            예산관리
          </h1>

          {/* Finance Dashboard */}
          <FinanceDashboard
            totalBudget={totalBudget}
            totalSpent={totalSpent}
            categoryBudgets={budgetOverview?.categoryBudgets || []}
            unreviewedCount={unreviewedCount}
            isReviewMode={isReviewMode}
            onBudgetClick={handleBudgetClick}
            onUnreviewedClick={handleUnreviewedClick}
            onWeddingDateClick={handleWeddingDateClick}
          />
        </main>

        {/* Transaction History */}
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl" style={{ fontFamily: "Hana2-CM" }}>
              내역
            </h1>
            {!isReviewMode && <AddButton href="/finance/create" label="내역 추가" />}
          </div>

          {/* Filters */}
          {!isReviewMode && (
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="거래 내역, 메모 검색"
                />
                <FilterSelect
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                  options={periodOptions}
                />
                <FilterSelect
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                  options={categoryOptions}
                  placeholder="카테고리"
                />
                <FilterSelect
                  value={userFilter}
                  onValueChange={setUserFilter}
                  options={userOptions}
                  placeholder="지출자"
                />
                <FilterSelect
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                  options={typeOptions}
                  placeholder="유형"
                />
              </div>

              {/* 필터링 결과 표시 및 초기화 버튼 */}
              <div className="flex items-center justify-end text-sm text-gray-600 px-2">
                <span>
                  총 {transactions.length}건 중 {transactions.length}건 표시
                  {isFilterApplied && (
                    <span className="ml-2 text-blue-600">
                      (필터 적용됨)
                    </span>
                  )}
                </span>
                {isFilterApplied && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-800 ml-4"
                  >
                    <X className="w-3 h-3" />
                    필터 초기화
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Date Range Picker */}
          {!isReviewMode && selectedPeriod === "직접 입력" && (
            <div className="mb-6">
              <Popover
                open={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "yyyy-MM-dd", { locale: ko })}{" "}
                          - {format(dateRange.to, "yyyy-MM-dd", { locale: ko })}
                        </>
                      ) : (
                        format(dateRange.from, "yyyy-MM-dd", { locale: ko })
                      )
                    ) : (
                      "날짜를 선택하세요"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      handleDateRangeSelect(range);
                      if (range?.from && range?.to) {
                        setIsDatePickerOpen(false);
                      }
                    }}
                    numberOfMonths={2}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Transaction List */}
          <GroupedTransactionList
            transactions={isReviewMode ? reviewPendingTransactions : transactions}
            isReviewMode={isReviewMode}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            onRegisterToFinance={handleRegisterToFinance}
            onImmediateReviewComplete={handleImmediateReviewComplete}
            loading={loading}
            isReviewCompleting={isReviewCompleting}
          />

          {/* Pagination */}
          {!isReviewMode && (
            <Pagination
              currentPage={pagination.currentPage + 1} // API는 0부터 시작하므로 +1
              totalPages={pagination.totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
