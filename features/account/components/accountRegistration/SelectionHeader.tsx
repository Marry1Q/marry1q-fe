import { Button } from "@/components/ui/button";

interface SelectionHeaderProps {
  title: string;
  totalCount: number;
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  isAllSelected: boolean;
  isLoading?: boolean;
}

export function SelectionHeader({ 
  title, 
  totalCount, 
  selectedCount, 
  onSelectAll, 
  onDeselectAll, 
  isAllSelected,
  isLoading 
}: SelectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold" style={{ fontFamily: "Hana2-CM" }}>
          {title}
        </h3>
        <p className="text-sm text-gray-600">
          {isLoading ? "조회 중..." : `${selectedCount}/${totalCount} 선택됨`}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={isAllSelected ? onDeselectAll : onSelectAll}
          disabled={isLoading || totalCount === 0}
          style={{ fontFamily: "Hana2-Medium" }}
        >
          {isAllSelected ? "전체 해제" : "전체 선택"}
        </Button>
      </div>
    </div>
  );
}
