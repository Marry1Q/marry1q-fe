import { GiftMoney, GiftMoneySummary, GiftMoneyStatistics, PaginationInfo } from '../types';
import { GiftMoneyResponse, GiftMoneyListResponse, GiftMoneySummaryResponse, GiftMoneyStatisticsResponse } from '../api/giftMoneyApi';

// 단일 축의금 API 응답을 도메인 타입으로 변환
export const mapGiftMoneyApiResponse = (response: GiftMoneyResponse): GiftMoney => {
  return {
    id: response.giftMoneyId,
    name: response.name,
    amount: response.amount,
    relationship: response.relationship,
    relationshipDisplayName: response.relationshipDisplayName,
    source: response.source,
    sourceDisplayName: response.sourceDisplayName,
    phone: response.phone,
    address: response.address,
    memo: response.memo,
    giftDate: response.giftDate,
    thanksSent: response.thanksSent,
    thanksDate: response.thanksDate,
    thanksSentBy: response.thanksSentBy,
    coupleId: response.coupleId,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
};

// 축의금 목록 API 응답을 도메인 타입으로 변환
export const mapGiftMoneyListApiResponse = (response: GiftMoneyListResponse): {
  giftMoneyList: GiftMoney[];
  pagination: PaginationInfo;
} => {
  return {
    giftMoneyList: response.content.map(mapGiftMoneyApiResponse),
    pagination: {
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      currentPage: response.currentPage,
      size: response.size,
      first: response.first,
      last: response.last,
    },
  };
};

// 축의금 요약 통계 API 응답을 도메인 타입으로 변환
export const mapGiftMoneySummaryApiResponse = (response: GiftMoneySummaryResponse): GiftMoneySummary => {
  return {
    totalAmount: response.totalAmount,
    totalCount: response.totalCount,
    averageAmount: response.averageAmount,
    thanksSentCount: response.thanksSentCount,
    thanksNotSentCount: response.thanksNotSentCount,
    topDonor: response.topDonor,
  };
};

// 축의금 전체 통계 API 응답을 도메인 타입으로 변환
export const mapGiftMoneyStatisticsApiResponse = (response: GiftMoneyStatisticsResponse): GiftMoneyStatistics => {
  return {
    coupleId: response.coupleId,
    totalAmount: response.totalAmount,
    totalCount: response.totalCount,
    averageAmount: response.averageAmount,
    thanksNotSentCount: response.thanksNotSentCount,
    
    // 관계별 통계
    familyAmount: response.familyAmount,
    familyCount: response.familyCount,
    relativeAmount: response.relativeAmount,
    relativeCount: response.relativeCount,
    friendAmount: response.friendAmount,
    friendCount: response.friendCount,
    colleagueAmount: response.colleagueAmount,
    colleagueCount: response.colleagueCount,
    acquaintanceAmount: response.acquaintanceAmount,
    acquaintanceCount: response.acquaintanceCount,
    otherAmount: response.otherAmount,
    otherCount: response.otherCount,
    
    // 받은 방법별 통계
    cashAmount: response.cashAmount,
    cashCount: response.cashCount,
    transferAmount: response.transferAmount,
    transferCount: response.transferCount,
    
    // 금액대별 통계
    amountUnder30kCount: response.amountUnder30kCount || 0,
    amount30kTo50kCount: response.amount30kTo50kCount || 0,
    amount50kTo100kCount: response.amount50kTo100kCount || 0,
    amount100kTo200kCount: response.amount100kTo200kCount || 0,
    amount200kTo500kCount: response.amount200kTo500kCount || 0,
    amountOver500kCount: response.amountOver500kCount || 0,
    
    // 월별 통계
    monthlyStats: response.monthlyStats || [],
    
    // 최고 후원자 정보
    topDonorName: response.topDonorName,
    topDonorAmount: response.topDonorAmount,
    topDonorGiftMoneyId: response.topDonorGiftMoneyId,
    lastGiftDate: response.lastGiftDate,
  };
};
