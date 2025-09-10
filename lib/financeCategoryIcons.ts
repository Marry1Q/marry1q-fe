import { colors } from "@/constants/colors";

// 가계부 관련 Lucide 아이콘 목록
export const availableIcons = [
  // 결혼/웨딩 관련
  "Heart", "Gift", "Camera", "Users", "Calendar", "Star", "Diamond",
  
  // 일상 생활
  "Utensils", "Car", "ShoppingBag", "Home", "Coffee", "Gamepad2", "Bed",
  "WashingMachine", "Tv", "Smartphone", "Laptop", "BookOpen",
  
  // 업무/교육
  "Briefcase", "GraduationCap", "Target", "FileText", "Calculator",
  
  // 건강/의료
  "Stethoscope", "Activity", "Pill", "Thermometer", "FirstAid",
  
  // 금융/수입
  "TrendingUp", "DollarSign", "CreditCard", "PiggyBank", "Receipt",
  
  // 교통/이동
  "Plane", "Train", "Bus", "Bike", "Walking",
  
  // 기타
  "Settings", "Plus", "Minus", "MoreHorizontal", "CircleQuestion"
] as const;

export type IconName = typeof availableIcons[number];

// 아이콘별 기본 색상 매칭 (하나은행 색상 팔레트)
export const iconDefaultColors: Record<IconName, keyof typeof colors.hana> = {
  // 결혼/웨딩 관련
  "Heart": "red",
  "Gift": "purple", 
  "Camera": "blue",
  "Users": "mint",
  "Calendar": "blue",
  "Star": "yellow",
  "Diamond": "purple",
  
  // 일상 생활
  "Utensils": "yellow",
  "Car": "blue",
  "ShoppingBag": "purple",
  "Home": "green",
  "Coffee": "brown",
  "Gamepad2": "purple",
  "Bed": "mint",
  "WashingMachine": "blue",
  "Tv": "blue",
  "Smartphone": "blue",
  "Laptop": "blue",
  "BookOpen": "green",
  
  // 업무/교육
  "Briefcase": "blue",
  "GraduationCap": "green",
  "Target": "red",
  "FileText": "blue",
  "Calculator": "blue",
  
  // 건강/의료
  "Stethoscope": "green",
  "Activity": "green",
  "Pill": "green",
  "Thermometer": "red",
  "FirstAid": "red",
  
  // 금융/수입
  "TrendingUp": "green",
  "DollarSign": "green",
  "CreditCard": "blue",
  "PiggyBank": "yellow",
  "Receipt": "blue",
  
  // 교통/이동
  "Plane": "mint",
  "Train": "blue",
  "Bus": "blue",
  "Bike": "green",
  "Walking": "green",
  
  // 기타
  "Settings": "brown",
  "Plus": "green",
  "Minus": "red",
  "MoreHorizontal": "brown",
  "CircleQuestion": "brown"
};

// 기본 아이콘
export const DEFAULT_ICON: IconName = "CircleQuestion";

// 아이콘 검색 함수
export const searchIcons = (query: string): IconName[] => {
  const lowercaseQuery = query.toLowerCase();
  return availableIcons.filter(icon => 
    icon.toLowerCase().includes(lowercaseQuery)
  );
};
