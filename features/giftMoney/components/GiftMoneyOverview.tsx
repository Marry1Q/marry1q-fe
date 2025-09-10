import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Users, TrendingUp, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface GiftMoneyOverviewProps {
  totalAmount: number;
  totalCount: number;
  avgAmount: number;
  thanksSentCount: number;
  thanksNotSentCount: number;
  onAddNew?: () => void;
}

export function GiftMoneyOverview({ 
  totalAmount, 
  totalCount, 
  avgAmount, 
  thanksSentCount, 
  thanksNotSentCount,
  onAddNew 
}: GiftMoneyOverviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canSlideLeft, setCanSlideLeft] = useState(false);
  const [canSlideRight, setCanSlideRight] = useState(true);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const overviewCards = [
    {
      id: "total",
      title: "총 축의금",
      value: `${totalAmount.toLocaleString()}원`,
      icon: Gift,
      color: "bg-gradient-to-r from-[#008485] to-[#006b6b]",
      textColor: "text-white",
      iconColor: "text-teal-200"
    },
    {
      id: "count",
      title: "총 인원",
      value: `${totalCount}명`,
      icon: Users,
      color: "bg-white",
      textColor: "text-gray-900",
      iconColor: "text-blue-500"
    },
    {
      id: "average",
      title: "평균 금액",
      value: `${Math.round(avgAmount).toLocaleString()}원`,
      icon: TrendingUp,
      color: "bg-white",
      textColor: "text-gray-900",
      iconColor: "text-green-500"
    },
    {
      id: "thanks",
      title: "감사 연락",
      value: `${thanksSentCount}명`,
      subtitle: `미완료 ${thanksNotSentCount}명`,
      icon: MessageCircle,
      color: "bg-white",
      textColor: "text-gray-900",
      iconColor: "text-purple-500"
    }
  ];

  const handleSlideLeft = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSlideRight = () => {
    if (currentSlide < overviewCards.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  useEffect(() => {
    setCanSlideLeft(currentSlide > 0);
    setCanSlideRight(currentSlide < overviewCards.length - 1);
  }, [currentSlide, overviewCards.length]);

  return (
    <div className="mb-8">
      {/* 슬라이드 컨테이너 */}
      <div className="relative">
        {/* 이전 화살표 */}
        {canSlideLeft && (
          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 opacity-0 hover:opacity-100"
            onClick={handleSlideLeft}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
            <span className="sr-only">이전</span>
          </button>
        )}

        {/* 다음 화살표 */}
        {canSlideRight && (
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 opacity-0 hover:opacity-100"
            onClick={handleSlideRight}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
            <span className="sr-only">다음</span>
          </button>
        )}

        <div
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          ref={slideContainerRef}
        >
          <div
            className="flex gap-4 mx-auto transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 264}px)`, // 240px (카드 너비) + 24px (gap)
            }}
          >
            {/* 축의금 추가 카드 */}
            <Card className="w-60 h-32 flex-shrink-0 border-2 border-dashed border-gray-300 hover:border-[#008485] transition-colors">
              <CardContent className="p-4 h-full flex flex-col items-center justify-center">
                <Button
                  variant="ghost"
                  className="h-full w-full flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
                  onClick={onAddNew}
                >
                  <div className="w-8 h-8 rounded-full bg-[#008485] flex items-center justify-center">
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[#008485]">새 축의금 추가</span>
                </Button>
              </CardContent>
            </Card>

            {/* 통계 카드들 */}
            {overviewCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Card key={card.id} className={`w-60 h-32 flex-shrink-0 ${card.color}`}>
                  <CardContent className="p-4 h-full">
                    <div className="flex items-center justify-between h-full">
                      <div>
                        <p className={`text-sm ${card.textColor} opacity-80`}>{card.title}</p>
                        <p className={`text-xl font-bold ${card.textColor}`}>{card.value}</p>
                        {card.subtitle && (
                          <p className={`text-xs ${card.textColor} opacity-60`}>{card.subtitle}</p>
                        )}
                      </div>
                      <IconComponent className={`w-8 h-8 ${card.iconColor}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 슬라이드 인디케이터 (모바일에서만 표시) */}
        <div className="flex justify-center gap-2 mt-4 lg:hidden">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-200 ${
                index === currentSlide
                  ? "bg-[#008485]"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}