// 축의금 도메인 타입 정의

export interface GiftMoney {
  id: number;
  name: string;
  amount: number;
  relationship: 'FAMILY' | 'RELATIVE' | 'FRIEND' | 'COLLEAGUE' | 'ACQUAINTANCE' | 'OTHER';
  relationshipDisplayName: string;
  source: 'CASH' | 'TRANSFER';
  sourceDisplayName: string;
  phone?: string;
  address?: string;
  memo?: string;
  giftDate: string;
  thanksSent: boolean;
  thanksDate?: string;
  thanksSentBy?: string;
  coupleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface GiftMoneySummary {
  totalAmount: number;
  totalCount: number;
  averageAmount: number;
  thanksSentCount: number;
  thanksNotSentCount: number;
  topDonor?: {
    id: number;
    name: string;
    amount: number;
    relationship: string;
    giftDate: string;
  };
}

export interface GiftMoneyStatistics {
  coupleId: number;
  totalAmount: number;
  totalCount: number;
  averageAmount: number;
  thanksNotSentCount: number;
  
  // 관계별 통계
  familyAmount: number;
  familyCount: number;
  relativeAmount: number;
  relativeCount: number;
  friendAmount: number;
  friendCount: number;
  colleagueAmount: number;
  colleagueCount: number;
  acquaintanceAmount: number;
  acquaintanceCount: number;
  otherAmount: number;
  otherCount: number;
  
  // 받은 방법별 통계
  cashAmount: number;
  cashCount: number;
  transferAmount: number;
  transferCount: number;
  
  // 금액대별 통계
  amountUnder30kCount: number;
  amount30kTo50kCount: number;
  amount50kTo100kCount: number;
  amount100kTo200kCount: number;
  amount200kTo500kCount: number;
  amountOver500kCount: number;
  
  // 월별 통계
  monthlyStats: {
    month: string;
    amount: number;
    count: number;
  }[];
  
  // 최고 후원자 정보
  topDonorName?: string;
  topDonorAmount?: number;
  topDonorGiftMoneyId?: number;
  lastGiftDate?: string;
}

export interface PaginationInfo {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface FetchGiftMoneyParams {
  page?: number;
  size?: number;
  name?: string;
  relationship?: string;
  thanksSent?: boolean;
}

// 관계 매핑
export const relationshipMapping = {
  "가족": "FAMILY",
  "친척": "RELATIVE", 
  "친구": "FRIEND",
  "회사동료": "COLLEAGUE",
  "지인": "ACQUAINTANCE",
  "기타": "OTHER"
} as const;

// 받은방법 매핑
export const sourceMapping = {
  "현금": "CASH",
  "계좌이체": "TRANSFER"
} as const;
