import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { getGradient } from "@/constants/colors";

interface MainBudgetCardProps {
  totalBudget: number;
  totalSpent: number;
  daysUntilWedding: number;
}

export function MainBudgetCard({
  totalBudget,
  totalSpent,
  daysUntilWedding,
}: MainBudgetCardProps) {
  const router = useRouter();
  const remaining = totalBudget - totalSpent;

  const handleSettingsClick = () => {
    router.push("/budget-settings");
  };

  return (
    <Card
      className="lg:col-span-2 text-white"
      style={{ background: getGradient("primary") }}
    >
      <CardContent className="p-6 flex flex-col h-full justify-between">
        {/* 상단 내용 */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-4">
            <p className="text-teal-100">전체 남은 예산</p>
            <p className="text-3xl font-bold">{remaining.toLocaleString()}원</p>
            <p className="text-teal-100 text-sm">
              목표 {totalBudget.toLocaleString()}원 중
            </p>
            <p className="text-teal-100 text-sm flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              결혼 예정일까지 {daysUntilWedding}일 남음
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="transparent">
              {Math.round((remaining / totalBudget) * 100)}% 남음
            </Badge>
            <Button
              size="sm"
              variant="ghost-white"
              onClick={handleSettingsClick}
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* 하단 Progress */}
        <Progress
          value={(remaining / totalBudget) * 100}
          color="white"
          backgroundColor="rgba(255, 255, 255, 0.3)"
        />
      </CardContent>
    </Card>
  );
}
