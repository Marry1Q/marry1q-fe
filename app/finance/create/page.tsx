"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronLeft,
  Plus,
  Minus,
  Home,
  Car,
  ShoppingBag,
  Coffee,
  Heart,
  Utensils,
  Gamepad2,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Gift,
  Camera,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import { useSearchParams, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import { colors } from "@/constants/colors";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { financeApi, FinanceCategory } from "@/features/finance/api/financeApi";
import { AddCategoryDialog } from "@/components/ui/AddCategoryDialog";
import { Calendar24 } from "@/components/ui/Calendar24";
import { coupleApi } from "@/lib/api/coupleApi";
import { authApi } from "@/lib/api/authApi";
import { FinanceCategoryIcon } from "@/components/ui/FinanceCategoryIcon";

// 카테고리 아이콘 매핑
const categoryIconMap: Record<string, any> = {
  "웨딩홀": Heart,
  "드레스": ShoppingBag,
  "스튜디오": Camera,
  "식비": Utensils,
  "교통비": Car,
  "쇼핑": ShoppingBag,
  "주거비": Home,
  "카페": Coffee,
  "오락": Gamepad2,
  "업무": Briefcase,
  "교육": GraduationCap,
  "의료": Stethoscope,
  "선물": Gift,
  "결혼준비": Heart,
};

// 카테고리 색상 매핑
const categoryColorMap: Record<string, string> = {
  "웨딩홀": "bg-pink-100 text-pink-600",
  "드레스": "bg-purple-100 text-purple-600",
  "스튜디오": "bg-blue-100 text-blue-600",
  "식비": "bg-orange-100 text-orange-600",
  "교통비": "bg-blue-100 text-blue-600",
  "쇼핑": "bg-purple-100 text-purple-600",
  "주거비": "bg-red-100 text-red-600",
  "카페": "bg-amber-100 text-amber-600",
  "오락": "bg-pink-100 text-pink-600",
  "업무": "bg-gray-100 text-gray-600",
  "교육": "bg-indigo-100 text-indigo-600",
  "의료": "bg-green-100 text-green-600",
  "선물": "bg-rose-100 text-rose-600",
  "결혼준비": "bg-pink-100 text-pink-600",
};

const formatAmount = (value: string) => {
  const number = value.replace(/[^\d]/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function AddTransactionPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEditMode = pathname.startsWith("/finance/edit/");
  const editId = isEditMode ? pathname.split("/").pop() : null;
  
  // 리뷰 대기 거래내역에서 가져온 데이터 확인
  const reviewId = searchParams.get('reviewId');
  const reviewAmount = searchParams.get('amount');
  const reviewDescription = searchParams.get('description');
  const reviewType = searchParams.get('type');
  const reviewDate = searchParams.get('date');
  const reviewTime = searchParams.get('time');
  const reviewMemo = searchParams.get('memo');
  const reviewFromName = searchParams.get('fromName');
  const reviewToName = searchParams.get('toName');

  // 수정할 거래 내역 데이터 (실제로는 API에서 가져와야 함)
  const editTransaction = editId
    ? {
        id: Number(editId),
        type: "expense",
        amount: "8500",
        description: "스타벅스 커피",
        category: "cafe",
        memo: "회의 중 커피",
        date: new Date("2024-01-15"),
        user: "김민수",
      }
    : null;

  // 디버깅: 받은 파라미터 확인
  console.log('📥 가계부 작성 페이지 - 받은 파라미터:', {
    reviewId,
    reviewAmount,
    reviewDescription,
    reviewType,
    reviewDate,
    reviewTime,
    reviewMemo,
    reviewFromName,
    reviewToName
  });

  // 리뷰 데이터가 있으면 해당 데이터로 초기화, 없으면 기본값 사용
  const initialType = reviewType === 'deposit' ? 'income' : (reviewType === 'withdraw' ? 'expense' : (isEditMode ? editTransaction?.type || "expense" : "expense"));
  const initialAmount = reviewAmount ? formatAmount(reviewAmount) : (isEditMode ? formatAmount(editTransaction?.amount || "") : "");
  const initialDescription = reviewDescription || (isEditMode ? editTransaction?.description || "" : "");
  const initialMemo = reviewMemo || (isEditMode ? editTransaction?.memo || "" : "");
  
  // 날짜와 시간을 안전하게 처리
  let initialDate = new Date();
  if (reviewDate && reviewTime) {
    // ISO 형식으로 변환: "2025-09-16T11:03:44"
    const isoString = `${reviewDate}T${reviewTime}`;
    initialDate = new Date(isoString);
    
    // 날짜가 유효하지 않은 경우 현재 시간으로 대체
    if (isNaN(initialDate.getTime())) {
      console.warn('⚠️ 잘못된 날짜 형식, 현재 시간으로 대체:', isoString);
      initialDate = new Date();
    }
  } else if (isEditMode && editTransaction?.date) {
    initialDate = editTransaction.date;
  }
  
  const initialUser = isEditMode ? editTransaction?.user || "" : ""; // 빈 문자열로 시작

  console.log('📅 초기 날짜 설정:', {
    reviewDate,
    reviewTime,
    isoString: reviewDate && reviewTime ? `${reviewDate}T${reviewTime}` : null,
    initialDate: initialDate.toISOString(),
    isValidDate: !isNaN(initialDate.getTime()),
    hasTime: !!reviewTime
  });

  const [transactionType, setTransactionType] = useState(initialType);
  const [amount, setAmount] = useState(initialAmount);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState(
    isEditMode ? editTransaction?.category || "" : ""
  );
  const [memo, setMemo] = useState(initialMemo);
  const [date, setDate] = useState<Date>(initialDate);
  const [user, setUser] = useState(initialUser);
  
  // 카테고리 상태
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  // 커플 멤버 상태
  const [coupleMembers, setCoupleMembers] = useState<string[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [currentUserName, setCurrentUserName] = useState<string>("");

  // 전체 로딩 상태
  const isInitialLoading = isLoadingCategories || isLoadingMembers;

  // 카테고리 목록 불러오기
  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await financeApi.getCategories();
      
      if (response.success && response.data) {
        setCategories(response.data.categories);
      } else {
        showErrorToast("카테고리 목록을 불러오는데 실패했습니다.");
      }
    } catch (error: any) {
      console.error("카테고리 목록 조회 실패:", error);
      showErrorToast("카테고리 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // 현재 로그인한 사용자 정보 불러오기
  const loadCurrentUserInfo = async () => {
    try {
      console.log("현재 사용자 정보 조회 시작");
      const response = await authApi.getMyInfo();
      
      if (response.success && response.data) {
        console.log("현재 사용자 정보:", response.data);
        setCurrentUserName(response.data.customerName);
        // 현재 사용자 이름을 기본값으로 설정 (수정 모드가 아니거나 사용자가 선택되지 않은 경우)
        if (!isEditMode || !user) {
          console.log("사용자 기본값 설정:", response.data.customerName);
          setUser(response.data.customerName);
        } else {
          console.log("사용자 기본값 설정 안함 - isEditMode:", isEditMode, "user:", user);
        }
      }
    } catch (error: any) {
      console.error("현재 사용자 정보 조회 실패:", error);
    }
  };

  // 커플 멤버 목록 불러오기
  const loadCoupleMembers = async () => {
    try {
      setIsLoadingMembers(true);
      const response = await coupleApi.getCurrentCoupleInfo(true) // silent = true;
      
      if (response.success && response.data) {
        setCoupleMembers(response.data.memberNames || []);
      } else {
        showErrorToast("커플 정보를 불러오는데 실패했습니다.");
      }
    } catch (error: any) {
      console.error("커플 정보 조회 실패:", error);
      showErrorToast("커플 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoadingMembers(false);
    }
  };

  // 카테고리 추가 후 목록 새로고침
  const handleCategoryAdded = () => {
    loadCategories();
  };

  useEffect(() => {
    const initializeData = async () => {
      await loadCategories();
      await loadCoupleMembers();
      await loadCurrentUserInfo();
    };
    
    initializeData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 데이터 준비
    const transactionData = {
      amount: amount.replace(/,/g, ""), // string으로 전송 (BigDecimal)
      transactionType: transactionType.toUpperCase() as 'INCOME' | 'EXPENSE',
      description,
      memo,
      transactionDate: format(date, 'yyyy-MM-dd'),
      transactionTime: format(date, 'HH:mm:ss'), // string 형식으로 전송
      categoryId: category ? parseInt(category) : 1 // 기본값 1로 설정
    };

    if (isEditMode) {
      console.log("내역 수정:", { id: editId, ...transactionData });
      showSuccessToast("수정 완료!");
    } else {
      try {
        console.log("내역 추가 API 호출:", transactionData);
        
        // 거래내역 생성 API 호출
        const response = await financeApi.createTransaction(transactionData);
        
        if (response.success) {
          // 리뷰 대기 거래내역에서 가져온 데이터인 경우 리뷰 상태 변경
          if (reviewId) {
            console.log("리뷰 상태 변경:", {
              reviewId,
              reviewStatus: 'reviewed',
              categoryId: category ? parseInt(category) : undefined,
              memo
            });
            
            // 리뷰 상태 변경 API 호출
            await financeApi.updateTransactionReviewStatus(parseInt(reviewId), {
              reviewStatus: 'reviewed',
              categoryId: category ? parseInt(category) : undefined,
              memo
            });
          }
          
          showSuccessToast("추가 완료!");
          
          window.history.back();
        } else {
          showErrorToast(response.message || "거래내역 추가에 실패했습니다.");
        }
      } catch (error: any) {
        console.error("거래내역 추가 실패:", error);
        showErrorToast(error.message || "거래내역 추가에 실패했습니다.");
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value);
    setAmount(formatted);
  };

  // 카테고리 아이콘과 색상 가져오기
  const getCategoryIcon = (categoryName: string) => {
    return categoryIconMap[categoryName] || MoreHorizontal;
  };

  const getCategoryColor = (categoryName: string) => {
    return categoryColorMap[categoryName] || "bg-gray-100 text-gray-600";
  };

  // 로딩 중일 때 전체 페이지를 로딩 화면으로 덮기
  if (isInitialLoading) {
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
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="absolute left-4"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
            <h1 className="text-2xl" style={{ fontFamily: "Hana2-CM" }}>
              {" "}
              {isEditMode ? "내역 수정" : "내역 추가"}{" "}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">


        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <Card>
            <CardHeader>
              <h1 className="text-2xl" style={{ fontFamily: "Hana2-CM" }}>
                거래 유형
              </h1>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={transactionType}
                onValueChange={setTransactionType}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label
                    htmlFor="expense"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Minus className="w-4 h-4 text-red-500" />
                    지출
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label
                    htmlFor="income"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-green-500" />
                    수입
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Amount */}
          <Card>
            <CardHeader>
              <h1 className="text-2xl" style={{ fontFamily: "Hana2-CM" }}>
                금액
              </h1>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="text-2xl font-bold text-right pr-8"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  원
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <h1 className="text-2xl" style={{ fontFamily: "Hana2-CM" }}>
                내용
              </h1>{" "}
            </CardHeader>
            <CardContent>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="거래 내용을 입력하세요"
                required
              />
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl" style={{ fontFamily: "Hana2-CM" }}>
                  카테고리
                </h1>
                <AddCategoryDialog onCategoryAdded={handleCategoryAdded} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingCategories ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">카테고리를 불러오는 중...</div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {categories.map((cat) => {
                    return (
                      <button
                        key={cat.financeCategoryId}
                        type="button"
                        onClick={() => setCategory(cat.financeCategoryId.toString())}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          category === cat.financeCategoryId.toString()
                            ? "border-[#008485] bg-[#008485]/10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-center mx-auto mb-2">
                          <FinanceCategoryIcon
                            iconName={cat.iconName}
                            colorName={cat.colorName}
                            size={32}
                            variant="display"
                          />
                        </div>
                        <span className="text-sm font-medium">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date */}
          <Card>
            <CardHeader>
              <h1 className="text-2xl" style={{ fontFamily: "Hana2-CM" }}>
                날짜 및 시간
              </h1>
            </CardHeader>
            <CardContent>
              <Calendar24
                date={date}
                time={reviewTime || undefined}
                onDateChange={setDate}
                onTimeChange={(time) => {
                  // 시간 변경은 onDateChange에서 이미 처리됨
                }}
              />
            </CardContent>
          </Card>

          {/* User */}
          <Card>
            <CardHeader>
              <h1 className="text-2xl" style={{ fontFamily: "Hana2-CM" }}>
                사용자
              </h1>
            </CardHeader>
            <CardContent>
              {isLoadingMembers ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-gray-500">사용자 목록을 불러오는 중...</div>
                </div>
              ) : (
                <Select value={user} onValueChange={setUser} required>
                  <SelectTrigger>
                    <SelectValue placeholder="사용자를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {coupleMembers.map((memberName) => (
                      <SelectItem key={memberName} value={memberName}>
                        {memberName}
                      </SelectItem>
                    ))}
                    <SelectItem value="공동">공동</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          {/* Memo */}
          <Card>
            <CardHeader>
              <h1 className="text-2xl" style={{ fontFamily: "Hana2-CM" }}>
                메모
              </h1>
            </CardHeader>
            <CardContent>
              <Textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="(선택사항) 추가 메모를 입력하세요"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="sticky bottom-4">
            <SubmitButton
              disabled={!amount || !description || !category || !user}
            >
              {isEditMode
                ? "수정"
                : transactionType === "expense"
                ? "지출"
                : "수입"}{" "}
              {isEditMode ? "완료" : "추가하기"}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
