import { Card, CardContent } from "@/components/ui/card";
import { StatisticsCard } from "./StatisticsCard";
import { DollarSign, Users, Heart, TrendingUp } from "lucide-react";
import { colors } from "@/constants/colors";

interface StatisticsOverviewProps {
  totalAmount: number;
  totalCount: number;
  avgAmount: number;
  thanksSentCount: number;
  thanksNotSentCount: number;
}

export function StatisticsOverview({
  totalAmount,
  totalCount,
  avgAmount,
  thanksSentCount,
  thanksNotSentCount
}: StatisticsOverviewProps) {
  const thanksCompletionRate = totalCount > 0 ? Math.round((thanksSentCount / totalCount) * 100) : 0;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          축의금 통계 개요
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticsCard
            title="총 축의금"
            value={totalAmount}
            subtitle="전체 축의금 합계"
            icon={<DollarSign className="w-4 h-4" style={{ color: colors.hana.mint.main }} />}
            color="mint"
          />
          <StatisticsCard
            title="총 인원"
            value={totalCount}
            subtitle="축의금을 준 분들"
            icon={<Users className="w-4 h-4" style={{ color: colors.hana.blue.main }} />}
            color="blue"
          />
          <StatisticsCard
            title="평균 금액"
            value={avgAmount}
            subtitle="인당 평균 축의금"
            icon={<TrendingUp className="w-4 h-4" style={{ color: colors.hana.green.main }} />}
            color="green"
          />
          <StatisticsCard
            title="감사 인사 완료"
            value={thanksSentCount}
            subtitle={`${thanksNotSentCount}명 남음`}
            icon={<Heart className="w-4 h-4" style={{ color: colors.hana.red.main }} />}
            color="red"
            trend={{
              value: thanksCompletionRate,
              isPositive: true
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
} 