"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  Target,
  TrendingUp,
  Shield,
  AlertTriangle,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { Plan1QLayout } from "@/components/layout/Plan1QLayout";
import { colors } from "@/constants/colors";
import { HanaIcon } from "@/components/ui/HanaIcon";
import { ConfettiEffect, useConfetti } from "@/components/ui/confetti";
import { usePlan1QStore } from "@/features/plan1q";
import type { InvestmentProfileSubmitRequest } from "@/features/plan1q";

// 투자성향 결과 타입
type RiskType = "안정형" | "중립형" | "공격형";

interface TestResult {
  type: RiskType;
  score: number;
  description: string;
  recommendedProducts: string[];
}

export default function InvestmentTestPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ score: number; optionValue: string }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const { isActive, trigger } = useConfetti();
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Store 사용
  const { 
    investmentQuestions, 
    isQuestionsLoading, 
    isSubmitting,
    fetchInvestmentQuestions, 
    submitInvestmentProfile 
  } = usePlan1QStore();

  // 투자성향 검사 질문 조회
  useEffect(() => {
    const loadQuestions = async () => {
      await fetchInvestmentQuestions();
      setHasInitialized(true);
    };
    loadQuestions();
  }, [fetchInvestmentQuestions]);

  // 페이지 마운트 시 상태 초기화
  useEffect(() => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsCompleted(false);
    setTestResult(null);
    setHasTriggeredConfetti(false);
  }, []);

  // 투자성향 검사 처리
  const handleAnswer = (score: number, optionValue: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = { score, optionValue };
    setAnswers(newAnswers);

    if (currentQuestion < investmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 마지막 질문이므로 답변을 추가한 후 검사 완료 - API로 제출
      const finalAnswers = [...newAnswers];
      handleSubmitTest(finalAnswers);
    }
  };

  // 검사 결과 제출
  const handleSubmitTest = async (finalAnswers: { score: number; optionValue: string }[]) => {
    try {
      console.log('📝 검사 제출 시작:', finalAnswers);
      console.log('📝 질문 개수:', investmentQuestions.length);
      
      const request: InvestmentProfileSubmitRequest = {
        answers: finalAnswers.map((answer, index) => ({
          questionId: investmentQuestions[index].id,
          answer: answer.optionValue // optionValue 사용
        }))
      };
      
      console.log('📝 API 요청 데이터:', request);
      
      const success = await submitInvestmentProfile(request);
      if (success) {
        // 성공 시 결과 표시
        const totalScore = finalAnswers.reduce((sum, answer) => sum + answer.score, 0);
        const avgScore = totalScore / investmentQuestions.length;

        let riskType: RiskType = "안정형";
        let description = "";
        let recommendedProducts: string[] = [];

        if (avgScore >= 4) {
          riskType = "공격형";
          description = "높은 수익을 추구하며 위험을 감수할 수 있는 투자 성향입니다.";
          recommendedProducts = [
            "하나 글로벌 인덱스 ETF",
            "하나 성장형 주식펀드",
            "하나 벤처 펀드",
          ];
        } else if (avgScore >= 3) {
          riskType = "중립형";
          description = "안정성과 수익성의 균형을 추구하는 투자 성향입니다.";
          recommendedProducts = [
            "하나 더블모아 적금",
            "하나 안정형 ETF 포트폴리오",
            "하나 중기국공채",
          ];
        } else {
          riskType = "안정형";
          description = "원금 보장과 안정적인 수익을 우선시하는 투자 성향입니다.";
          recommendedProducts = [
            "하나 주택청약종합저축",
            "하나 안정형 채권펀드",
            "하나 단기 적금",
          ];
        }

        const result: TestResult = {
          type: riskType,
          score: Math.round(avgScore * 20), // 0-100 점수로 변환
          description,
          recommendedProducts,
        };

        setTestResult(result);
        setIsCompleted(true);
        
        // 검사 완료 시 컨페티 실행 (한 번만)
        if (!hasTriggeredConfetti) {
          trigger(4000); // 4초간 컨페티 실행
          setHasTriggeredConfetti(true);
        }
      }
    } catch (error) {
      console.error('검사 제출 실패:', error);
    }
  };

  // 검사 다시 시작
  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsCompleted(false);
    setTestResult(null);
    setHasTriggeredConfetti(false); // 컨페티 상태도 리셋
  };

  // 새 목표 생성으로 이동
  const handleCreateGoal = () => {
    router.push("/plan1q/create");
  };

  // 메인 페이지로 돌아가기
  const handleGoBack = () => {
    router.push("/plan1q");
  };

  // 홈으로 돌아가기
  const handleGoHome = () => {
    router.push("/plan1q");
  };

  // 진행률 계산 (현재 문항까지의 모든 답변을 고려)
  const answeredQuestions = answers.filter(answer => answer !== undefined).length;
  const progress = investmentQuestions.length > 0 ? (answeredQuestions / investmentQuestions.length) * 100 : 0;

  const steps = ["검사하기", "결과 보기"];
  const currentStep = isCompleted ? 2 : 1;
  const completedSteps = isCompleted ? [1] : [];
  
  const testStepDescriptions = {
    1: "투자 성향 파악하기",
    2: "검사 결과 확인하기",
  };

  return (
    <>
      <ConfettiEffect 
        isActive={isActive} 
        colors={['#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#ff6b6b']}
        numberOfPieces={250}
        gravity={0.25}
        wind={0.04}
      />
      {isQuestionsLoading || !hasInitialized ? (
        /* 전체 화면 로딩 */
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008485] mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: "Hana2-CM" }}>
              투자 성향 검사 질문을 불러오는 중...
            </p>
          </div>
        </div>
      ) : (
        <Plan1QLayout
          title="투자성향 검사"
          currentStep={currentStep}
          totalSteps={2}
          steps={steps}
          stepDescriptions={testStepDescriptions}
          completedSteps={completedSteps}
          onBack={handleGoBack}
        >
        {investmentQuestions.length === 0 ? (
          /* 질문이 없는 경우 */
          <div className="max-w-2xl mx-auto">
            <Card className="w-full">
              <CardContent className="space-y-6 pt-6">
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: "Hana2-CM" }}>
                    질문을 불러올 수 없습니다
                  </h3>
                  <p className="text-gray-600 mb-6" style={{ fontFamily: "Hana2-CM" }}>
                    네트워크 연결을 확인하고 다시 시도해주세요.
                  </p>
                  <Button 
                    onClick={() => fetchInvestmentQuestions()}
                    className="px-6 py-2"
                    style={{ backgroundColor: colors.primary.main }}
                  >
                    다시 시도
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : !isCompleted ? (
        /* 검사 진행 화면 */
        <div className="max-w-2xl mx-auto">
          <Card className="w-full">
            <CardContent className="space-y-6 pt-6">
              {/* 진행률 표시 */}
              <div className="flex items-center gap-4 mb-8">
                {currentQuestion > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                    className="flex items-center justify-center w-8 h-8 p-0"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                )}
                <Progress 
                  value={progress} 
                  className="h-2 flex-1" 
                  color={colors.primary.main}
                  backgroundColor={colors.primary.light + '20'}
                />
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="text-center py-8">
                <div className="flex items-center justify-center gap-3 mb-12">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                    style={{ backgroundColor: colors.primary.main, fontFamily:"Hana2-CM" }}
                  >
                    {currentQuestion + 1}
                  </div>
                  <h2 
                    className="text-xl max-w-md leading-relaxed break-words" 
                    style={{
                      fontFamily:"Hana2-CM",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {investmentQuestions[currentQuestion]?.question}
                  </h2>
                </div>
                <div className="space-y-3">
                  {investmentQuestions[currentQuestion]?.options.map(
                    (option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto p-4 transition-all duration-200"
                        style={{
                          borderColor: 'rgb(229 231 235)',
                          backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.primary.main}10`;
                          e.currentTarget.style.borderColor = colors.primary.main;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = 'rgb(229 231 235)';
                        }}
                        onClick={() => handleAnswer(option.score, option.optionValue)}
                        disabled={isSubmitting}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                            answers[currentQuestion]?.score === option.score
                              ? `border-[${colors.primary.main}] bg-[${colors.primary.main}] text-white`
                              : 'border-gray-300'
                          }`}>
                            {answers[currentQuestion]?.score === option.score ? '✓' : String.fromCharCode(65 + index)}
                          </div>
                          <span 
                            className="font-medium text-left leading-relaxed break-words"
                            style={{
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              whiteSpace: "pre-wrap"
                            }}
                          >
                            {isSubmitting && answers[currentQuestion]?.score === option.score ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                제출 중...
                              </div>
                            ) : (
                              option.text
                            )}
                          </span>
                        </div>
                      </Button>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* 검사 결과 화면 */
        <div className="max-w-2xl mx-auto space-y-6">
                    <Card className="w-full">
            <CardContent className="space-y-6 pt-8">
              {/* 투자성향 결과 */}
              <div className="text-center py-6">
                <div className="flex justify-center mb-4">
                  {testResult?.type === "안정형" && (
                    <HanaIcon name="savings" size={80} />
                  )}
                  {testResult?.type === "중립형" && (
                    <HanaIcon name="investment" size={80} />
                  )}
                  {testResult?.type === "공격형" && (
                    <HanaIcon name="fund" size={80} />
                  )}
                </div>
                <h3 className="text-2xl mb-2" style={{fontFamily:"Hana2-CM"}}>
                  {testResult?.type}
                </h3>
                <p className="text-gray-600 mb-4">
                  {testResult?.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 액션 버튼 */}
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="flex-1 flex items-center justify-center gap-2 h-10 px-4 py-2"
              style={{
                borderColor: 'rgb(229 231 235)',
                backgroundColor: 'white',
                color: 'rgb(55 65 81)',
              }}
            >
              홈으로 돌아가기
            </Button>
            <Button
              onClick={handleCreateGoal}
              className="flex-1 flex items-center justify-center gap-2 h-10 px-4 py-2 text-white font-medium"
              style={{ backgroundColor: colors.primary.main }}
            >
              새 목표 만들기
            </Button>
          </div>
        </div>
      )}
        </Plan1QLayout>
      )}
    </>
  );
}
