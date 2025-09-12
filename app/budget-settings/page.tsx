"use client";

import type React from "react";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  CalendarIcon,
  Heart,
  Home,
  Car,
  ShoppingBag,
  Coffee,
  Utensils,
  Gamepad2,
  Save,
  TrendingUp,
  Target,
  Plus,
  Trash2,
  MoreVertical,
  Gift,
  Camera,
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { colors } from "@/constants/colors";
import { showConfirmDialog } from "@/components/ui/CustomAlert";
import { budgetApi, categoryApi } from "../../features/finance/api";
import { useBudgetStore } from "../../features/finance/store";
import { formatCurrency, parseBigDecimal, toBigDecimal } from "../../features/finance/utils/currencyUtils";
import { CategoryBudgetResponse, CategoryResponse } from "../../features/finance/types";
import { coupleApi, CoupleResponse } from "@/lib/api/coupleApi";
import { FinanceCategoryIcon } from "@/components/ui/FinanceCategoryIcon";

// 카테고리 아이콘 매핑
const categoryIconMap: Record<string, any> = {
  "식비": Utensils,
  "교통비": Car,
  "쇼핑": ShoppingBag,
  "주거비": Home,
  "카페": Coffee,
  "오락": Gamepad2,
  "업무": Target,
  "의료": Heart,
  "선물": Gift,
  "수입": TrendingUp,
  "웨딩홀": Heart,
  "드레스": ShoppingBag,
  "스튜디오": Camera,
  "기타": MoreVertical,
};

// 카테고리 색상 매핑
const categoryColorMap: Record<string, string> = {
  "식비": "bg-orange-100 text-orange-600",
  "교통비": "bg-blue-100 text-blue-600",
  "쇼핑": "bg-purple-100 text-purple-600",
  "주거비": "bg-red-100 text-red-600",
  "카페": "bg-amber-100 text-amber-600",
  "오락": "bg-pink-100 text-pink-600",
  "업무": "bg-gray-100 text-gray-600",
  "의료": "bg-green-100 text-green-600",
  "선물": "bg-rose-100 text-rose-600",
  "수입": "bg-green-100 text-green-600",
  "웨딩홀": "bg-red-100 text-red-600",
  "드레스": "bg-purple-100 text-purple-600",
  "스튜디오": "bg-blue-100 text-blue-600",
  "기타": "bg-gray-100 text-gray-600",
};



export default function BudgetSettingsPage() {
  // API 데이터 훅 사용
  const {
    categoryBudgets,
    categories,
    loading,
    error,
    setCategoryBudgets,
    setCategories,
    setLoading,
    setError,
  } = useBudgetStore();

  // 초기 로딩 상태 강제 설정
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 커플 정보 상태
  const [coupleInfo, setCoupleInfo] = useState<CoupleResponse | null>(null);
  const [coupleLoading, setCoupleLoading] = useState(false);

  // 카테고리별 예산 상태 관리
  const [categoryBudgetInputs, setCategoryBudgetInputs] = useState<Record<number, string>>({});
  
  // 변경사항 추적
  const [hasChanges, setHasChanges] = useState(false);
  
  // 실시간 합계 계산을 위한 상태
  const [realtimeTotalBudget, setRealtimeTotalBudget] = useState(0);
  
  // 예산 초과 알림 상태 (중복 알림 방지)
  const [hasShownOverBudgetAlert, setHasShownOverBudgetAlert] = useState(false);

  const formatAmount = (value: string) => {
    const number = value.replace(/[^\d]/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const [weddingBudget, setWeddingBudget] = useState("");
  const [targetDate, setTargetDate] = useState<Date>(new Date("2024-12-31"));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 숫자 입력 처리를 위한 ref와 커서 위치 상태
  const weddingBudgetInputRef = useRef<HTMLInputElement>(null);
  const [weddingBudgetCursorPosition, setWeddingBudgetCursorPosition] = useState<number | null>(null);
  
  // 목표일까지 남은 일수 계산 함수
  const calculateDaysUntilWedding = useCallback((date: Date) => {
    const today = new Date();
    const timeDiff = date.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return Math.max(0, daysDiff); // 음수가 되지 않도록
  }, []);
  
  // 현재 선택된 날짜까지 남은 일수
  const [daysUntilWedding, setDaysUntilWedding] = useState(calculateDaysUntilWedding(targetDate));

  // API 데이터 로드 함수들
  const fetchCategoryBudgets = useCallback(async () => {
    try {
      const response = await budgetApi.getCategoryBudgets();
      if (response.success && response.data) {
        setCategoryBudgets(response.data.categoryBudgets);
      } else {
        setError(response.message || '카테고리별 예산을 불러오는데 실패했습니다.');
        showErrorToast(response.message || '카테고리별 예산을 불러오는데 실패했습니다.');
      }
    } catch (error: any) {
      const errorMessage = error.message || '카테고리별 예산을 불러오는데 실패했습니다.';
      setError(errorMessage);
      showErrorToast(errorMessage);
    }
  }, [setCategoryBudgets, setError]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryApi.getCategories();
      if (response.success && response.data) {
        setCategories(response.data.categories);
      } else {
        setError(response.message || '카테고리를 불러오는데 실패했습니다.');
        showErrorToast(response.message || '카테고리를 불러오는데 실패했습니다.');
      }
    } catch (error: any) {
      const errorMessage = error.message || '카테고리를 불러오는데 실패했습니다.';
      setError(errorMessage);
      showErrorToast(errorMessage);
    }
  }, [setCategories, setError]);

  // 커플 정보 조회
  const fetchCoupleInfo = useCallback(async () => {
    try {
      const response = await coupleApi.getCurrentCoupleInfo(true); // silent = true
      
      if (response.success && response.data) {
        setCoupleInfo(response.data);
        // 커플 정보에서 총 예산과 결혼 날짜 설정
        const formattedBudget = formatAmount(response.data.totalBudget.toString());
        setWeddingBudget(formattedBudget);
        const weddingDate = new Date(response.data.weddingDate);
        setTargetDate(weddingDate);
        setDaysUntilWedding(response.data.daysUntilWedding);
      } else {
        showErrorToast(response.message || '커플 정보를 불러오는데 실패했습니다.');
      }
    } catch (error: any) {
      showErrorToast(error.message || '커플 정보를 불러오는데 실패했습니다.');
    }
  }, []);

  // 페이지 진입 시 store 초기화 및 데이터 로드
  useEffect(() => {
    const initializePage = async () => {
      console.log('🚀 페이지 초기화 시작');
      
      // Store 상태 초기화
      setCategoryBudgets([]);
      setCategories([]);
      setError(null);
      setLoading(true);
      setCoupleLoading(true);
      
      // 입력 상태 초기화
      setCategoryBudgetInputs({});
      setRealtimeTotalBudget(0);
      setHasShownOverBudgetAlert(false);
      // 초기 로딩 시에는 변경사항이 없다고 설정 (데이터 로드 후 다시 설정됨)
      setHasChanges(false);
      
      console.log('📊 로딩 상태 설정됨:', { loading: true, coupleLoading: true });
      
      try {
        // 모든 데이터를 병렬로 로드
        await Promise.all([
          fetchCategoryBudgets(),
          fetchCategories(),
          fetchCoupleInfo()
        ]);
        console.log('✅ 모든 데이터 로드 완료');
      } catch (error) {
        console.error('❌ 페이지 초기화 중 오류:', error);
      } finally {
        console.log('🏁 로딩 상태 해제');
        setLoading(false);
        setCoupleLoading(false);
        setIsInitialLoading(false);
      }
    };

    initializePage();
  }, [fetchCategoryBudgets, fetchCategories, fetchCoupleInfo, setCategoryBudgets, setCategories, setError, setLoading]);

  // 카테고리 예산 데이터가 로드되면 입력 상태 초기화
  useEffect(() => {
    if (categoryBudgets.length > 0 && !loading) {
      const initialInputs: Record<number, string> = {};
      categoryBudgets.forEach(categoryBudget => {
        initialInputs[categoryBudget.categoryBudgetId] = formatCurrency(parseBigDecimal(categoryBudget.budgetAmount));
      });
      setCategoryBudgetInputs(initialInputs);
      
      // 초기 합계 계산
      const initialTotal = categoryBudgets.reduce((sum, cat) => {
        return sum + parseBigDecimal(cat.budgetAmount);
      }, 0);
      setRealtimeTotalBudget(initialTotal);
      
      // 초기 로딩 후에는 변경사항이 없다고 설정
      setHasChanges(false);
    }
  }, [categoryBudgets, loading]);

  // 커서 위치 복원
  useEffect(() => {
    if (weddingBudgetCursorPosition !== null && weddingBudgetInputRef.current) {
      weddingBudgetInputRef.current.setSelectionRange(weddingBudgetCursorPosition, weddingBudgetCursorPosition);
      setWeddingBudgetCursorPosition(null);
    }
  }, [weddingBudget, weddingBudgetCursorPosition]);

  // 카테고리 예산 입력값이 변경될 때마다 합계 업데이트
  useEffect(() => {
    // 초기 로딩 중이거나 categoryBudgets가 비어있으면 실행하지 않음
    if (loading || categoryBudgets.length === 0) return;
    
    // 실시간 합계 계산
    const newTotal = categoryBudgets.reduce((sum, cat) => {
      const currentBudgetInput = categoryBudgetInputs[cat.categoryBudgetId];
      const currentBudgetAmount = currentBudgetInput 
        ? parseBigDecimal(currentBudgetInput.replace(/[^\d]/g, ""))
        : parseBigDecimal(cat.budgetAmount);
      return sum + currentBudgetAmount;
    }, 0);
    
    console.log('카테고리 예산 입력값 변경:', categoryBudgetInputs);
    console.log('새로운 합계:', newTotal);
    
    setRealtimeTotalBudget(newTotal);
    
    // 총 결혼 예산 초과 체크 - 현재 입력된 총 결혼 예산과 비교
    const currentWeddingBudget = Number(weddingBudget.replace(/,/g, ""));
    if (currentWeddingBudget > 0 && newTotal > currentWeddingBudget) {
      if (!hasShownOverBudgetAlert) {
        showErrorToast("총 결혼 예산을 초과했습니다.");
        setHasShownOverBudgetAlert(true);
      }
    } else {
      // 예산이 초과되지 않으면 알림 상태 초기화
      setHasShownOverBudgetAlert(false);
    }
  }, [categoryBudgetInputs, categoryBudgets, loading, weddingBudget, hasShownOverBudgetAlert]);

  // 총 결혼 예산 변경 시 초과 여부 체크
  useEffect(() => {
    if (realtimeTotalBudget > 0 && weddingBudget) {
      const currentWeddingBudget = Number(weddingBudget.replace(/,/g, ""));
      const isOverBudget = realtimeTotalBudget > currentWeddingBudget;
      
      if (!isOverBudget && hasShownOverBudgetAlert) {
        setHasShownOverBudgetAlert(false);
      }
    }
  }, [weddingBudget, realtimeTotalBudget, hasShownOverBudgetAlert]);

  const handleAmountChange =
    (setter: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatAmount(e.target.value);
      setter(formatted);
    };

  // 총 결혼 예산 입력 처리 (커서 위치 유지) - 축의금관리 방식 적용
  const handleWeddingBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorPosition = input.selectionStart || 0;
    const oldValue = weddingBudget;
    const newValue = e.target.value;
    
    // 구분표를 제거한 숫자만 추출
    const oldNumber = oldValue.replace(/,/g, '');
    const newNumber = newValue.replace(/,/g, '');
    
    // 숫자가 변경된 경우에만 포맷팅
    if (oldNumber !== newNumber) {
      const formatted = formatAmount(newValue);
      setWeddingBudget(formatted);
      
      // 변경사항 감지 - 원래 값과 비교
      if (coupleInfo) {
        const originalAmount = formatAmount(coupleInfo.totalBudget.toString());
        const hasChanged = formatted !== originalAmount;
        setHasChanges(hasChanged);
      }
      
      // 커서 위치 계산 - 축의금관리 방식
      const oldFormatted = formatAmount(oldValue);
      const newFormatted = formatted;
      
      // 구분표 개수 차이 계산
      const oldCommas = (oldFormatted.match(/,/g) || []).length;
      const newCommas = (newFormatted.match(/,/g) || []).length;
      const commaDiff = newCommas - oldCommas;
      
      // 새로운 커서 위치 계산
      let newCursorPosition = cursorPosition + commaDiff;
      
      // 커서가 구분표 바로 뒤에 있는 경우 조정
      if (newFormatted[newCursorPosition] === ',') {
        newCursorPosition += 1;
      }
      
      // 커서 위치 저장
      setWeddingBudgetCursorPosition(newCursorPosition);
    } else {
      setWeddingBudget(newValue);
      setWeddingBudgetCursorPosition(cursorPosition);
    }
  };

  const handleCategoryBudgetChange = (categoryBudgetId: number, value: string) => {
    const formatted = formatAmount(value);
    setCategoryBudgetInputs(prev => ({
      ...prev,
      [categoryBudgetId]: formatted
    }));
    
    // 변경사항 감지 - 원래 값과 비교
    const categoryBudget = categoryBudgets.find(cb => cb.categoryBudgetId === categoryBudgetId);
    if (categoryBudget) {
      const originalAmount = formatCurrency(parseBigDecimal(categoryBudget.budgetAmount));
      const hasChanged = formatted !== originalAmount;
      setHasChanges(hasChanged);
    }
  };

  const handleSave = async () => {
    try {
      // 커플 정보 수정 (총 예산과 결혼 날짜)
      if (coupleInfo) {
        const weddingBudgetNumber = Number(weddingBudget.replace(/,/g, ""));
        const weddingDateString = format(targetDate, "yyyy-MM-dd");
        
        // 커플 정보가 변경된 경우에만 API 호출
        if (coupleInfo.totalBudget !== weddingBudgetNumber || 
            coupleInfo.weddingDate !== weddingDateString) {
          
          const coupleResponse = await coupleApi.updateCurrentCoupleInfo({
            weddingDate: weddingDateString,
            totalBudget: weddingBudgetNumber
          });
          
          if (coupleResponse.success && coupleResponse.data) {
            setCoupleInfo(coupleResponse.data);
          } else {
            showErrorToast(coupleResponse.message || "커플 정보 업데이트에 실패했습니다.");
            return;
          }
        }
      }
      
      // 카테고리별 예산 수정
      const updatePromises = Object.entries(categoryBudgetInputs).map(async ([categoryBudgetId, value]) => {
        const categoryBudget = categoryBudgets.find(cb => cb.categoryBudgetId === parseInt(categoryBudgetId));
        if (categoryBudget) {
          const currentAmount = formatCurrency(parseBigDecimal(categoryBudget.budgetAmount));
          const newAmount = value;
          
          if (currentAmount !== newAmount) {
            const amount = newAmount.replace(/[^\d]/g, "");
            if (amount) {
              return budgetApi.updateCategoryBudget(parseInt(categoryBudgetId), {
                budgetAmount: toBigDecimal(parseInt(amount))
              });
            }
          }
        }
        return null;
      });
      
      const results = await Promise.all(updatePromises);
      const failedUpdates = results.filter((result: any) => result && !result.success);
      
      if (failedUpdates.length > 0) {
        showErrorToast("일부 예산 업데이트에 실패했습니다.");
        return;
      }
      
      // 카테고리 예산 목록 새로고침
      await fetchCategoryBudgets();
      
      // 성공적으로 저장된 경우 상태 초기화
      setHasChanges(false);
      
      showSuccessToast("예산 설정이 저장되었습니다!");
      
    } catch (error: any) {
      showErrorToast(error.message || "예산 설정 저장에 실패했습니다.");
    }
  };

  // 예산 추가 모달 상태
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [isAddingBudget, setIsAddingBudget] = useState(false);

  // 예산이 설정되지 않은 카테고리 필터링
  const availableCategories = categories.filter(category => {
    return !categoryBudgets.some(budget => budget.categoryId === category.financeCategoryId);
  });

  // 디버깅용 로그 추가
  console.log('전체 카테고리:', categories);
  console.log('설정된 예산:', categoryBudgets);
  console.log('사용 가능한 카테고리:', availableCategories);

  const handleAddCategory = async () => {
          if (!selectedCategoryId) {
        showErrorToast("카테고리를 선택해주세요.");
        return;
      }

      if (!budgetAmount || budgetAmount.replace(/[^\d]/g, "") === "") {
        showErrorToast("예산 금액을 입력해주세요.");
        return;
      }

    try {
      setIsAddingBudget(true);
      const amount = budgetAmount.replace(/[^\d]/g, "");
      
      const response = await budgetApi.createCategoryBudget({
        categoryId: selectedCategoryId,
        budgetAmount: toBigDecimal(parseInt(amount))
      });

      if (response.success && response.data) {
        showSuccessToast("예산이 추가되었습니다!");
        setIsModalOpen(false);
        setSelectedCategoryId(null);
        setBudgetAmount("");
        
        // 카테고리 예산 목록 새로고침
        await fetchCategoryBudgets();
      } else {
        showErrorToast(response.message || "예산 추가에 실패했습니다.");
      }
    } catch (error: any) {
      showErrorToast(error.message || "예산 추가에 실패했습니다.");
    } finally {
      setIsAddingBudget(false);
    }
  };

  const handleDeleteCategory = async (categoryBudgetId: number) => {
    console.log('🗑️ 삭제 버튼 클릭됨:', categoryBudgetId);
    
    // 삭제 확인 다이얼로그
    const result = await showConfirmDialog({
      title: "예산 삭제",
      text: "이 예산을 삭제하시겠습니까?",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      showCancelButton: true
    });
    
    if (!result.isConfirmed) {
      console.log('❌ 삭제 취소됨');
      return;
    }
    
    try {
      console.log('🚀 삭제 API 호출 시작:', categoryBudgetId);
      const response = await budgetApi.deleteCategoryBudget(categoryBudgetId);
      console.log('📡 삭제 API 응답:', response);
      
      if (response.success) {
        showSuccessToast("예산이 삭제되었습니다!");
        await fetchCategoryBudgets(); // 목록 새로고침
      } else {
        showErrorToast(response.message || "예산 삭제에 실패했습니다.");
      }
    } catch (error: any) {
      console.error('❌ 삭제 에러:', error);
      showErrorToast(error.message || "예산 삭제에 실패했습니다.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // 모달 상태 초기화
    setSelectedCategoryId(null);
    setBudgetAmount("");
    setIsAddingBudget(false);
  };

  const totalCurrentSpent = categoryBudgets.reduce(
    (sum, cat) => sum + parseBigDecimal(cat.spentAmount),
    0
  );
  
  // 실시간 합계 사용 (realtimeTotalBudget이 있으면 사용, 없으면 기존 로직 사용)
  const totalTargetBudget = realtimeTotalBudget > 0 ? realtimeTotalBudget : categoryBudgets.reduce((sum, cat) => {
    const currentBudgetInput = categoryBudgetInputs[cat.categoryBudgetId];
    const currentBudgetAmount = currentBudgetInput 
      ? parseBigDecimal(currentBudgetInput.replace(/[^\d]/g, ""))
      : parseBigDecimal(cat.budgetAmount);
    return sum + currentBudgetAmount;
  }, 0);

  // 로딩 중일 때 전체 페이지를 로딩 화면으로 덮기
  console.log('🔍 로딩 상태 확인:', { loading, coupleLoading, isInitialLoading, categoryBudgets: categoryBudgets.length, categories: categories.length, coupleInfo: !!coupleInfo });
  
  if (loading || coupleLoading || isInitialLoading) {
    console.log('🔄 로딩 화면 표시');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008485] mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: "Hana2-CM" }}>
            데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="absolute left-4"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl" style={{ fontFamily: "Hana2-CM" }}>
              예산 설정
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Main Budget Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 결혼식 예산 설정 */}
          <Card>
            <CardHeader>
              <h1
                className="text-2xl flex items-center gap-2"
                style={{ fontFamily: "Hana2-CM" }}
              >
                {/* <Heart className="w-5 h-5 text-pink-500" /> */}
                결혼 예산 설정
              </h1>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="wedding-budget" className="text-sm">
                    총 결혼 예산
                  </Label>
                  <div className="relative w-32">
                    <Input
                      ref={weddingBudgetInputRef}
                      id="wedding-budget"
                      type="text"
                      value={weddingBudget}
                      onChange={handleWeddingBudgetChange}
                      className="text-right pr-8"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      원
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    현재 카테고리별 목표 합계
                  </span>
                  <span 
                    className={`font-medium ${
                      realtimeTotalBudget > 0 && Number(weddingBudget.replace(/,/g, "")) > 0 && 
                      realtimeTotalBudget > Number(weddingBudget.replace(/,/g, ""))
                        ? 'text-red-600' 
                        : 'text-black'
                    }`}
                  >
                    {realtimeTotalBudget > 0 ? realtimeTotalBudget.toLocaleString() : (coupleInfo ? formatCurrency(coupleInfo.totalBudget) : '0')}원
                  </span>
                </div>
                <div className="mt-4">
                                  <Progress
                  value={realtimeTotalBudget > 0 
                    ? (totalCurrentSpent / realtimeTotalBudget) * 100
                    : (coupleInfo ? (totalCurrentSpent / coupleInfo.totalBudget) * 100 : 0)
                  }
                  className="h-2"
                  color="#008485"
                  backgroundColor="#0084854D"
                />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  현재 지출: {totalCurrentSpent.toLocaleString()}원 /{" "}
                  {realtimeTotalBudget > 0 ? realtimeTotalBudget.toLocaleString() : (coupleInfo ? formatCurrency(coupleInfo.totalBudget) : '0')}원
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 결혼식 예정일 설정 */}
          <Card>
            <CardHeader>
              <h1
                className="text-2xl flex items-center gap-2 "
                style={{ fontFamily: "Hana2-CM" }}
              >
                {/* <CalendarIcon className="w-5 h-5 text-[#008485]" />*/}결혼
                예정일
              </h1>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="relative mt-2">
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {targetDate
                          ? format(targetDate, "yyyy년 MM월 dd일", {
                              locale: ko,
                            })
                          : coupleInfo
                          ? format(new Date(coupleInfo.weddingDate), "yyyy년 MM월 dd일", {
                              locale: ko,
                            })
                          : "날짜를 선택하세요"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={targetDate}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            setTargetDate(selectedDate);
                            const newDaysUntilWedding = calculateDaysUntilWedding(selectedDate);
                            setDaysUntilWedding(newDaysUntilWedding);
                            setIsCalendarOpen(false);
                            
                            // 변경사항 감지 - 원래 날짜와 비교
                            if (coupleInfo) {
                              const originalDate = new Date(coupleInfo.weddingDate);
                              const hasChanged = selectedDate.getTime() !== originalDate.getTime();
                              setHasChanges(hasChanged);
                            }
                            
                            console.log('선택된 날짜:', selectedDate);
                            console.log('남은 일수:', newDaysUntilWedding);
                          }
                        }}
                        disabled={(date) => {
                          // 오늘 날짜 이전은 선택 불가
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  목표일까지{" "}
                  <span className="font-medium">
                    {daysUntilWedding}
                  </span>
                  일 남았습니다
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Budget Settings */}
        <Card>
          <div className="flex items-center justify-between">
            <CardHeader>
              <h1
                className="text-2xl flex items-center gap-2"
                style={{ fontFamily: "Hana2-CM" }}
              >
                카테고리별 예산 설정
              </h1>
              <p className="text-sm text-gray-600">
                각 카테고리별로 지출 목표를 설정하세요
              </p>
            </CardHeader>
            <CardHeader>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#008485] hover:bg-[#e05274] text-white flex items-center px-4 py-2 rounded transition-colors duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    예산 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle style={{ fontFamily: "Hana2-CM", fontSize: "1.5rem" }}>
                      예산 추가
                    </DialogTitle>
                    <DialogDescription>
                      카테고리를 선택하고 예산을 설정하세요.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* 카테고리 선택 */}
                    <div className="space-y-2">
                      <Label htmlFor="category-select">카테고리</Label>
                      <Select
                        value={selectedCategoryId?.toString() || ""}
                        onValueChange={(value) => setSelectedCategoryId(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCategories.length === 0 ? (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              추가할 수 있는 카테고리가 없습니다
                            </div>
                          ) : (
                            availableCategories.map((category) => {
                              return (
                                <SelectItem key={category.financeCategoryId} value={category.financeCategoryId.toString()}>
                                  <span>{category.name}</span>
                                  {category.isDefault && (
                                    <span className="text-xs text-gray-500 ml-1">(기본)</span>
                                  )}
                                </SelectItem>
                              );
                            })
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 예산 금액 입력 */}
                    <div className="space-y-2">
                      <Label htmlFor="budget-amount">예산 금액</Label>
                      <div className="relative">
                        <Input
                          id="budget-amount"
                          type="text"
                          value={budgetAmount}
                          onChange={(e) => setBudgetAmount(formatAmount(e.target.value))}
                          placeholder="예산 금액을 입력하세요"
                          className="text-right pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          원
                        </span>
                      </div>
                    </div>


                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      onClick={handleModalClose}
                      disabled={isAddingBudget}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleAddCategory}
                      disabled={!selectedCategoryId || !budgetAmount || isAddingBudget}
                      style={{ backgroundColor: "#008485" }}
                      className="text-white hover:bg-[#e05274] disabled:bg-gray-400"
                    >
                      {isAddingBudget ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          추가 중...
                        </>
                      ) : (
                        "추가"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
          </div>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryBudgets.length === 0 ? (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500">설정된 예산이 없습니다.</p>
                </div>
              ) : (
                categoryBudgets.map((categoryBudget) => {
                  // FinanceCategoryIcon 컴포넌트 사용
                  const color = categoryColorMap[categoryBudget.categoryName] || "bg-gray-100 text-gray-600";
                  const spentAmount = parseBigDecimal(categoryBudget.spentAmount);
                  const budgetAmount = parseBigDecimal(categoryBudget.budgetAmount);
                  
                  // 입력된 값이 있으면 그 값을 사용, 없으면 원래 예산 사용
                  const currentBudgetInput = categoryBudgetInputs[categoryBudget.categoryBudgetId];
                  const currentBudgetAmount = currentBudgetInput 
                    ? parseBigDecimal(currentBudgetInput.replace(/[^\d]/g, ""))
                    : budgetAmount;
                  
                  const percentage = currentBudgetAmount > 0 ? (spentAmount / currentBudgetAmount) * 100 : 0;

                  return (
                    <div
                      key={categoryBudget.categoryBudgetId}
                      className="p-4 border rounded-lg space-y-3 relative"
                    >


                      <div className="flex items-center gap-3">
                        <FinanceCategoryIcon 
                          iconName={categoryBudget.iconName} 
                          colorName={categoryBudget.colorName}
                          size={32}
                        />
                        <div className="flex-1">
                          <h3 style={{ fontFamily: "Hana2-CM" }}>{categoryBudget.categoryName}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                          onClick={() => handleDeleteCategory(categoryBudget.categoryBudgetId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div>
                        <div className="flex justify-between items-center">
                          <Label
                            htmlFor={`budget-${categoryBudget.categoryBudgetId}`}
                            className="text-sm"
                          >
                            목표 예산
                          </Label>
                          <div className="relative w-32">
                            <Input
                              id={`budget-${categoryBudget.categoryBudgetId}`}
                              type="text"
                              value={categoryBudgetInputs[categoryBudget.categoryBudgetId] || formatCurrency(budgetAmount)}
                              onChange={(e) =>
                                handleCategoryBudgetChange(
                                  categoryBudget.categoryBudgetId,
                                  e.target.value
                                )
                              }
                              className="text-right pr-8"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                              원
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 현재 사용 금액 표시 */}
                      <div className="mt-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-black">현재 사용</span>
                          <span className="font-medium text-black">
                            {formatCurrency(spentAmount)}원
                          </span>
                        </div>
                      </div>

                      {/* 진행률 표시 */}
                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 whitespace-nowrap">
                            {Math.round(percentage)}%
                          </span>
                          <div className="flex-1">
                            <Progress 
                              value={percentage} 
                              className="h-2" 
                              color="#008485"
                              backgroundColor="#0084854D"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="sticky bottom-4">
          <Button
            onClick={handleSave}
            className={`w-full py-4 text-lg text-white transition-all duration-300 ${
              hasChanges 
                ? 'bg-[#008485] hover:bg-[#006d6e] shadow-lg' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            style={{ fontFamily: "Hana2-CM" }}
            disabled={!hasChanges}
          >
            <Save className="mr-1" />
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
