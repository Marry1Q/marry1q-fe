import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  ChevronLeft,
  CalendarIcon,
  Gift,
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { colors } from "@/constants/colors";
import { toast } from "sonner";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { PinkButton } from "@/components/ui/PinkButton";

const relationships = [
  { id: "family", name: "가족", color: "bg-red-100 text-red-600" },
  { id: "relative", name: "친척", color: "bg-orange-100 text-orange-600" },
  { id: "friend", name: "친구", color: "bg-blue-100 text-blue-600" },
  { id: "colleague", name: "회사동료", color: "bg-purple-100 text-purple-600" },
  { id: "acquaintance", name: "지인", color: "bg-green-100 text-green-600" },
  { id: "other", name: "기타", color: "bg-gray-100 text-gray-600" },
];

const sources = [
  { id: "cash", name: "현금" },
  { id: "transfer", name: "계좌이체" },
  { id: "mobile", name: "모바일페이" },
  { id: "other", name: "기타" },
];

const formatAmount = (value: string) => {
  const number = value.replace(/[^\d]/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

interface GiftMoneyFormProps {
  isEditMode?: boolean;
  initialData?: {
    id?: number;
    name: string;
    amount: string;
    relationship: string;
    source: string;
    phone: string;
    address: string;
    memo: string;
    date: Date;
    thanksCompleted?: boolean;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
}

export function GiftMoneyForm({ 
  isEditMode = false, 
  initialData, 
  onSubmit, 
  onCancel,
  onDelete,
  isSubmitting = false
}: GiftMoneyFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [amount, setAmount] = useState(initialData?.amount || "");
  const [relationship, setRelationship] = useState(initialData?.relationship || "");
  const [source, setSource] = useState(initialData?.source || "cash");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [memo, setMemo] = useState(initialData?.memo || "");
  const [date, setDate] = useState<Date>(initialData?.date || new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [thanksCompleted, setThanksCompleted] = useState(initialData?.thanksCompleted ?? false);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const [amountCursorPosition, setAmountCursorPosition] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !amount || !relationship) {
      toast.error("필수 항목을 모두 입력해주세요.", {
        style: {
          background: colors.danger.light,
          color: colors.danger.main,
          border: `1px solid ${colors.danger.main}`,
          fontFamily: "Hana2-Medium",
        },
      });
      return;
    }

    const formData = {
      name,
      amount: Number(amount.replace(/,/g, "")),
      relationship,
      source,
      phone,
      address,
      memo,
      date,
      thanksCompleted,
    };

    onSubmit(formData);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorPosition = input.selectionStart || 0;
    const oldValue = amount;
    const newValue = e.target.value;
    
    // 구분표를 제거한 숫자만 추출
    const oldNumber = oldValue.replace(/,/g, '');
    const newNumber = newValue.replace(/,/g, '');
    
    // 숫자가 변경된 경우에만 포맷팅
    if (oldNumber !== newNumber) {
      const formatted = formatAmount(newValue);
      setAmount(formatted);
      
      // 커서 위치 계산
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
      setAmountCursorPosition(newCursorPosition);
    } else {
      setAmount(newValue);
      setAmountCursorPosition(cursorPosition);
    }
  };

  // 커서 위치 복원
  useEffect(() => {
    if (amountCursorPosition !== null && amountInputRef.current) {
      amountInputRef.current.setSelectionRange(amountCursorPosition, amountCursorPosition);
      setAmountCursorPosition(null);
    }
  }, [amount, amountCursorPosition]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="absolute left-4"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
            <h1 className="text-2xl" style={{ fontFamily: "Hana2-CM" }}>
              {isEditMode ? "축의금 수정" : "축의금 등록"}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <Card>
            <CardHeader>
              <h2 className="text-xl" style={{ fontFamily: "Hana2-CM" }}>
                축의금을 주신 분의 이름 *
              </h2>
            </CardHeader>
            <CardContent>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                required
              />
            </CardContent>
          </Card>

          {/* Amount */}
          <Card>
            <CardHeader>
              <h2 className="text-xl" style={{ fontFamily: "Hana2-CM" }}>
                축의금 금액 *
              </h2>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  ref={amountInputRef}
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

          {/* Relationship */}
          <Card>
            <CardHeader>
              <h2 className="text-xl" style={{ fontFamily: "Hana2-CM" }}>
                관계 *
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {relationships.map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => setRelationship(rel.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      relationship === rel.id
                        ? "border-[#008485] bg-[#008485]/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full ${rel.color} flex items-center justify-center mx-auto mb-2`}
                    >
                      <Gift className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{rel.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Source */}
          <Card>
            <CardHeader>
              <h2 className="text-xl" style={{ fontFamily: "Hana2-CM" }}>
                받은 방법
              </h2>
            </CardHeader>
            <CardContent>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue placeholder="받은 방법을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((sourceItem) => (
                    <SelectItem key={sourceItem.id} value={sourceItem.id}>
                      {sourceItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Date */}
          <Card>
            <CardHeader>
              <h2 className="text-xl" style={{ fontFamily: "Hana2-CM" }}>
                받은 날짜
              </h2>
            </CardHeader>
            <CardContent>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date
                      ? format(date, "yyyy년 MM월 dd일", { locale: ko })
                      : "날짜를 선택하세요"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setDate(selectedDate);
                        setIsCalendarOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          {/* Phone */}
          <Card>
            <CardHeader>
              <h2 className="text-xl" style={{ fontFamily: "Hana2-CM" }}>
                연락처
              </h2>
            </CardHeader>
            <CardContent>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
              />
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <h2 className="text-xl" style={{ fontFamily: "Hana2-CM" }}>
                주소
              </h2>
            </CardHeader>
            <CardContent>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="주소를 입력하세요"
              />
            </CardContent>
          </Card>

          {/* Thanks Completed */}
          <Card className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-xl" style={{ fontFamily: "Hana2-CM" }}>
                감사인사 완료여부
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {thanksCompleted ? "완료" : "미완료"}
              </span>
              <Switch
                checked={thanksCompleted}
                onCheckedChange={setThanksCompleted}
              />
            </div>
          </Card>

          {/* Memo */}
          <Card>
            <CardHeader>
              <h2 className="text-xl" style={{ fontFamily: "Hana2-CM" }}>
                메모
              </h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="축하 메시지나 기타 메모를 입력하세요"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="sticky bottom-4">
            {isEditMode && onDelete ? (
              <div className="grid grid-cols-2 gap-3">
                <PinkButton
                  type="button"
                  text="삭제"
                  onClick={onDelete}
                />
                
                <SubmitButton
                  disabled={!name || !amount || !relationship || isSubmitting}
                >
                  {isSubmitting ? "처리 중..." : (isEditMode ? "수정" : "등록") + " 완료"}
                </SubmitButton>
              </div>
            ) : (
              <SubmitButton
                disabled={!name || !amount || !relationship || isSubmitting}
              >
                {isSubmitting ? "처리 중..." : (isEditMode ? "수정" : "등록") + " 완료"}
              </SubmitButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 