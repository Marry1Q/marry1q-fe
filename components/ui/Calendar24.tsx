"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

interface Calendar24Props {
  date: Date;
  time?: string; // weddingTime 값을 받을 수 있도록 추가
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
}

export function Calendar24({ date, time, onDateChange, onTimeChange }: Calendar24Props) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const [year, month, day] = dateValue.split('-').map(Number);
      const newDate = new Date(date);
      newDate.setFullYear(year || date.getFullYear());
      newDate.setMonth((month || date.getMonth() + 1) - 1); // month는 0-based
      newDate.setDate(day || date.getDate());
      onDateChange(newDate);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    if (timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours || 0);
      newDate.setMinutes(minutes || 0);
      newDate.setSeconds(0); // 초는 항상 0으로 설정
      onDateChange(newDate);
      onTimeChange(timeValue);
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  // time prop이 있으면 그것을 사용하고, 없으면 date에서 시간을 추출
  const formatTime = () => {
    if (time) {
      return time;
    }
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3 flex-1">
        <Input
          type="date"
          id="date-picker"
          value={formatDate(date)}
          onChange={handleDateChange}
          className="bg-background"
        />
      </div>
      <div className="flex flex-col gap-3 flex-1">
        <Input
          type="time"
          id="time-picker"
          value={formatTime()}
          onChange={handleTimeChange}
          className="bg-background"
        />
      </div>
    </div>
  )
}