import { RelationshipChart } from "./RelationshipChart";
import { AmountRangeChart } from "./AmountRangeChart";
import { TopDonorCard } from "./TopDonorCard";

interface GiftMoneyStatisticsProps {
  relationshipChartData: Array<{ name: string; amount: number }>;
  amountRangeChartData: Array<{ range: string; count: number }>;
  topDonor?: {
    name: string;
    amount: number;
    relationship: string;
    date: string;
    id?: number;
  };
  onTopDonorClick?: () => void;
}

export function GiftMoneyStatistics({ 
  relationshipChartData, 
  amountRangeChartData,
  topDonor,
  onTopDonorClick
}: GiftMoneyStatisticsProps) {
  
  return (
    <div className="space-y-6">
      {/* 최고 후원자 카드 */}
      <TopDonorCard topDonor={topDonor} onCardClick={onTopDonorClick} />

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RelationshipChart data={relationshipChartData} />
        <AmountRangeChart data={amountRangeChartData} />
      </div>
    </div>
  );
} 