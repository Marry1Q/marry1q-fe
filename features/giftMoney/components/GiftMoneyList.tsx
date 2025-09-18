import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { GiftMoneyItem } from "./GiftMoneyItem";
import { GiftMoney } from "../types";
import { formatDisplayDate } from "@/features/finance/utils/dateUtils";

interface GiftMoneyListProps {
  gifts: GiftMoney[];
  onToggleThanks?: (id: number, currentThanksSent: boolean) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function GiftMoneyList({ gifts, onToggleThanks, onEdit, onDelete }: GiftMoneyListProps) {
  if (!gifts || gifts.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 검색어나 필터를 사용해보세요.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 그룹핑: YYYY-MM-DD 기준
  const toYMD = (dateStr: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const grouped: Record<string, GiftMoney[]> = gifts.reduce((acc, item) => {
    const key = toYMD(item.giftDate);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, GiftMoney[]>);

  // 날짜 내 정렬(옵션): 최신 id 우선
  Object.values(grouped).forEach(list => list.sort((a, b) => b.id - a.id));

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      {sortedDates.map(date => {
        const items = grouped[date];
        return (
          <div key={date} className="space-y-2">
            <div className="px-2">
              <span className="text-sm font-medium text-gray-700">{formatDisplayDate(date)}</span>
            </div>
            <Card>
              <CardContent className="p-0">
                <div>
                  {items.map((gift, idx) => (
                    <GiftMoneyItem
                      key={gift.id}
                      gift={gift}
                      onToggleThanks={onToggleThanks}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isLast={idx === items.length - 1}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}