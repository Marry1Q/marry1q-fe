import React from "react";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface CardInfoProps {
  weddingDate: Date;
  weddingTime: string;
  venue: string;
  venueAddress: string;
  message: string;
  isPreview?: boolean;
}

export function CardInfo({ weddingDate, weddingTime, venue, venueAddress, message, isPreview }: CardInfoProps) {
  // 시간 포맷팅 함수
  const formatWeddingTime = (time: string): string => {
    if (!time) return "";
    
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const minute = parseInt(minutes);
      
      const ampm = hour < 12 ? "오전" : "오후";
      const displayHour = hour < 12 ? hour : hour - 12;
      const displayMinute = minute === 0 ? "" : `${minute}분`;
      
      return `${ampm} ${displayHour}시${displayMinute}`;
    } catch {
      return time;
    }
  };

  return (
    <section className="bg-white w-full max-w-sm">
      <div className="w-full">
        {/* 날짜 & 시간 */}
        <div className="mb-12">
          <p className="text-lg mb-4 text-center" style={{ fontFamily: 'Bona Nova SC', color: '#d099a1' }}>
            DATE & TIME
          </p>
          <p className="text-lg text-gray-600 mb-6 text-center">
            {format(weddingDate, "yyyy년 MM월 dd일 (E)", { locale: ko })} {formatWeddingTime(weddingTime)}
          </p>
        </div>
        
        {/* 장소 */}
        <div className="mb-12">
          <p className="text-lg mb-4 text-center" style={{ fontFamily: 'Bona Nova SC', color: '#d099a1' }}>
            LOCATION
          </p>
          <p className="text-lg text-gray-600 mb-4 text-center">{venue}</p>
          <p className="text-gray-600 text-lg text-center">{venueAddress}</p>
        </div>
        
        
      </div>
    </section>
  );
}