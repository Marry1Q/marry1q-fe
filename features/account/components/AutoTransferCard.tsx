"use client";

import { useState } from "react";
import { DashboardInfoCard } from "@/components/ui/DashboardInfoCard";
import { AutoTransfer } from "@/features/account/types/account";

interface AutoTransferCardProps {
  recurringDeposits: AutoTransfer[];
  onCardClick: () => void;
}

export function AutoTransferCard({ recurringDeposits, onCardClick }: AutoTransferCardProps) {
  const [autoTransferIndex, setAutoTransferIndex] = useState(0);

  // 자동이체 데이터를 현재 날짜 기준으로 정렬
  const sortedAutoTransfers = [...recurringDeposits].sort((a, b) => {
    const dateA = new Date(a.nextDate);
    const dateB = new Date(b.nextDate);
    const today = new Date();
    
    // 오늘 날짜를 기준으로 가장 가까운 날짜 순으로 정렬
    const diffA = Math.abs(dateA.getTime() - today.getTime());
    const diffB = Math.abs(dateB.getTime() - today.getTime());
    return diffA - diffB;
  });

  // 현재 선택된 자동이체 정보
  const currentAutoTransfer = sortedAutoTransfers[autoTransferIndex];

  // 날짜 형식 변환 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "D-Day";
    if (diffDays === 1) return "D-1";
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  };

  // 점 클릭 핸들러
  const handleDotClick = (index: number) => {
    setAutoTransferIndex(index);
  };

  return (
    <div className="relative">
      <DashboardInfoCard
        title="자동이체 일정"
        subtitle={currentAutoTransfer ? `${currentAutoTransfer.memo || '메모 없음'}` : "자동이체 없음"}
        description={currentAutoTransfer 
          ? `${formatDate(currentAutoTransfer.nextDate)} 예정<br/>-${currentAutoTransfer.amount.toLocaleString()}원`
          : "예정된 자동이체가 없습니다"
        }
        onClick={onCardClick}
        color="mint"
        backgroundImage={{
          src: "/hana3dIcon/hanaIcon3d_2_85.png",
          alt: "자동이체 아이콘",
          position: "bottom-right",
          size: "w-32 h-32",
        }}
        actionText="" // 확인하기 텍스트 제거
        className="w-60 h-60"
        disableHover={true}
      />
      
      {/* 커스텀 점 인디케이터 - 확인하기 텍스트 자리에 위치 */}
      {sortedAutoTransfers.length > 1 && (
        <div className="absolute bottom-6 left-6 right-2">
          <div className="flex justify-center gap-1">
            {Array.from({ length: sortedAutoTransfers.length }, (_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDotClick(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === autoTransferIndex
                    ? "bg-gray-800"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 