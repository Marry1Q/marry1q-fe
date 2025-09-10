"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { colors } from "@/constants/colors";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { HanaIcon } from "@/components/ui/HanaIcon";
import { IconName } from "@/lib/iconMapping";
import { plan1qApi } from "../api/plan1qApi";
import { usePlan1QStore } from "@/lib/store/plan1qStore";
import { toast } from "sonner";

interface Plan1QDetailsProps {
  data: {
    goalTitle?: string;
    detailedGoal?: string;
    targetAmount?: number;
    targetPeriod?: number;
    isCustomGoalSelected?: boolean;
    selectedPlan1Q?: {
      id: number;
      title: string;
      description?: string;
      iconName: string;
    };
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
}

export function Plan1QDetails({ data, onUpdate, onNext }: Plan1QDetailsProps) {
  const [localData, setLocalData] = useState({
    goalTitle: data.goalTitle || "",
    detailedGoal: data.detailedGoal || "",
    targetAmount: data.targetAmount || 0,
    targetPeriod: data.targetPeriod || 0,
    isCustomGoalSelected: data.isCustomGoalSelected || false,
    selectedPlan1Q: data.selectedPlan1Q || null,
  });

  const { setLoading, setApiResponse, setMappedResponse, setError, setRecommendationResponse } = usePlan1QStore();

  // data prop이 변경될 때마다 localData 업데이트
  useEffect(() => {
    setLocalData({
      goalTitle: data.goalTitle || "",
      detailedGoal: data.detailedGoal || "",
      targetAmount: data.targetAmount || 0,
      targetPeriod: data.targetPeriod || 0,
      isCustomGoalSelected: data.isCustomGoalSelected || false,
      selectedPlan1Q: data.selectedPlan1Q || null,
    });
  }, [data]);

  const handleUpdate = (field: string, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onUpdate(newData);
  };

  const calculateTargetDate = () => {
    const today = new Date();
    const targetDate = new Date(
      today.getFullYear(),
      today.getMonth() + localData.targetPeriod,
      today.getDate()
    );
    return targetDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    });
  };

  const handleGetRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);

      const request = {
        goalTitle: localData.goalTitle,
        detailedGoal: localData.detailedGoal || localData.goalTitle,
        targetAmount: localData.targetAmount,
        targetPeriod: localData.targetPeriod,
      };

      console.log("🚀 AI 포트폴리오 추천 요청:", request);

      const response = await plan1qApi.getRecommendation(request);
      
      console.log("✅ AI 포트폴리오 추천 응답:", response);

      if (response.success && response.data) {
        // 추천 결과를 store에 저장
        setRecommendationResponse(response.data);
        onNext();
      } else {
        throw new Error(response.message || "AI 포트폴리오 추천에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ AI 포트폴리오 추천 에러:", error);
      const errorMessage = error instanceof Error ? error.message : "AI 포트폴리오 추천에 실패했습니다.";
      setError(errorMessage);
      toast.error(errorMessage, {
        style: {
          background: "#FEF2F2",
          color: "#DC2626",
          border: "1px solid #DC2626",
          fontFamily: "Hana2-CM",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-4 space-y-6">
      {/* 헤드라인 */}
      <div className="flex items-center justify-center">
        <h1
          className="text-2xl text-gray-900"
          style={{ fontFamily: "Hana2-CM" }}
        >
          상세 목표를 입력해 주세요
        </h1>
      </div>

      {/* 입력 필드들 */}
      <div className="space-y-4">
        {/* 나의 목표 */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-2">
              <label 
                className="text-2xl text-gray-700"
                style={{ fontFamily: "Hana2-CM" }}
              >
                나의 목표
              </label>
              {localData.isCustomGoalSelected ? (
                <Input
                  value={localData.goalTitle}
                  onChange={(e) => handleUpdate("goalTitle", e.target.value)}
                  placeholder="목표를 입력하세요"
                  className="text-2xl font-bold"
                  style={{ fontFamily: "Hana2-CM" }}
                />
              ) : (
                <div 
                  className="p-4 border border-gray-200 rounded-lg"
                  style={{ backgroundColor: `${colors.primary.main}10` }}
                >
                  {localData.selectedPlan1Q ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <HanaIcon 
                          name={localData.selectedPlan1Q.iconName as IconName} 
                          size={48} 
                        />
                      </div>
                      <div className="flex-1">
                        <div 
                          className="text-gray-700 font-medium text-lg"
                          style={{ fontFamily: "Hana2-CM" }}
                        >
                          {localData.selectedPlan1Q.title}
                        </div>
                        <div className="text-gray-500 text-sm mt-1">
                          {localData.selectedPlan1Q.description}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span 
                      className="text-gray-700 font-medium"
                      style={{ fontFamily: "Hana2-CM" }}
                    >
                      목표를 선택해주세요
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 목표금액과 목표기간 2열 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 목표금액 */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-2">
                <label className="text-2xl text-gray-700"
                style={{ fontFamily: "Hana2-CM" }}>
                  목표금액
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center relative flex-1">
                    <Input
                      type="text"
                      value={localData.targetAmount === 0 ? "" : (localData.targetAmount || 0).toLocaleString()}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        const numValue = parseInt(value) || 0;
                        handleUpdate("targetAmount", numValue);
                      }}
                      placeholder="0"
                      className="border-0 focus:outline-none focus:ring-0 p-4 text-right text-3xl pr-8"
                      style={{ color: colors.primary.main, fontSize: '1.875rem', fontFamily: "Hana2-CM" }}
                    />
                    <span 
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      style={{ 
                        color: colors.primary.main, 
                        fontSize: '1.875rem', 
                        fontFamily: "Hana2-CM",
                      }}
                    >
                      원
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1 ml-2">
                    <ChevronUp
                      className="w-4 h-4 text-gray-400 cursor-pointer"
                      onClick={() =>
                        handleUpdate(
                          "targetAmount",
                          Math.min(localData.targetAmount + 100000, 10000000)
                        )
                      }
                    />
                    <ChevronDown
                      className="w-4 h-4 text-gray-400 cursor-pointer"
                      onClick={() =>
                        handleUpdate(
                          "targetAmount",
                          Math.max(localData.targetAmount - 100000, 0)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 목표기간 */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-2">
                <label className="text-2xl text-gray-700"
                style={{ fontFamily: "Hana2-CM" }}>
                  목표기간
                </label>
                <div className="flex items-center justify-end space-x-2">
                  <span
                    className="text-3xl"
                    style={{ color: colors.primary.main, fontFamily: "Hana2-CM" }}
                  >
                    {localData.targetPeriod}개월
                  </span>
                  <div className="flex flex-col space-y-1">
                    <ChevronUp
                      className="w-4 h-4 text-gray-400 cursor-pointer"
                      onClick={() =>
                        handleUpdate(
                          "targetPeriod",
                          Math.min(localData.targetPeriod + 1, 120)
                        )
                      }
                    />
                    <ChevronDown
                      className="w-4 h-4 text-gray-400 cursor-pointer"
                      onClick={() =>
                        handleUpdate(
                          "targetPeriod",
                          Math.max(localData.targetPeriod - 1, 0)
                        )
                      }
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {calculateTargetDate()}에 목표 금액을 달성합니다!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 다음 버튼 */}
      <Button
        onClick={handleGetRecommendation}
        className="w-full py-3 text-white font-medium"
        style={{ backgroundColor: colors.primary.main }}
        disabled={!localData.goalTitle}
      >
        포트폴리오 추천받기
      </Button>
    </div>
  );
}
