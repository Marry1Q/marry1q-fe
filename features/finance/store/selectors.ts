import { useFinanceStore } from './financeStore';
import { TransactionResponse } from '../types/transaction';
import { parseBigDecimal } from '../utils/currencyUtils';

// 필터링된 거래 내역 선택자
export const useFilteredTransactions = () => {
  const { transactions, filters } = useFinanceStore();
  
  return transactions.filter((transaction) => {
    // 검색어 필터링
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchLower) ||
        (transaction.memo && transaction.memo.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }
    
    // 카테고리 필터링
    if (filters.categoryId && transaction.categoryId !== filters.categoryId) {
      return false;
    }
    
    // 사용자 필터링
    if (filters.userSeqNo && transaction.userSeqNo !== filters.userSeqNo) {
      return false;
    }
    
    // 거래 타입 필터링
    if (filters.transactionType && transaction.transactionType !== filters.transactionType) {
      return false;
    }
    
    // 날짜 범위 필터링
    if (filters.startDate && transaction.transactionDate < filters.startDate) {
      return false;
    }
    
    if (filters.endDate && transaction.transactionDate > filters.endDate) {
      return false;
    }
    
    return true;
  });
};

// 카테고리별 통계 선택자
export const useCategoryStats = () => {
  const { transactions } = useFinanceStore();
  
  const stats = transactions.reduce((acc, transaction) => {
    const categoryId = transaction.categoryId;
    const amount = parseBigDecimal(transaction.amount);
    
    if (!acc[categoryId]) {
      acc[categoryId] = {
        categoryId,
        categoryName: transaction.categoryName,
        totalAmount: 0,
        transactionCount: 0,
        incomeAmount: 0,
        expenseAmount: 0,
      };
    }
    
    acc[categoryId].totalAmount += amount;
    acc[categoryId].transactionCount += 1;
    
    if (transaction.transactionType === 'INCOME') {
      acc[categoryId].incomeAmount += amount;
    } else {
      acc[categoryId].expenseAmount += amount;
    }
    
    return acc;
  }, {} as Record<number, {
    categoryId: number;
    categoryName: string;
    totalAmount: number;
    transactionCount: number;
    incomeAmount: number;
    expenseAmount: number;
  }>);
  
  return Object.values(stats);
};

// 전체 통계 선택자
export const useTotalStats = () => {
  const { transactions } = useFinanceStore();
  
  return transactions.reduce((acc, transaction) => {
    const amount = parseBigDecimal(transaction.amount);
    
    if (transaction.transactionType === 'INCOME') {
      acc.totalIncome += amount;
    } else {
      acc.totalExpense += amount;
    }
    
    acc.totalTransactions += 1;
    
    return acc;
  }, {
    totalIncome: 0,
    totalExpense: 0,
    totalTransactions: 0,
    netAmount: 0,
  });
};

// 사용자별 통계 선택자
export const useUserStats = () => {
  const { transactions } = useFinanceStore();
  
  const stats = transactions.reduce((acc, transaction) => {
    const userSeqNo = transaction.userSeqNo;
    const userName = transaction.userName;
    const amount = parseBigDecimal(transaction.amount);
    
    if (!acc[userSeqNo]) {
      acc[userSeqNo] = {
        userSeqNo,
        userName: userName || 'Unknown',
        totalAmount: 0,
        transactionCount: 0,
        incomeAmount: 0,
        expenseAmount: 0,
      };
    }
    
    acc[userSeqNo].totalAmount += amount;
    acc[userSeqNo].transactionCount += 1;
    
    if (transaction.transactionType === 'INCOME') {
      acc[userSeqNo].incomeAmount += amount;
    } else {
      acc[userSeqNo].expenseAmount += amount;
    }
    
    return acc;
  }, {} as Record<string, {
    userSeqNo: string;
    userName: string;
    totalAmount: number;
    transactionCount: number;
    incomeAmount: number;
    expenseAmount: number;
  }>);
  
  return Object.values(stats);
};

// 예산 사용률 계산 선택자
export const useBudgetUsageRate = (categoryId: number, budgetAmount: string) => {
  const { transactions } = useFinanceStore();
  
  const spentAmount = transactions
    .filter(t => t.categoryId === categoryId && t.transactionType === 'EXPENSE')
    .reduce((sum, t) => sum + parseBigDecimal(t.amount), 0);
  
  const budget = parseBigDecimal(budgetAmount);
  const usageRate = budget > 0 ? (spentAmount / budget) * 100 : 0;
  
  return {
    spentAmount,
    budgetAmount: budget,
    usageRate,
    remainingAmount: budget - spentAmount,
  };
};
