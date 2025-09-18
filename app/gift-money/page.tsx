"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Plus, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { Pagination } from "@/components/layout/Pagination";
import { 
  GiftMoneyDashboard, 
  GiftMoneyList, 
  GiftMoneyStatistics,
  SafeAccountTransactionList
} from "@/features/giftMoney/components";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  useGiftMoneyList,
  useSummaryStatistics,
  useFullStatistics,
  usePagination,
  useIsLoading,
  useIsStatisticsLoading,
  useError,
  useFetchGiftMoneyList,
  useFetchSummaryStatistics,
  useFetchFullStatistics,
  useUpdateThanksStatus,
  useDeleteGiftMoney,
  useFilteredGiftMoneyList,
  useRealtimeThanksStats
} from "@/features/giftMoney/store/selectors";
import { relationshipMapping } from "@/features/giftMoney/types";
import { giftMoneyApi, SafeAccountTransactionResponse } from "@/features/giftMoney/api/giftMoneyApi";
import { toast } from "sonner";
import { colors } from "@/constants/colors";

export default function GiftMoneyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  
  // 안심계좌 관련 상태
  const [isSafeAccountReviewMode, setIsSafeAccountReviewMode] = useState(false);
  const [safeAccountTransactions, setSafeAccountTransactions] = useState<SafeAccountTransactionResponse[]>([]);
  const [isSafeAccountLoading, setIsSafeAccountLoading] = useState(false);
  
  // Store에서 상태 가져오기
  const giftMoneyList = useGiftMoneyList();
  const summaryStatistics = useSummaryStatistics();
  const fullStatistics = useFullStatistics();
  const pagination = usePagination();
  const isLoading = useIsLoading();
  const isStatisticsLoading = useIsStatisticsLoading();
  const error = useError();
  
  // Store에서 액션 가져오기
  const fetchGiftMoneyList = useFetchGiftMoneyList();
  const fetchSummaryStatistics = useFetchSummaryStatistics();
  const fetchFullStatistics = useFetchFullStatistics();
  const updateThanksStatus = useUpdateThanksStatus();
  const deleteGiftMoney = useDeleteGiftMoney();
  
  // 필터링 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRelationship, setFilterRelationship] = useState("전체");
  const [filterThanksStatus, setFilterThanksStatus] = useState<"전체" | "완료" | "미완료">("전체");
  const [currentPage, setCurrentPage] = useState(0); // 백엔드는 0부터 시작
  const itemsPerPage = 10;

  // 필터 적용 여부 및 초기화
  const isFilterApplied = (
    searchTerm.trim().length > 0 ||
    filterRelationship !== "전체" ||
    filterThanksStatus !== "전체"
  );

  const resetFilters = () => {
    setSearchTerm("");
    setFilterRelationship("전체");
    setFilterThanksStatus("전체");
    setCurrentPage(0);
  };

  // 필터링된 축의금 목록
  const filteredGiftMoneyList = useFilteredGiftMoneyList(
    searchTerm,
    filterRelationship,
    filterThanksStatus
  );

  // 축의금 목록 조회
  const handleFetchGiftMoneyList = async () => {
    const params: any = {
      page: currentPage,
      size: itemsPerPage
    };
    
    // 검색어 필터
    if (searchTerm.trim()) {
      params.name = searchTerm.trim();
    }
    
    // 관계 필터
    if (filterRelationship !== "전체") {
      params.relationship = relationshipMapping[filterRelationship as keyof typeof relationshipMapping];
    }
    
    // 감사 상태 필터
    if (filterThanksStatus !== "전체") {
      params.thanksSent = filterThanksStatus === "완료";
    }
    
    await fetchGiftMoneyList(params);
  };

  // 안심계좌 거래내역 조회
  const fetchSafeAccountTransactions = async () => {
    try {
      setIsSafeAccountLoading(true);
      console.log('🔍 안심계좌 거래내역 조회 시작');
      const response = await giftMoneyApi.getSafeAccountTransactions({ page: 0, size: 100 });
      console.log('🔍 안심계좌 거래내역 API 응답:', response);
      
      if (response.success && response.data) {
        console.log('🔍 안심계좌 거래내역 데이터:', response.data);
        console.log('🔍 안심계좌 거래내역 개수:', response.data.content.length);
        setSafeAccountTransactions(response.data.content);
        console.log('🔍 안심계좌 거래내역 상태 업데이트 완료');
      } else {
        console.log('🔍 안심계좌 거래내역 API 실패:', response);
      }
    } catch (error) {
      console.error('🔍 안심계좌 거래내역 조회 실패:', error);
      toast.error('안심계좌 거래내역 조회에 실패했습니다.');
    } finally {
      setIsSafeAccountLoading(false);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    handleFetchGiftMoneyList();
    fetchSummaryStatistics();
    fetchSafeAccountTransactions(); // 안심계좌 거래내역도 함께 조회
  }, []);

  // 페이지 포커스 시 통계 새로고침 (축의금 생성 후 돌아왔을 때)
  useEffect(() => {
    const handleFocus = () => {
      fetchSummaryStatistics();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // 필터링 변경 시 목록 재조회
  useEffect(() => {
    setCurrentPage(0); // 페이지 리셋
    handleFetchGiftMoneyList();
  }, [searchTerm, filterRelationship, filterThanksStatus]);

  // 페이지 변경 시 목록 재조회
  useEffect(() => {
    handleFetchGiftMoneyList();
  }, [currentPage]);

  // 통계 탭 클릭 시 전체 통계 로딩
  useEffect(() => {
    if (activeTab === "statistics" && !fullStatistics) {
      fetchFullStatistics();
    }
  }, [activeTab]);

  const handleAddNew = () => {
    router.push("/gift-money/create");
  };

  const handleToggleThanks = async (giftId: number, currentThanksSent: boolean) => {
    const thanksData = {
      thanksSent: !currentThanksSent,
      thanksDate: !currentThanksSent ? new Date().toISOString().split('T')[0] : undefined,
      thanksSentBy: !currentThanksSent ? "사용자" : undefined
    };
    
    // Store에서 자동으로 목록과 통계를 모두 업데이트하므로 새로고침 불필요
    await updateThanksStatus(giftId, thanksData);
  };

  const handleEdit = (giftId: number) => {
    router.push(`/gift-money/edit/${giftId}`);
  };

  const handleDelete = async (giftId: number) => {
    if (!confirm('정말로 이 축의금을 삭제하시겠습니까?')) {
      return;
    }
    
    const success = await deleteGiftMoney(giftId);
    
    if (success) {
      // 데이터 재조회 (목록과 통계 모두)
      handleFetchGiftMoneyList();
      await Promise.all([
        fetchSummaryStatistics(),
        fetchFullStatistics()
      ]);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // 프론트엔드는 1부터, 백엔드는 0부터
  };

  // 안심계좌 리뷰 모드 토글 핸들러
  const handleSafeAccountReviewClick = () => {
    const newReviewMode = !isSafeAccountReviewMode;
    setIsSafeAccountReviewMode(newReviewMode);
    
    if (newReviewMode) {
      // 리뷰 모드로 전환 시 안심계좌 거래내역 조회
      fetchSafeAccountTransactions();
    }
  };

  // 안심계좌 거래내역을 축의금으로 등록하기 핸들러
  const handleRegisterToGiftMoney = (transactionId: number) => {
    const transaction = safeAccountTransactions.find(t => t.transactionId === transactionId);
    
    if (transaction) {
      const params = new URLSearchParams({
        safeAccountTransactionId: transactionId.toString(),
        description: transaction.description,
        amount: transaction.amount.toString(),
        transactionDate: transaction.transactionDate
      });
      
      router.push(`/gift-money/create?${params.toString()}`);
    } else {
      toast.error('안심계좌 거래내역을 찾을 수 없습니다.');
    }
  };

  // 즉시 리뷰 완료 핸들러
  const handleImmediateReviewComplete = async (transactionId: number) => {
    try {
      const response = await giftMoneyApi.updateSafeAccountTransactionReviewStatus(
        transactionId, 
        { reviewStatus: 'REVIEWED' }
      );
      
      if (response.success) {
        toast.success('리뷰가 완료되었습니다.', {
          style: {
            background: colors.primary.toastBg,
            color: colors.primary.main,
            border: `1px solid ${colors.primary.main}`,
            fontFamily: "Hana2-Medium",
          },
        });
        
        // 안심계좌 거래내역 재조회
        fetchSafeAccountTransactions();
      } else {
        toast.error('리뷰 완료에 실패했습니다.');
      }
    } catch (error) {
      toast.error('리뷰 완료에 실패했습니다.');
    }
  };

  // Store 상태 디버깅
  console.log('🎁 GiftMoney Page Store 상태:', {
    summaryStatistics,
    fullStatistics,
    isLoading,
    isStatisticsLoading,
    error
  });

  // 실시간 감사인사 통계
  const realtimeThanksStats = useRealtimeThanksStats();
  
  // 대시보드용 데이터 변환 (실시간 통계 사용)
  const dashboardData = summaryStatistics ? {
    totalAmount: summaryStatistics.totalAmount,
    totalCount: summaryStatistics.totalCount,
    thanksSentCount: realtimeThanksStats.thanksSentCount,
    thanksNotSentCount: realtimeThanksStats.thanksNotSentCount,
    safeAccountPendingCount: safeAccountTransactions.filter(t => t.isSafeAccountDeposit === 'PENDING').length,
    isSafeAccountReviewMode: isSafeAccountReviewMode
  } : {
    totalAmount: 0,
    totalCount: 0,
    thanksSentCount: 0,
    thanksNotSentCount: 0,
    safeAccountPendingCount: 0,
    isSafeAccountReviewMode: false
  };

  console.log('📊 대시보드 데이터:', dashboardData);
  console.log('📊 안심계좌 거래내역 상태:', {
    safeAccountTransactions,
    pendingCount: safeAccountTransactions.filter(t => t.isSafeAccountDeposit === 'PENDING').length,
    isSafeAccountReviewMode
  });

  // 통계용 데이터 변환
  const statisticsData = fullStatistics ? {
    relationshipChartData: [
      { name: "가족", amount: fullStatistics.familyAmount, count: fullStatistics.familyCount },
      { name: "친척", amount: fullStatistics.relativeAmount, count: fullStatistics.relativeCount },
      { name: "친구", amount: fullStatistics.friendAmount, count: fullStatistics.friendCount },
      { name: "회사동료", amount: fullStatistics.colleagueAmount, count: fullStatistics.colleagueCount },
      { name: "지인", amount: fullStatistics.acquaintanceAmount, count: fullStatistics.acquaintanceCount },
      { name: "기타", amount: fullStatistics.otherAmount, count: fullStatistics.otherCount }
    ].filter(item => item.count > 0), // 인원수가 0보다 큰 항목만 필터링
    amountRangeChartData: [
      { range: "3만원 미만", count: fullStatistics.amountUnder30kCount },
      { range: "3만원 이상 5만원 미만", count: fullStatistics.amount30kTo50kCount },
      { range: "5만원 이상 10만원 미만", count: fullStatistics.amount50kTo100kCount },
      { range: "10만원 이상 20만원 미만", count: fullStatistics.amount100kTo200kCount },
      { range: "20만원 이상 50만원 이하", count: fullStatistics.amount200kTo500kCount },
      { range: "50만원 초과", count: fullStatistics.amountOver500kCount }
    ].filter(item => item.count > 0), // 개수가 0보다 큰 항목만 필터링
    topDonor: fullStatistics?.topDonorGiftMoneyId ? {
      id: fullStatistics.topDonorGiftMoneyId,
      name: fullStatistics.topDonorName || "알 수 없음",
      amount: fullStatistics.topDonorAmount || 0,
      relationship: "가족", // API에서 제공하지 않으므로 임시값
      date: fullStatistics.lastGiftDate || new Date().toISOString().split('T')[0]
    } : undefined
  } : {
    relationshipChartData: [],
    amountRangeChartData: [],
    topDonor: undefined
  };

  console.log('변환된 통계 데이터:', statisticsData);
  console.log('변환된 topDonor:', statisticsData.topDonor);

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Hana2-CM" }}>
            축의금 관리
          </h1>
          <div className="flex gap-3">
            {/* <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              엑셀 다운로드
            </Button> */}
          </div>
        </div>

        <p className="text-gray-600 mb-6">결혼식 축의금을 체계적으로 관리하고 감사 인사를 전해보세요.</p>

        {/* Gift Money Dashboard */}
        <GiftMoneyDashboard
          {...dashboardData}
          onAddNew={handleAddNew}
          onThanksClick={() => {
            setFilterThanksStatus("미완료");
            setActiveTab("overview");
          }}
          onStatisticsClick={() => {
            setActiveTab("statistics");
          }}
          onSafeAccountReviewClick={handleSafeAccountReviewClick}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">전체 내역</TabsTrigger>
            <TabsTrigger value="statistics">통계</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex gap-4">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="이름으로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterRelationship} onValueChange={setFilterRelationship}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["전체", "가족", "친척", "친구", "회사동료", "지인", "기타"].map((relationship) => (
                      <SelectItem key={relationship} value={relationship}>
                        {relationship}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterThanksStatus} onValueChange={(value) => setFilterThanksStatus(value as "전체" | "완료" | "미완료")}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["전체", "완료", "미완료"].map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Results Count (finance/page 스타일) */}
              <div className="flex items-center justify-end text-sm text-gray-600 px-2">
                <span>
                  총 {pagination.totalElements || 0}건
                  {isFilterApplied && (
                    <span className="ml-2 text-blue-600">(필터 적용됨)</span>
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

              {/* Gift Money List or Safe Account Transaction List */}
              {isSafeAccountReviewMode ? (
                <SafeAccountTransactionList
                  transactions={safeAccountTransactions.filter(t => t.isSafeAccountDeposit === 'PENDING')}
                  onRegisterToGiftMoney={handleRegisterToGiftMoney}
                  onImmediateReviewComplete={handleImmediateReviewComplete}
                  loading={isSafeAccountLoading}
                />
              ) : isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-500">로딩 중...</div>
                </div>
              ) : (
                <GiftMoneyList
                  gifts={giftMoneyList}
                  onToggleThanks={handleToggleThanks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}

              {/* Pagination */}
              {!isSafeAccountReviewMode && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage + 1}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            {isStatisticsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">통계 데이터 로딩 중...</div>
              </div>
            ) : (
              <GiftMoneyStatistics
                relationshipChartData={statisticsData.relationshipChartData}
                amountRangeChartData={statisticsData.amountRangeChartData}
                topDonor={statisticsData.topDonor}
                onTopDonorClick={() => {
                  if (statisticsData.topDonor?.id) {
                    router.push(`/gift-money/edit/${statisticsData.topDonor.id}`);
                  }
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
