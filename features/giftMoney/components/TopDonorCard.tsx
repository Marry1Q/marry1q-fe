import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { colors } from "@/constants/colors";
import Image from "next/image";

interface TopDonorCardProps {
  topDonor?: {
    name: string;
    amount: number;
    relationship: string;
    date: string;
    id?: number;
  };
  onCardClick?: () => void;
}

export function TopDonorCard({ topDonor, onCardClick }: TopDonorCardProps) {
  // topDonor가 없으면 렌더링하지 않음
  if (!topDonor) {
    return null;
  }

  return (
    <Card 
      className="mb-6 cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white" 
      onClick={onCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hana Bank Icon */}
            <div className="flex items-center justify-center">
              <Image
                src="/hana3dIcon/hanaIcon3d_51.png"
                alt="하나은행 3D 아이콘"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            
            {/* Text Content */}
            <div className="flex-1">
              <div className="space-y-1">
                <div className="text-sm text-gray-600" style={{fontFamily: "Hana2-CM"}}>
                  {topDonor.name}님이 가장 많은 축의금을 보내주셨습니다
                </div>
                <div className="text-lg font-bold text-gray-900" style={{fontFamily: "Hana2-CM"}}>
                  최고 축의금 {topDonor.amount.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>

          {/* Chevron Icon */}
          <div className="flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 