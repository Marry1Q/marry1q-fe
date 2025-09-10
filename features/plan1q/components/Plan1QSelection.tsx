"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { colors } from "@/constants/colors";
import { HanaIcon } from "@/components/ui/HanaIcon";
import { IconName } from "@/lib/iconMapping";
import { useTemplates, useTemplatesLoading, useFetchTemplates } from "../store/selectors";

interface Plan1QItem {
  id: number;
  title: string;
  description?: string;
  iconName: string;
}

interface Plan1QSelectionProps {
  onSelect: (plan1q: Plan1QItem) => void;
  onNext: () => void;
  onAddCustomGoal?: () => void;
  selectedPlan1Q?: Plan1QItem | null;
  isCustomGoalSelected?: boolean;
}

export function Plan1QSelection({
  onSelect,
  onNext,
  onAddCustomGoal,
  selectedPlan1Q: initialSelectedPlan1Q,
  isCustomGoalSelected: initialIsCustomGoalSelected = false,
}: Plan1QSelectionProps) {
  const [selectedPlan1Q, setSelectedPlan1Q] = useState<Plan1QItem | null>(
    initialSelectedPlan1Q || null
  );
  const [isCustomGoalSelected, setIsCustomGoalSelected] = useState(
    initialIsCustomGoalSelected
  );

  // API 데이터 로드
  const templates = useTemplates();
  const isLoading = useTemplatesLoading();
  const fetchTemplates = useFetchTemplates();

  // 컴포넌트 마운트 시 템플릿 데이터 로드
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // props가 변경될 때마다 로컬 상태 업데이트
  useEffect(() => {
    setSelectedPlan1Q(initialSelectedPlan1Q || null);
    setIsCustomGoalSelected(initialIsCustomGoalSelected);
  }, [initialSelectedPlan1Q, initialIsCustomGoalSelected]);

  const handleSelect = (plan1q: Plan1QItem) => {
    setSelectedPlan1Q(plan1q);
    setIsCustomGoalSelected(false); // 커스텀 목표 선택 해제
    onSelect(plan1q);
  };

  const handleCustomGoalClick = () => {
    // 기존 선택 해제
    setSelectedPlan1Q(null);
    // 목표 직접 추가하기 선택 상태로 변경
    setIsCustomGoalSelected(true);
    // 부모 컴포넌트에 알림
    if (onAddCustomGoal) {
      onAddCustomGoal();
    }
  };

  // 로딩 중일 때 전체 화면을 로딩 화면으로 덮기
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008485] mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: "Hana2-CM" }}>
            Plan1Q 템플릿을 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl p-4 space-y-6">
      {/* 헤드라인 */}
      <div className="text-center space-y-2">
        <h1
          className="text-2xl text-gray-900"
          style={{ fontFamily: "Hana2-CM" }}
        >
          목표를 선택해 주세요
        </h1>
        <p className="text-sm text-gray-600">
          마음에 드는 목표를 선택하거나 직접 목표를 설정할 수 있어요
        </p>
      </div>

      {/* Plan1Q 목록 */}
      <div className="grid grid-cols-2 gap-4">
        {templates && templates.length > 0 ? templates.map((plan1q) => (
          <Card
            key={plan1q.id}
            className={`border-2 cursor-pointer transition-all ${
              selectedPlan1Q?.id === plan1q.id
                ? "border-green-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
            style={{
              backgroundColor:
                selectedPlan1Q?.id === plan1q.id
                  ? `${colors.primary.main}20`
                  : "transparent",
            }}
            onClick={() => handleSelect(plan1q)}
          >
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 flex items-center justify-center">
                  <HanaIcon name={plan1q.iconName as IconName} size={48} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {plan1q.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {plan1q.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-2 text-center py-8">
            <p className="text-gray-500">템플릿을 불러오는 중...</p>
          </div>
        )}

        {/* 목표 직접 추가하기 */}
        <Card
          className={`border-2 border-dashed cursor-pointer transition-all ${
            isCustomGoalSelected
              ? "border-green-500"
              : "border-gray-300 hover:border-gray-400"
          }`}
          style={{
            backgroundColor: isCustomGoalSelected
              ? `${colors.primary.main}20`
              : "transparent",
          }}
          onClick={handleCustomGoalClick}
        >
          <CardContent className="p-4 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xl font-bold">+</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  목표 직접 추가하기
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  원하는 목표가 없다면 직접 설정해보세요
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 다음 버튼 */}
      <Button
        onClick={onNext}
        className="w-full py-3 text-white font-medium"
        style={{ backgroundColor: colors.primary.main }}
        disabled={!selectedPlan1Q && !isCustomGoalSelected}
      >
        다음
      </Button>
    </div>
  );
}
