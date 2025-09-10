import { DashboardInfoCard } from "@/components/ui/DashboardInfoCard";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useEffect, useState } from "react";
import { coupleApi, CoupleResponse } from "@/lib/api/coupleApi";
import { toast } from "sonner";

interface FinanceWeddingDateCardProps {
  className?: string;
  onCardClick?: () => void;
}

export function FinanceWeddingDateCard({
  className = "w-60 h-60",
  onCardClick,
}: FinanceWeddingDateCardProps) {
  const [coupleInfo, setCoupleInfo] = useState<CoupleResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupleInfo = async () => {
      try {
        setLoading(true);
        const response = await coupleApi.getCurrentCoupleInfo();
        
        if (response.success && response.data) {
          setCoupleInfo(response.data);
        } else {
          toast.error(response.message || '커플 정보를 불러오는데 실패했습니다.');
        }
      } catch (error: any) {
        const errorMessage = error.message || '커플 정보를 불러오는데 실패했습니다.';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupleInfo();
  }, []);

  if (loading) {
    return (
      <DashboardInfoCard
        title="결혼 예정일"
        subtitle="로딩 중..."
        description="정보를 불러오는 중입니다"
        actionText="설정 보기"
        variant="default"
        color="purple"
        onClick={onCardClick}
        className={className}
        backgroundImage={{
          src: "/hana3dIcon/hanaIcon3d_2_85.png",
          alt: "결혼 아이콘",
          position: "bottom-right",
          size: "w-32 h-32",
        }}
      />
    );
  }

  if (!coupleInfo) {
    return (
      <DashboardInfoCard
        title="결혼 예정일"
        subtitle="설정 필요"
        description="결혼 예정일을 설정해주세요"
        actionText="설정하기"
        variant="default"
        color="purple"
        onClick={onCardClick}
        className={className}
        backgroundImage={{
          src: "/hana3dIcon/hanaIcon3d_2_85.png",
          alt: "결혼 아이콘",
          position: "bottom-right",
          size: "w-32 h-32",
        }}
      />
    );
  }

  const weddingDate = new Date(coupleInfo.weddingDate);
  const daysUntilWedding = coupleInfo.daysUntilWedding;
  const isNearWedding = daysUntilWedding <= 30;
  const isVeryNearWedding = daysUntilWedding <= 7;

  return (
    <DashboardInfoCard
      title="결혼 예정일"
      subtitle={format(weddingDate, "yy.MM.dd", { locale: ko })}
      description={`목표일까지 <strong>${daysUntilWedding}일</strong> 남았습니다`}
      actionText="설정 보기"
      variant="default"
      color={isVeryNearWedding ? "red" : isNearWedding ? "yellow" : "red"}
      onClick={onCardClick}
      className={className}
      backgroundImage={{
        src: "/hana3dIcon/hanaIcon3d_2_85.png",
        alt: "결혼 아이콘",
        position: "bottom-right",
        size: "w-32 h-32",
      }}
    />
  );
}
