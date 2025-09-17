"use client"

import * as React from "react"
import { ChevronDownIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Calendar24Props {
  date: Date;
  time?: string; // weddingTime 값을 받을 수 있도록 추가
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
}

export function Calendar24({ date, time, onDateChange, onTimeChange }: Calendar24Props) {
  const [dateOpen, setDateOpen] = React.useState(false)
  const [timeOpen, setTimeOpen] = React.useState(false)

  // time prop이 있으면 그것을 사용하고, 없으면 date에서 시간을 추출
  const formatTime = () => {
    if (time) {
      return time;
    }
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // 기존 시간 정보를 유지하면서 날짜만 변경
      const newDate = new Date(selectedDate);
      if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        newDate.setHours(hours || 0);
        newDate.setMinutes(minutes || 0);
      } else {
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
      }
      onDateChange(newDate);
      setDateOpen(false);
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
    } else {
      // 시간이 비워진 경우
      onTimeChange("");
    }
  };

  // 시간 선택을 위한 시간 옵션 생성 (30분 간격)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        // 한국어 시간 표시 (오전/오후)
        const ampm = hour < 12 ? "오전" : "오후";
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const displayTime = `${ampm} ${displayHour}:${minute.toString().padStart(2, '0')}`;
        times.push({ value: timeString, label: displayTime });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* 날짜 선택 */}
      <div className="flex flex-col gap-3 flex-1">
        <Label htmlFor="date-picker" className="px-1 text-sm font-medium">
          날짜
        </Label>
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className={cn(
                "w-full justify-between font-normal h-10",
                !date && "text-muted-foreground"
              )}
            >
              <span className="truncate">
                {date ? format(date, "yyyy년 MM월 dd일 (E)", { locale: ko }) : "날짜 선택"}
              </span>
              <ChevronDownIcon className="h-4 w-4 opacity-50 flex-shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" side="bottom">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              captionLayout="dropdown"
              locale={ko}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* 시간 선택 */}
      <div className="flex flex-col gap-3 flex-1">
        <Label htmlFor="time-picker" className="px-1 text-sm font-medium">
          시간
        </Label>
        <div className="relative">
          <Input
            type="time"
            id="time-picker"
            value={time || ""}
            onChange={handleTimeChange}
            className="w-full h-10 pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            placeholder="시간을 입력하세요"
          />
          <Popover open={timeOpen} onOpenChange={setTimeOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent"
              >
                <ChevronDownIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end" side="bottom">
              <div className="max-h-60 overflow-y-auto w-36">
                <div className="p-2 text-xs text-muted-foreground border-b">
                  빠른 선택
                </div>
                {timeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="ghost"
                    className="w-full justify-start font-normal h-8 text-sm hover:bg-accent"
                    onClick={() => {
                      onTimeChange(option.value);
                      setTimeOpen(false);
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}