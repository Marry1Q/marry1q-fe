"use client";

import { useRouter } from "next/navigation";
import { Plan1QLayout } from "@/components/layout/Plan1QLayout";
import { Plan1QSelection } from "@/features/plan1q/components/Plan1QSelection";
import { Plan1QDetails } from "@/features/plan1q/components/Plan1QDetails";
import { Plan1QConfirmation } from "@/features/plan1q/components/Plan1QConfirmation";
import { usePlan1QStore } from "@/lib/store/plan1qStore";
import { showPageLeaveConfirm } from "@/components/ui/CustomAlert";
import { useEffect, useRef } from "react";
import { colors } from "@/constants/colors";

export default function CreatePlan1QPage() {
  const router = useRouter();
  const {
    data,
    currentStep,
    totalSteps,
    completedSteps,
    isLoading,
    setData,
    nextStep,
    prevStep,
    setCurrentStep,
    resetData,
  } = usePlan1QStore();

  // 페이지 마운트 시 store 초기화
  useEffect(() => {
    // localStorage에서 plan1q-store 제거
    if (typeof window !== "undefined") {
      localStorage.removeItem("plan1q-store");
    }
    // store 상태 초기화
    resetData();
  }, [resetData]);

  // 이탈 감지용 ref (중복 방지)
  const isLeavingRef = useRef(false);

  // localStorage(plan1q-store) 완전 초기화 함수
  const clearPlan1QStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("plan1q-store");
    }
    resetData();
    // store 상태도 강제로 초기화
    setData({
      selectedPlan1Q: undefined,
      isCustomGoalSelected: false,
      goalTitle: "",
      detailedGoal: "",
      targetAmount: 1000000,
      targetPeriod: 6,
      isConfirmed: false,
    });
    setCurrentStep(1);
  };

  // 창 이탈(새로고침, 닫기 등) 감지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLeavingRef.current) return;
      e.preventDefault();
      e.returnValue = ""; // 일부 브라우저에서 필요
      return "";
    };

    // 페이지 언로드 시 localStorage 초기화
    const handleUnload = () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("plan1q-store");
      }
    };

    // 페이지 숨김 시에도 localStorage 초기화 (더 확실한 방법)
    const handlePageHide = () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("plan1q-store");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  // 라우터 이탈 감지 (뒤로가기 등)
  useEffect(() => {
    const handleRouteChange = async (url: string) => {
      if (isLeavingRef.current) return;
      // 현재 페이지가 아니면(이탈 시도) 경고
      if (url !== "/plan1q/create") {
        isLeavingRef.current = true;
        const result = await showPageLeaveConfirm();
        if (result.isConfirmed) {
          clearPlan1QStorage();
          router.push(url);
        } else {
          isLeavingRef.current = false;
          // stay on current page
          router.push("/plan1q/create");
        }
      }
    };
    // next/navigation에는 events가 없으므로, router.back 등에서 직접 호출 필요
    // window.history.back 등도 감지하려면 popstate 사용
    const handlePopState = (e: PopStateEvent) => {
      handleRouteChange(document.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  const steps = ["목표 선택하기", "상세 목표 입력하기", "Plan1Q 확인하기"];

  const handleBack = async () => {
    // 모든 단계에서 이탈 시 경고
    const result = await showPageLeaveConfirm();
    if (result.isConfirmed) {
      clearPlan1QStorage();
      router.push("/plan1q"); // Plan1Q 홈으로 이동
    }
  };

  const handleStepClick = (step: number) => {
    // 2단계로 이동하려면 1단계가 완료되어야 하고, 2단계에 작성한 내용이 있어야 함
    if (step === 2) {
      const hasStep1Completed = completedSteps.includes(1);
      const hasStep2Data = data.goalTitle && data.goalTitle.trim() !== "";

      if (hasStep1Completed && hasStep2Data) {
        setCurrentStep(step);
      }
    }
    // 다른 단계들은 기존 로직 유지
    else if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    nextStep();
  };

  const handleSelectPlan1Q = (option: any) => {
    setData({
      selectedPlan1Q: {
        id: option.id,
        title: option.title,
        iconName: option.iconName,
      },
      goalTitle: option.title, // 선택된 목표의 제목을 자동으로 설정
      isCustomGoalSelected: false, // 미리 정의된 목표 선택
    });
  };

  const handleAddCustomGoal = () => {
    setData({
      selectedPlan1Q: undefined, // 미리 정의된 목표 선택 해제
      goalTitle: "", // 목표 제목 초기화
      isCustomGoalSelected: true, // 직접 입력하기 선택
    });
  };

  const handleUpdateDetails = (details: any) => {
    setData(details);
  };

  const handleSubmit = () => {
    // Plan1Q 생성 시에도 초기화
    clearPlan1QStorage();
    console.log("Plan1Q 생성 완료:", data);
    // 여기서 API 호출 등을 수행
    router.push("/plan1q");
  };

  // 로딩 중일 때 전체 화면을 로딩 화면으로 덮기
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008485] mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: "Hana2-CM" }}>
            AI 포트폴리오를 추천받는 중...
          </p>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Plan1QSelection
            onSelect={handleSelectPlan1Q}
            onNext={handleNext}
            onAddCustomGoal={handleAddCustomGoal}
            selectedPlan1Q={data.selectedPlan1Q}
            isCustomGoalSelected={data.isCustomGoalSelected}
          />
        );
      case 2:
        return (
          <Plan1QDetails
            data={data}
            onUpdate={handleUpdateDetails}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <Plan1QConfirmation
            data={data}
            onSubmit={handleSubmit}
            onBack={prevStep}
          />
        );
      default:
        return (
          <Plan1QSelection onSelect={handleSelectPlan1Q} onNext={handleNext} />
        );
    }
  };

  const createStepDescriptions = {
    1: "투자 목표 선택하기",
    2: "목표 상세 설정하기",
    3: "포트폴리오 확인하기",
  };

  return (
    <Plan1QLayout
      title="Plan1Q 만들기"
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={steps}
      stepDescriptions={createStepDescriptions}
      completedSteps={completedSteps}
      onBack={handleBack}
      onStepClick={handleStepClick}
    >
      {renderCurrentStep()}
    </Plan1QLayout>
  );
}
