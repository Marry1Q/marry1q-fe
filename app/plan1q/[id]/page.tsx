"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FormHeader } from "@/components/layout/FormHeader";
import { GoalCard } from "@/features/plan1q/components/GoalCard";
import {
  PortfolioTabs,
  PortfolioOverview,
  SubscriptionProgressAlert,
  TermsDialog,
  ContractDialog,
} from "@/features/plan1q/components/detail";
import { showWarningAlert, showSuccessAlert, showInfoAlert, showConfirmDialog } from "@/components/ui/CustomAlert";
import { usePlan1QStore } from "@/features/plan1q";
import { useAccountStore } from "@/features/account/store/accountStore";
import { toast } from "sonner";
import { colors } from "@/constants/colors";

export default function Plan1QDetailPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = Number(params.id);

  // Store 사용
  const { 
    currentGoal, 
    productPaymentInfo,
    isGoalDetailLoading, 
    isPaymentInfoLoading,
    error, 
    fetchGoalDetail,
    fetchProductPaymentInfo,
    fetchAllProductsPaymentInfo
  } = usePlan1QStore();

  const { meetingAccount, fetchMeetingAccount } = useAccountStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  // 목표 상세 데이터 조회
  useEffect(() => {
    if (goalId) {
      fetchGoalDetail(goalId);
    }
  }, [goalId, fetchGoalDetail]);

  // 모임통장 정보 조회
  useEffect(() => {
    fetchMeetingAccount();
  }, [fetchMeetingAccount]);

  // 상품별 자동이체 납입 정보 조회 (목표 상세 데이터가 로드된 후)
  useEffect(() => {
    if (currentGoal?.products && currentGoal.products.length > 0) {
      console.log('🔄 상품별 자동이체 납입 정보 조회 시작 - 상품 목록:', currentGoal.products.map(p => ({
        productId: p.productId,
        productName: p.productName,
        accountNumber: p.accountNumber
      })));
      fetchAllProductsPaymentInfo(currentGoal.products);
    }
  }, [currentGoal?.products, fetchAllProductsPaymentInfo]);

  // URL 파라미터에서 생성 완료 플래그 확인 및 토스트 표시
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isNewlyCreated = urlParams.get('created') === 'true';
    
    if (isNewlyCreated && !hasShownSuccessToast && currentGoal) {
      toast.success("Plan1Q 목표가 성공적으로 생성되었습니다!", {
        style: {
          background: colors.primary.toastBg,
          color: colors.primary.main,
          border: `1px solid ${colors.primary.main}`,
          fontFamily: "Hana2-CM",
        },
      });
      setHasShownSuccessToast(true);
      
      // URL에서 created 파라미터 제거
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [currentGoal, hasShownSuccessToast]);

  // 로딩 중이거나 에러가 있는 경우 처리
  if (isGoalDetailLoading || isPaymentInfoLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008485] mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: "Hana2-CM" }}>
            {isGoalDetailLoading ? "목표 정보를 불러오는 중..." : "납입 정보를 불러오는 중..."}
          </p>
        </div>
      </div>
    );
  }

  // 목표가 없는 경우 - 로딩 화면으로 표시
  if (!currentGoal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008485] mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: "Hana2-CM" }}>
            상세 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  // 에러가 있는 경우 처리
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4" style={{ fontFamily: "Hana2-CM" }}>
            {error}
          </p>
          <button
            onClick={() => {
              if (goalId) {
                fetchGoalDetail(goalId);
              }
              if (meetingAccount?.accountNumber) {
                fetchProductPaymentInfo(meetingAccount.accountNumber);
              }
            }}
            className="px-4 py-2 bg-[#008485] text-white rounded-lg hover:bg-[#006666] transition-colors"
            style={{ fontFamily: "Hana2-CM" }}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // API 응답 데이터를 기존 컴포넌트 형식에 맞게 변환
  // 디버깅: 백엔드에서 받은 원본 데이터 확인
  console.log('🔍 [DEBUG] 백엔드에서 받은 currentGoal:', currentGoal);
  console.log('🔍 [DEBUG] products 원본 데이터:', currentGoal.products);
  console.log('🔍 [DEBUG] 상품별 자동이체 납입 정보:', productPaymentInfo);
  console.log('🔍 [DEBUG] 모임통장 정보:', meetingAccount);

  // 상품별 납입 정보 매핑 함수
  const getProductPaymentData = (productId: number) => {
    const paymentInfo = productPaymentInfo.find(info => 
      info.toAccountNumber === currentGoal.products.find(p => p.productId === productId)?.accountNumber
    );
    
    if (paymentInfo) {
      return {
        autoTransferId: paymentInfo.autoTransferId,
        nextPaymentDate: paymentInfo.nextPaymentDate,
        remainingPayments: paymentInfo.remainingInstallments,
        autoTransferAccount: `${paymentInfo.fromAccountNumber}`,
        amount: paymentInfo.amount,
        paymentStatus: paymentInfo.paymentStatus,
        currentInstallment: paymentInfo.currentInstallment,
        totalInstallments: paymentInfo.totalInstallments
      };
    }
    
    // API 데이터가 없을 때 기본값 반환
    return {
      nextPaymentDate: "",
      remainingPayments: currentGoal.targetPeriod,
      autoTransferAccount: "",
      amount: 0,
      paymentStatus: "PENDING",
      currentInstallment: 0,
      totalInstallments: currentGoal.targetPeriod
    };
  };

  // 상품별 납입 정보 객체 생성
  const productPaymentDataMap = currentGoal.products.reduce((acc, product) => {
    acc[product.productId] = getProductPaymentData(product.productId);
    return acc;
  }, {} as Record<number, any>);
  
  const goal = {
    id: currentGoal.goalId,
    name: currentGoal.goalName,
    targetAmount: currentGoal.targetAmount,
    currentAmount: currentGoal.currentAmount || 0,
    // 가입 상태에 따른 수익률 결정
    returnRate: (() => {
      const hasSubscribedProducts = currentGoal.products.some(p => p.subscribed);
      
      if (hasSubscribedProducts) {
        // 가입 완료된 상품이 있으면 실제 수익률 사용
        return currentGoal.actualReturnRate || 0;
      } else {
        // 가입된 상품이 없으면 AI 추천 예상 수익률 사용
        return currentGoal.totalExpectedReturn || 0;
      }
    })(),
    actualReturnRate: currentGoal.actualReturnRate || 0,
    maturityDate: currentGoal.maturityDate,
    icon: currentGoal.icon || "house_deposit",
    color: currentGoal.color || "bg-blue-100 text-blue-600",
    description: currentGoal.goalDescription,
    riskLevel: currentGoal.riskLevelName || "보통",
    period: `${currentGoal.targetPeriod}개월`,
    monthlyAmount: currentGoal.monthlyAmount,
    nextPaymentDate: productPaymentInfo.length > 0 ? productPaymentInfo[0].nextPaymentDate : "",
    remainingPayments: productPaymentInfo.length > 0 ? productPaymentInfo[0].remainingInstallments : currentGoal.targetPeriod,
    autoTransferAccount: productPaymentInfo.length > 0 ? `${productPaymentInfo[0].toAccountNumber}` : "",
    status: currentGoal.statusName || "진행중",
    subscriptionProgress: currentGoal.subscriptionProgress || 0,
    createdDate: currentGoal.createdAt,
    owner: "사용자",
    products: currentGoal.products.map((product, index) => {
      return {
        id: product.productId,
        name: product.productName,
        ratio: product.investmentRatio,
        returnRate: product.returnRate ?? 0,
        monthlyAmount: product.monthlyAmount,
        subscribed: product.subscribed,
        totalDeposit: product.totalDeposit ?? 0,   // 총 입금액
        profit: product.profit ?? 0,
        contractDate: product.contractDate || new Date().toISOString().split("T")[0],
        maturityDate: product.maturityDate,
        terms: product.terms || "상품 약관",
        contract: product.contract || `${product.productName} 계약서`,
        type: (product.productType as "FUND" | "SAVINGS" | "DEPOSIT" | "BOND" | "ETF") || "FUND",
        accountNumber: product.accountNumber,
        // AI 추천 시 받은 기대 수익률
        expectedReturnRate: product.expectedReturnRate ?? undefined,
        // 하나은행 API 필드명 전달
        currentBalance: product.currentBalance,
        baseRate: product.baseRate,
        profitRate: product.profitRate,
        lastUpdated: product.lastUpdated,
      };
    }),
  };

  const subscribedProducts = goal.products.filter((p: any) => p.subscribed);
  const unsubscribedProducts = goal.products.filter((p: any) => !p.subscribed);
  const subscriptionProgress =
    (subscribedProducts.length / goal.products.length) * 100;
  const allSubscribed = unsubscribedProducts.length === 0;

  const totalProfit = subscribedProducts.reduce(
    (sum: number, product: any) => sum + product.profit,
    0
  );
  const totalCurrentValue = subscribedProducts.reduce(
    (sum: number, product: any) => sum + product.totalDeposit,
    0
  );
  const overallReturnRate =
    totalCurrentValue > 0
      ? (totalProfit / (totalCurrentValue - totalProfit)) * 100
      : 0;

  const handleSubscribe = (productId: number) => {
    router.push(`/plan1q/${goalId}/subscribe/${productId}`);
  };

  // 가입 성공 후 데이터 새로고침 및 페이지 리다이렉트
  const handleSubscriptionSuccess = () => {
    // 데이터 새로고침
    fetchGoalDetail(goalId);
    // 상세보기 페이지로 리다이렉트 (현재 페이지 새로고침)
    router.push(`/plan1q/${goalId}`);
  };

  // 수동납입 성공 후 데이터 새로고침
  const handlePaymentSuccess = () => {
    console.log('🔄 수동납입 성공 - 데이터 새로고침 시작');
    // 목표 상세 정보 다시 조회
    fetchGoalDetail(goalId);
    // 상품별 자동이체 납입 정보 다시 조회
    if (currentGoal?.products && currentGoal.products.length > 0) {
      fetchAllProductsPaymentInfo(currentGoal.products);
    }
  };

  const handleTerminate = async (productId: number) => {
    console.log("상품 해지:", productId);
    const result = await showConfirmDialog({
      title: "정말 이 상품을 해지하시겠습니까?",
      confirmButtonText: "해지하기",
      cancelButtonText: "취소",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      showSuccessAlert({ title: "상품이 해지되었습니다." });
    }
  };

  const handleViewTerms = (product: any) => {
    setSelectedProduct(product);
    setIsTermsDialogOpen(true);
  };

  const handleViewContract = (product: any) => {
    setSelectedProduct(product);
    setIsContractDialogOpen(true);
  };

  const handleAutoTransferChange = () => {
    showInfoAlert({ title: "자동이체 설정 변경 기능은 준비 중입니다." });
  };

  // 공통 ProductCard props
  const productCardProps = {
    onSubscribe: handleSubscribe,
    onViewTerms: handleViewTerms,
    onViewContract: handleViewContract,
    onTerminate: handleTerminate,
    onSubscriptionSuccess: handleSubscriptionSuccess,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FormHeader title="상세보기" onBack={() => router.push("/plan1q")} maxWidth="6xl" />
      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <GoalCard goal={goal} />
            </div>
            <div className="lg:col-span-2">
              <SubscriptionProgressAlert
                subscribedCount={subscribedProducts.length}
                totalCount={goal.products.length}
                progress={subscriptionProgress}
              />

              {subscribedProducts.length > 0 && productPaymentInfo.length > 0 ? (
                <PortfolioTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  products={goal.products}
                  goal={{
                    targetPeriod: currentGoal.targetPeriod,
                    createdAt: currentGoal.createdAt,
                  }}
                  onSubscribe={handleSubscribe}
                  onViewTerms={handleViewTerms}
                  onViewContract={handleViewContract}
                  onTerminate={handleTerminate}
                  onSubscriptionSuccess={handleSubscriptionSuccess}
                  onPayment={handlePaymentSuccess}
                  paymentData={{
                    autoTransferId: 0, // 임시값
                    monthlyAmount: goal.monthlyAmount,
                    nextPaymentDate: goal.nextPaymentDate,
                    remainingPayments: goal.remainingPayments,
                    autoTransferAccount: goal.autoTransferAccount,
                    isPaymentCompleted: false, // 2개 중 1개만 납입되지 않은 상태로 표시
                    onAutoTransferChange: handleAutoTransferChange,
                  }}
                  productPaymentData={productPaymentDataMap}
                />
              ) : (
                <PortfolioOverview
                  products={goal.products}
                  goal={{
                    targetPeriod: currentGoal.targetPeriod,
                    createdAt: currentGoal.createdAt,
                  }}
                  onSubscribe={handleSubscribe}
                  onViewTerms={handleViewTerms}
                  onViewContract={handleViewContract}
                  onTerminate={handleTerminate}
                  onSubscriptionSuccess={handleSubscriptionSuccess}
                />
              )}
            </div>
          </div>

          <TermsDialog
            isOpen={isTermsDialogOpen}
            onClose={() => setIsTermsDialogOpen(false)}
            product={selectedProduct}
          />
          <ContractDialog
            isOpen={isContractDialogOpen}
            onClose={() => setIsContractDialogOpen(false)}
            product={selectedProduct}
          />
        </div>
      </div>
    </div>
  );
}
