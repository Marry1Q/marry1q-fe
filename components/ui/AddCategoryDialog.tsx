import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { colors } from "@/constants/colors";
import { financeApi } from "@/features/finance/api/financeApi";
import { IconSelector } from "./IconSelector";
import { ColorSelector } from "./ColorSelector";
import { FinanceCategoryIcon } from "./FinanceCategoryIcon";
import { iconDefaultColors } from "@/lib/financeCategoryIcons";

interface AddCategoryDialogProps {
  onCategoryAdded: () => void;
}

export function AddCategoryDialog({ onCategoryAdded }: AddCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("mint"); // 초기 색상을 mint로 설정
  const [isLoading, setIsLoading] = useState(false);

  // 아이콘 선택 시 색상 자동 변경 제거
  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    // 색상 자동 변경 로직 제거 - 사용자가 선택한 색상 유지
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // 이벤트 버블링 방지
    
    if (!categoryName.trim()) {
      toast.error("카테고리 이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    
    try {
      // 아이콘이 선택되었지만 색상이 선택되지 않은 경우, 아이콘의 기본 색상 사용
      let finalColor = selectedColor;
      if (selectedIcon && !selectedColor && iconDefaultColors[selectedIcon as keyof typeof iconDefaultColors]) {
        finalColor = iconDefaultColors[selectedIcon as keyof typeof iconDefaultColors];
      }

      const response = await financeApi.createCategory({
        name: categoryName.trim(),
        iconName: selectedIcon || undefined,
        colorName: finalColor || "mint" // 기본 색상으로 mint 사용
      });
      
      if (response.success) {
        toast.success("카테고리가 추가되었습니다!", {
          style: {
            background: colors.primary.toastBg,
            color: colors.primary.main,
            border: `1px solid ${colors.primary.main}`,
            fontFamily: "Hana2-Medium",
          },
        });
        
        // 폼 초기화
        setCategoryName("");
        setSelectedIcon("");
        setSelectedColor("");
        setIsOpen(false);
        onCategoryAdded();
      } else {
        toast.error(response.message || "카테고리 추가에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("카테고리 추가 실패:", error);
      console.log("에러 타입:", typeof error);
      console.log("에러 메시지:", error.message);
      console.log("에러 스택:", error.stack);
      
      // 네트워크 연결 실패 에러인 경우 더 친화적인 메시지 표시
      if (error.message === '네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.') {
        toast.error("일시적인 네트워크 연결 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        toast.error(error.message || "카테고리 추가에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCategoryName("");
    setSelectedIcon("");
    setSelectedColor("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button"
          size="icon"
          className="w-10 h-10 rounded-full bg-[#008485] hover:bg-[#e05274] text-white transition-colors duration-300"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "Hana2-CM" }}>
            새 카테고리 추가
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} onKeyDown={(e) => e.key === 'Enter' && e.stopPropagation()} className="space-y-4">
          {/* 카테고리 이름과 아이콘 선택을 한 줄에 배치 */}
          <div className="flex gap-4 items-center justify-center">
            {/* 아이콘 및 색상 선택 (1:1 비율) */}
            <div className="w-12">
              <IconSelector
                selectedIcon={selectedIcon}
                selectedColor={selectedColor}
                onIconSelect={handleIconSelect}
                onColorSelect={setSelectedColor}
              />
            </div>

            {/* 카테고리 이름 입력 (나머지 공간) */}
            <div className="flex-1">
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="카테고리 이름"
                required
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="bg-[#008485] hover:bg-[#e05274]"
              disabled={isLoading}
            >
              {isLoading ? "추가 중..." : "추가"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
