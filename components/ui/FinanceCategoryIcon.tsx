"use client";

import React from "react";
import { LucideIcon, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { colors } from "@/constants/colors";
import { IconName, iconDefaultColors, DEFAULT_ICON } from "@/lib/financeCategoryIcons";

// 동적 아이콘 import를 위한 매핑
const iconComponents: Record<IconName, LucideIcon> = {
  // 결혼/웨딩 관련
  "Heart": require("lucide-react").Heart,
  "Gift": require("lucide-react").Gift,
  "Camera": require("lucide-react").Camera,
  "Users": require("lucide-react").Users,
  "Calendar": require("lucide-react").Calendar,
  "Star": require("lucide-react").Star,
  "Diamond": require("lucide-react").Diamond,
  
  // 일상 생활
  "Utensils": require("lucide-react").Utensils,
  "Car": require("lucide-react").Car,
  "ShoppingBag": require("lucide-react").ShoppingBag,
  "Home": require("lucide-react").Home,
  "Coffee": require("lucide-react").Coffee,
  "Gamepad2": require("lucide-react").Gamepad2,
  "Bed": require("lucide-react").Bed,
  "WashingMachine": require("lucide-react").WashingMachine,
  "Tv": require("lucide-react").Tv,
  "Smartphone": require("lucide-react").Smartphone,
  "Laptop": require("lucide-react").Laptop,
  "BookOpen": require("lucide-react").BookOpen,
  
  // 업무/교육
  "Briefcase": require("lucide-react").Briefcase,
  "GraduationCap": require("lucide-react").GraduationCap,
  "Target": require("lucide-react").Target,
  "FileText": require("lucide-react").FileText,
  "Calculator": require("lucide-react").Calculator,
  
  // 건강/의료
  "Stethoscope": require("lucide-react").Stethoscope,
  "Activity": require("lucide-react").Activity,
  "Pill": require("lucide-react").Pill,
  "Thermometer": require("lucide-react").Thermometer,
  "FirstAid": require("lucide-react").FirstAid,
  
  // 금융/수입
  "TrendingUp": require("lucide-react").TrendingUp,
  "DollarSign": require("lucide-react").DollarSign,
  "CreditCard": require("lucide-react").CreditCard,
  "PiggyBank": require("lucide-react").PiggyBank,
  "Receipt": require("lucide-react").Receipt,
  
  // 교통/이동
  "Plane": require("lucide-react").Plane,
  "Train": require("lucide-react").Train,
  "Bus": require("lucide-react").Bus,
  "Bike": require("lucide-react").Bike,
  "Walking": require("lucide-react").Walking,
  
  // 기타
  "Settings": require("lucide-react").Settings,
  "Plus": require("lucide-react").Plus,
  "Minus": require("lucide-react").Minus,
  "MoreHorizontal": require("lucide-react").MoreHorizontal,
  "CircleQuestion": HelpCircle
};

interface FinanceCategoryIconProps {
  iconName?: string;
  colorName?: string;
  size?: number;
  className?: string;
  variant?: "display" | "select"; // display: 거래내역 표시용, select: 선택용
}

export function FinanceCategoryIcon({
  iconName,
  colorName,
  size = 24,
  className,
  variant = "display"
}: FinanceCategoryIconProps) {
  // 아이콘 컴포넌트 가져오기
  const IconComponent = iconName && iconComponents[iconName as IconName] 
    ? iconComponents[iconName as IconName] 
    : HelpCircle;

  // 색상 결정
  const getColor = () => {
    // 사용자가 선택한 색상이 있고, 하나은행 색상 팔레트에 존재하는 경우
    if (colorName && colors.hana[colorName as keyof typeof colors.hana]) {
      return colors.hana[colorName as keyof typeof colors.hana].main;
    }
    
    // 아이콘 기본 색상 사용
    if (iconName && iconDefaultColors[iconName as IconName]) {
      const defaultColor = iconDefaultColors[iconName as IconName];
      if (colors.hana[defaultColor]) {
        return colors.hana[defaultColor].main;
      }
    }
    
    // 기본값: 회색
    return colors.gray.main;
  };

  // 배경색 결정 (훨씬 연하게)
  const getBackgroundColor = () => {
    let baseColor: string = colors.gray.light; // 기본값: 연한 회색
    
    // 사용자가 선택한 색상이 있고, 하나은행 색상 팔레트에 존재하는 경우
    if (colorName && colors.hana[colorName as keyof typeof colors.hana]) {
      baseColor = colors.hana[colorName as keyof typeof colors.hana].light;
    }
    // 아이콘 기본 색상 사용
    else if (iconName && iconDefaultColors[iconName as IconName]) {
      const defaultColor = iconDefaultColors[iconName as IconName];
      if (colors.hana[defaultColor]) {
        baseColor = colors.hana[defaultColor].light;
      }
    }
    
    // 색상을 훨씬 더 연하게 만들기 위해 투명도 적용
    return `${baseColor}33`; // 20% 투명도 (33% 불투명도)
  };

  const iconColor = getColor();
  const backgroundColor = getBackgroundColor();

  // 스타일 결정
  const getStyles = () => {
    const baseStyles = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: iconColor,
    };

    if (variant === "select") {
      // select variant - 정사각형 배경으로 1:1 비율 유지
      return {
        ...baseStyles,
        width: size * 1.2, // 배경 크기를 아이콘보다 1.2배 크게
        height: size * 1.2,
        backgroundColor: backgroundColor,
        borderRadius: "50%", // 원형으로 만들기
      };
    }
    
    // display variant (거래내역 표시용) - 더 크게
    const displaySize = size * 1.2; // 20% 더 크게
    return {
      ...baseStyles,
      width: displaySize,
      height: displaySize,
      backgroundColor: backgroundColor,
      borderRadius: "50%", // 원형으로 만들기
    };
  };

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={getStyles()}
    >
      <IconComponent size={variant === "display" ? size * 0.8 : size * 0.6} />
    </div>
  );
}
