"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ChevronRight,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { HanaIcon } from "@/components/ui/HanaIcon";
import { showSuccessMessage } from "@/components/ui/CustomAlert";
import { useRouter } from "next/navigation";
import { colors } from "@/constants/colors";
import { usePlan1QStore } from "@/lib/store/plan1qStore";
import { usePlan1QStore as usePlan1QFeatureStore } from "@/features/plan1q/store/plan1qStore";
import { useAuth } from "@/lib/hooks/useAuth";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { plan1qApi } from "../api/plan1qApi";
import { Plan1QGoalCreateRequest } from "../types";
import { showErrorToast } from "@/components/ui/toast";

interface Plan1QConfirmationProps {
  data: any;
  onSubmit: () => void;
  onBack: () => void;
}

// 상품 타입별 아이콘 매핑
const getProductTypeIcon = (productType: string) => {
  const lowerType = productType?.toLowerCase();
  switch (lowerType) {
    case "savings":
      return "savings";
    case "deposit":
      return "deposit";
    case "bond":
      return "bond";
    case "etf":
      return "etf";
    case "fund":
      return "fund";
    default:
      return "investment";
  }
};

// 상품 타입별 색상 매핑 (도넛 차트용)
const getProductTypeColor = (productType: string) => {
  const lowerType = productType?.toLowerCase();
  switch (lowerType) {
    case "savings":
      return colors.hana.blue.main;
    case "deposit":
      return colors.hana.green.main;
    case "bond":
      return colors.hana.purple.main;
    case "etf":
      return colors.hana.yellow.main;
    case "fund":
      return colors.hana.red.main;
    default:
      return colors.gray.main;
  }
};

// 상품 타입별 한글 이름
const getProductTypeName = (productType: string) => {
  const lowerType = productType?.toLowerCase();
  switch (lowerType) {
    case "savings":
      return "적금";
    case "deposit":
      return "예금";
    case "bond":
      return "채권";
    case "etf":
      return "ETF";
    case "fund":
      return "펀드";
    default:
      return "기타";
  }
};

export function Plan1QConfirmation({
  data,
  onSubmit,
  onBack,
}: Plan1QConfirmationProps) {
  const router = useRouter();
  const { 
    recommendationResponse, 
    apiResponse, 
    mappedResponse, 
    isLoading,
    setLoading, 
    setApiResponse, 
    setError
  } = usePlan1QStore();
  const { investmentProfile, fetchInvestmentProfile } = usePlan1QFeatureStore();
  const { user } = useAuth();
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 추천 결과가 있으면 사용, 없으면 로딩 상태 표시
  const recommendationData = recommendationResponse;

  // 추천 데이터 로그 (페이지에서 사용되는 형태)
  useEffect(() => {
    if (recommendationData) {
      console.log("🔄 Plan1Q 추천 데이터 (페이지 사용 형태):", {
        totalExpectedReturn: recommendationData.totalExpectedReturn,
        achievementProbability: recommendationData.achievementProbability,
        riskAssessment: recommendationData.riskAssessment,
        productsCount: recommendationData.recommendedProducts?.length || 0
      });
    }
  }, [recommendationData]);

  // 투자성향 정보가 없으면 가져오기
  useEffect(() => {
    if (!investmentProfile) {
      fetchInvestmentProfile();
    }
  }, [investmentProfile, fetchInvestmentProfile]);

  // 추천 결과가 없으면 로딩 상태 표시
  if (!recommendationData) {
    return (
      <div className="w-full space-y-4">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl text-gray-900" style={{ fontFamily: "Hana2-CM" }}>
            포트폴리오 정보를 불러오는 중...
          </h1>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008485]"></div>
        </div>
      </div>
    );
  }

  const handlePlan1QCreate = async () => {
    try {
      setIsRedirecting(true); // 버튼 클릭 즉시 로딩 화면 표시
      setError(null);

      if (!recommendationResponse) {
        throw new Error("추천 결과가 없습니다. 다시 추천을 받아주세요.");
      }

      const request: Plan1QGoalCreateRequest = {
        goalTitle: data.goalTitle || "",
        detailedGoal: data.detailedGoal || data.goalTitle || "",
        targetAmount: data.targetAmount || 0,
        targetPeriod: data.targetPeriod || 0,
        monthlyAmount: recommendationResponse.monthlyAmount, // 월 납입금 포함
        icon: data.selectedPlan1Q?.iconName || "house_deposit", // 아이콘 포함
        // 추천 결과 포함
        recommendedProducts: recommendationResponse.recommendedProducts,
        totalExpectedReturn: recommendationResponse.totalExpectedReturn,
        achievementProbability: recommendationResponse.achievementProbability, // 목표 달성 가능성 포함
        totalRiskScore: recommendationResponse.totalRiskScore,
        riskAssessment: recommendationResponse.riskAssessment,
        aiExplanation: recommendationResponse.aiExplanation,
      };

      console.log("🚀 Plan1Q 목표 생성 요청:", request);

      const response = await plan1qApi.createGoal(request);
      
      console.log("✅ Plan1Q 목표 생성 응답:", response);

      if (response.success && response.data) {
        setApiResponse(response.data);
        // 토스트 알림 제거 - 상세 페이지에서 표시할 예정
        // 바로 상세 페이지로 이동
        const createdGoalId = response.data.goalId;
        if (createdGoalId) {
          // 바로 상세 페이지로 이동 (토스트는 상세 페이지에서 표시)
          router.push(`/plan1q/${createdGoalId}?created=true`);
        } else {
          // goalId가 없으면 기존 로직 실행
          setIsRedirecting(false); // 로딩 해제
          onSubmit();
        }
      } else {
        throw new Error(response.message || "Plan1Q 목표 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ Plan1Q 목표 생성 에러:", error);
      const errorMessage = error instanceof Error ? error.message : "Plan1Q 목표 생성에 실패했습니다.";
      setError(errorMessage);
      setIsRedirecting(false); // 에러 시 로딩 해제
      showErrorToast(errorMessage);
    }
  };

  const toggleProductExpansion = (productId: number) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  // 추천 상품들을 타입별로 그룹핑
  const products = recommendationData.recommendedProducts || [];
  const productsByType = products.reduce((acc: Record<string, any[]>, product: any) => {
    if (!acc[product.productType]) {
      acc[product.productType] = [];
    }
    acc[product.productType].push(product);
    return acc;
  }, {} as Record<string, any[]>);

  // 도넛 차트용 데이터 생성
  const chartData = Object.entries(productsByType).map(([productType, products]) => {
    const totalRatio = (products as any[]).reduce((sum: number, product: any) => 
      sum + (product.investmentRatio || 0), 0
    );
    return {
      name: getProductTypeName(productType),
      value: totalRatio,
      color: getProductTypeColor(productType),
      type: productType
    };
  }).filter(item => item.value > 0);

  // 도넛 차트 커스텀 툴팁
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0]?.payload;
      if (!data) return null;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // 도넛 차트 커스텀 범례
  const CustomLegend = ({ payload }: any) => {
    if (!payload || payload.length === 0) return null;
    
    // 전체 합계 계산
    const total = payload.reduce((sum: number, entry: any) => sum + entry.payload.value, 0);
    
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.payload.value / total) * 100).toFixed(1);
          return (
            <div key={`legend-${index}`} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">
                {entry.value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* 전체 화면 로딩 오버레이 */}
      {isRedirecting && (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-[9999]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008485] mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: "Hana2-CM" }}>
              Plan1Q를 생성중입니다
            </p>
          </div>
        </div>
      )}
      
      <div className="w-full space-y-4 relative">

      {/* 헤드라인 */}
      <div className="text-center space-y-2 mb-6">
        <h1
          className="text-2xl text-gray-900"
          style={{ fontFamily: "Hana2-CM" }}
        >
          생성된 Plan1Q를 확인해 보세요
        </h1>
      </div>

      {/* 투자성향 배너 */}
      <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ border: `2px solid ${colors.point.main}` }}>
            <span className="text-xs font-bold" style={{ color: colors.point.main }}>i</span>
          </div>
          <span className="text-sm font-medium">
            {user?.customerName || "사용자"}님의 투자성향({investmentProfile?.typeName || "확인 중"})을 고려하였습니다
          </span>
        </div>
      </div>

      {/* 목표 요약 카드 */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                {/* 선택한 아이콘 표시 */}
                <HanaIcon 
                  name={data.selectedPlan1Q?.iconName as any || "investment"} 
                  size={32} 
                />
                <h2 className="text-lg text-gray-900" style={{ fontFamily: "Hana2-CM" }}>
                  {data.goalTitle}
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">목표금액</span>
                  <span className="text-lg font-bold" style={{ color: colors.primary.main }}>
                    {(data.targetAmount || 0).toLocaleString()}원
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">가입기간</span>
                  <span className="text-lg font-bold" style={{ color: colors.primary.main }}>
                    {data.targetPeriod}개월
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">월 납입금</span>
                  <span className="text-lg font-bold" style={{ color: colors.primary.main }}>
                    {recommendationData.monthlyAmount ? (recommendationData.monthlyAmount || 0).toLocaleString() : Math.round((data.targetAmount || 0) / (data.targetPeriod || 1)).toLocaleString()}원
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">기대수익률</span>
                  <span className="text-sm font-medium">
                    {recommendationData.totalExpectedReturn && recommendationData.totalExpectedReturn > 0 
                      ? `${recommendationData.totalExpectedReturn.toFixed(2)}%` 
                      : "계산 중"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">달성가능성</span>
                  <span className="text-sm font-medium">
                    {recommendationData.achievementProbability && recommendationData.achievementProbability > 0 
                      ? `${recommendationData.achievementProbability}%` 
                      : "계산 중"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">위험도</span>
                  <span className="text-sm font-medium">
                    {recommendationData.riskAssessment || "확인 중"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 포트폴리오 섹션 */}
      <div className="space-y-4">
        <h2 className="text-2xl text-gray-900" style={{ fontFamily: "Hana2-CM" }}>
          추천 포트폴리오
        </h2>

        {/* 포트폴리오 분포 차트 */}
      {chartData.length > 0 && (
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg text-gray-900 mb-4" style={{ fontFamily: "Hana2-CM" }}>
              상품 종류별 분포
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={chartData.length > 1 ? 2 : 0}
                  startAngle={90}
                  endAngle={chartData.length > 1 ? -270 : 450}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

        {Object.entries(productsByType).map(([productType, products]) => {
          const typeColor = getProductTypeColor(productType);
          const typeName = getProductTypeName(productType);
          const totalRatio = (products as any[]).reduce((sum: number, product: any) => 
            sum + (product.investmentRatio || 0), 0
          );
          
          return (
            <div key={productType} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl" style={{ fontFamily: "Hana2-CM"}}>
                  {typeName}
                </span>
                <span className="text-2xl " style={{ fontFamily: "Hana2-CM", color: typeColor }}>
                  {totalRatio.toFixed(1)}%
                </span>
              </div>
            
            {(products as any[]).map((product: any, index: number) => (
              <Card key={product.productId} className="border border-gray-200 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  {/* 상품명 및 아이콘 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <HanaIcon 
                        name={getProductTypeIcon(product.productType) as any} 
                        size={24} 
                      />
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">
                          {product.productName}
                        </p>
                        {/* 추천이유 툴팁 - 원형 물음표 아이콘 */}
                        {product.recommendationReason && (
                          <div className="relative group">
                            <div 
                              className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center cursor-help hover:bg-gray-300 transition-colors duration-200"
                            >
                              <span className="text-gray-600 text-xs font-medium">?</span>
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-800 text-white text-sm rounded-lg transition-opacity duration-200 z-10 max-w-xs shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none"
                            style={{
                              maxWidth: '280px',
                              wordBreak: 'keep-all',
                              lineHeight: '1.4',
                              left: '50%',
                              minWidth: '200px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(4px)',
                              zIndex: 50,
                              pointerEvents: 'none',
                              userSelect: 'none',
                              whiteSpace: 'pre-wrap',
                              overflowWrap: 'break-word',
                              hyphens: 'auto',
                              textAlign: 'left',
                              fontFamily: 'Hana2-CM, sans-serif',
                              animation: 'fadeIn 0.2s ease-in-out',
                              willChange: 'opacity',
                              transformOrigin: 'bottom center',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              marginBottom: '8px',
                              top: 'auto',
                              bottom: '100%',
                              position: 'absolute',
                              transform: 'translateX(-50%) translateY(-8px)'
                            }}>
                              <div className="font-medium mb-1 text-gray-100">추천 이유</div>
                              <div className="text-gray-200 leading-relaxed whitespace-normal text-xs sm:text-sm">
                                {product.recommendationReason}
                              </div>
                              {/* 말풍선 화살표 */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 투자 정보 - 한 줄에 표시 */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">투자비율</span>
                      <p className="font-medium text-gray-900">
                        {product.investmentRatio.toFixed(1)}%
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">투자금액</span>
                      <p className="font-medium text-gray-900">
                        {(product.investmentAmount || 0).toLocaleString()}원
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">월 납입금</span>
                      <p className="font-medium text-gray-900">
                        {(product.monthlyAmount || 0).toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )})}
      </div>

      

      {/* 유의사항 섹션 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
          <span className="text-sm font-medium">유의사항</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
          <p className="text-xs text-gray-600">
            준법감시인 심의필 제2025-광고-0243호(2025.03.25~2026.02.28)
          </p>
          <p className="text-xs text-gray-600">
            ※본 홍보물은 2026년 02월 28일까지 유효합니다.
          </p>
        </div>
      </div>

      {/* 버튼들 */}
      <div className="pt-4 space-y-3">
        <Button
          onClick={handlePlan1QCreate}
          className="w-full py-3 text-white font-medium"
          style={{ backgroundColor: colors.primary.main }}
        >
          Plan1Q 생성하기
        </Button>
      </div>
    </div>
    </>
  );
}
