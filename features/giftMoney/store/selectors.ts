import { useGiftMoneyStore } from './giftMoneyStore';
import { GiftMoney } from '../types';
import { useMemo } from 'react';

// 기본 상태 selectors
export const useGiftMoneyList = () => useGiftMoneyStore((state) => state.giftMoneyList);
export const useSummaryStatistics = () => useGiftMoneyStore((state) => state.summaryStatistics);
export const useFullStatistics = () => useGiftMoneyStore((state) => state.fullStatistics);
export const usePagination = () => useGiftMoneyStore((state) => state.pagination);

// 로딩 상태 selectors
export const useIsLoading = () => useGiftMoneyStore((state) => state.isLoading);
export const useIsStatisticsLoading = () => useGiftMoneyStore((state) => state.isStatisticsLoading);
export const useIsCreating = () => useGiftMoneyStore((state) => state.isCreating);
export const useIsUpdating = () => useGiftMoneyStore((state) => state.isUpdating);
export const useIsDeleting = () => useGiftMoneyStore((state) => state.isDeleting);

// 에러 상태 selector
export const useError = () => useGiftMoneyStore((state) => state.error);

// 액션 selectors - 개별 함수로 분리하여 무한 루프 방지
export const useFetchGiftMoneyList = () => useGiftMoneyStore((state) => state.fetchGiftMoneyList);
export const useFetchSummaryStatistics = () => useGiftMoneyStore((state) => state.fetchSummaryStatistics);
export const useFetchFullStatistics = () => useGiftMoneyStore((state) => state.fetchFullStatistics);
export const useCreateGiftMoney = () => useGiftMoneyStore((state) => state.createGiftMoney);
export const useUpdateGiftMoney = () => useGiftMoneyStore((state) => state.updateGiftMoney);
export const useDeleteGiftMoney = () => useGiftMoneyStore((state) => state.deleteGiftMoney);
export const useUpdateThanksStatus = () => useGiftMoneyStore((state) => state.updateThanksStatus);
export const useClearError = () => useGiftMoneyStore((state) => state.clearError);
export const useResetState = () => useGiftMoneyStore((state) => state.resetState);

// 파생 상태 selectors
export const useTotalAmount = () => useGiftMoneyStore((state) => 
  state.summaryStatistics?.totalAmount || 0
);

export const useTotalCount = () => useGiftMoneyStore((state) => 
  state.summaryStatistics?.totalCount || 0
);

export const useAverageAmount = () => useGiftMoneyStore((state) => 
  state.summaryStatistics?.averageAmount || 0
);

export const useThanksSentCount = () => useGiftMoneyStore((state) => 
  state.summaryStatistics?.thanksSentCount || 0
);

export const useThanksNotSentCount = () => useGiftMoneyStore((state) => 
  state.summaryStatistics?.thanksNotSentCount || 0
);

// 실시간 감사인사 통계 계산 selector (목록 기반)
export const useRealtimeThanksStats = () => {
  const giftMoneyList = useGiftMoneyStore((state) => state.giftMoneyList);
  
  return useMemo(() => {
    const thanksSentCount = giftMoneyList.filter(item => item.thanksSent).length;
    const thanksNotSentCount = giftMoneyList.filter(item => !item.thanksSent).length;
    
    return {
      thanksSentCount,
      thanksNotSentCount
    };
  }, [giftMoneyList]);
};

// 필터링된 축의금 목록 selector
export const useFilteredGiftMoneyList = (
  searchTerm?: string,
  relationship?: string,
  thanksStatus?: '전체' | '완료' | '미완료'
) => {
  const giftMoneyList = useGiftMoneyStore((state) => state.giftMoneyList);
  
  return useMemo(() => {
    let filteredList = giftMoneyList;

    // 검색어 필터
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filteredList = filteredList.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.memo?.toLowerCase().includes(term) ||
        item.phone?.includes(term)
      );
    }

    // 관계 필터
    if (relationship && relationship !== '전체') {
      filteredList = filteredList.filter(item => 
        item.relationshipDisplayName === relationship
      );
    }

    // 감사 상태 필터
    if (thanksStatus && thanksStatus !== '전체') {
      const thanksSent = thanksStatus === '완료';
      filteredList = filteredList.filter(item => item.thanksSent === thanksSent);
    }

    return filteredList;
  }, [giftMoneyList, searchTerm, relationship, thanksStatus]);
};

// 관계별 통계 selector
export const useRelationshipStats = () => useGiftMoneyStore((state) => {
  if (!state.fullStatistics) return null;

  return [
    { name: '가족', amount: state.fullStatistics.familyAmount, count: state.fullStatistics.familyCount },
    { name: '친척', amount: state.fullStatistics.relativeAmount, count: state.fullStatistics.relativeCount },
    { name: '친구', amount: state.fullStatistics.friendAmount, count: state.fullStatistics.friendCount },
    { name: '회사동료', amount: state.fullStatistics.colleagueAmount, count: state.fullStatistics.colleagueCount },
    { name: '지인', amount: state.fullStatistics.acquaintanceAmount, count: state.fullStatistics.acquaintanceCount },
    { name: '기타', amount: state.fullStatistics.otherAmount, count: state.fullStatistics.otherCount },
  ];
});

// 받은 방법별 통계 selector
export const useSourceStats = () => useGiftMoneyStore((state) => {
  if (!state.fullStatistics) return null;

  return [
    { name: '현금', amount: state.fullStatistics.cashAmount, count: state.fullStatistics.cashCount },
    { name: '계좌이체', amount: state.fullStatistics.transferAmount, count: state.fullStatistics.transferCount },
  ];
});

// 월별 통계 selector
export const useMonthlyStats = () => useGiftMoneyStore((state) => 
  state.fullStatistics?.monthlyStats || []
);

// 감사 연락 미완료 목록 selector
export const useThanksNotSentList = () => useGiftMoneyStore((state) => 
  state.giftMoneyList.filter(item => !item.thanksSent)
);

// 감사 연락 완료 목록 selector
export const useThanksSentList = () => useGiftMoneyStore((state) => 
  state.giftMoneyList.filter(item => item.thanksSent)
);

// 최근 축의금 목록 selector (최신 5개)
export const useRecentGiftMoneyList = () => useGiftMoneyStore((state) => 
  state.giftMoneyList
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
);

// 금액별 통계 selector (백엔드와 일치하도록 수정)
export const useAmountRangeStats = () => {
  const giftMoneyList = useGiftMoneyStore((state) => state.giftMoneyList);
  
  return useMemo(() => {
    if (!giftMoneyList.length) return [];

    const ranges = [
      { min: 0, max: 30000, label: '3만원 미만' },
      { min: 30000, max: 50000, label: '3만원 이상 5만원 미만' },
      { min: 50000, max: 100000, label: '5만원 이상 10만원 미만' },
      { min: 100000, max: 200000, label: '10만원 이상 20만원 미만' },
      { min: 200000, max: 500000, label: '20만원 이상 50만원 이하' },
      { min: 500000, max: Infinity, label: '50만원 초과' },
    ];

    return ranges.map(range => {
      const count = giftMoneyList.filter(item => {
        if (range.min === 0 && range.max === 30000) {
          // 3만원 미만: < 30,000
          return item.amount < range.max;
        } else if (range.min === 30000 && range.max === 50000) {
          // 3만원 이상 5만원 미만: 30,000 ≤ amount < 50,000
          return item.amount >= range.min && item.amount < range.max;
        } else if (range.min === 50000 && range.max === 100000) {
          // 5만원 이상 10만원 미만: 50,000 ≤ amount < 100,000
          return item.amount >= range.min && item.amount < range.max;
        } else if (range.min === 100000 && range.max === 200000) {
          // 10만원 이상 20만원 미만: 100,000 ≤ amount < 200,000
          return item.amount >= range.min && item.amount < range.max;
        } else if (range.min === 200000 && range.max === 500000) {
          // 20만원 이상 50만원 이하: 200,000 ≤ amount ≤ 500,000
          return item.amount >= range.min && item.amount <= range.max;
        } else if (range.max === Infinity) {
          // 50만원 초과: > 500,000
          return item.amount > range.min;
        }
        return false;
      }).length;
      
      const totalAmount = giftMoneyList
        .filter(item => {
          if (range.min === 0 && range.max === 30000) {
            // 3만원 미만: < 30,000
            return item.amount < range.max;
          } else if (range.min === 30000 && range.max === 50000) {
            // 3만원 이상 5만원 미만: 30,000 ≤ amount < 50,000
            return item.amount >= range.min && item.amount < range.max;
          } else if (range.min === 50000 && range.max === 100000) {
            // 5만원 이상 10만원 미만: 50,000 ≤ amount < 100,000
            return item.amount >= range.min && item.amount < range.max;
          } else if (range.min === 100000 && range.max === 200000) {
            // 10만원 이상 20만원 미만: 100,000 ≤ amount < 200,000
            return item.amount >= range.min && item.amount < range.max;
          } else if (range.min === 200000 && range.max === 500000) {
            // 20만원 이상 50만원 이하: 200,000 ≤ amount ≤ 500,000
            return item.amount >= range.min && item.amount <= range.max;
          } else if (range.max === Infinity) {
            // 50만원 초과: > 500,000
            return item.amount > range.min;
          }
          return false;
        })
        .reduce((sum, item) => sum + item.amount, 0);

      return {
        ...range,
        count,
        totalAmount,
        averageAmount: count > 0 ? totalAmount / count : 0,
      };
    });
  }, [giftMoneyList]);
};
