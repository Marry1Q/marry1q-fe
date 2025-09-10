"use client"

import { useState, useMemo } from "react"
import { Pagination } from "@/components/layout/Pagination"
import { ListLayout } from "@/components/ui/ListLayout"
import { SearchInput } from "@/components/ui/SearchInput"
import { FilterSelect } from "@/components/ui/FilterSelect"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { AccountTransactionItem } from "./AccountTransactionItem"
import { GroupedAccountTransactionList } from "./GroupedAccountTransactionList"

interface Transaction {
  id: number
  type: string
  description: string
  amount: number
  date: string
  time: string
  from: string
  to: string
  color: string
  category: string
  categoryIcon?: string
}

interface AccountTransactionProps {
  transactions: Transaction[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  accountBalance: number
}

export function AccountTransaction({ transactions, currentPage, totalPages, onPageChange, accountBalance }: AccountTransactionProps) {
  console.log('📋 AccountTransaction 컴포넌트 - 받은 거래내역:', transactions);
  console.log('🔢 거래내역 개수:', transactions.length);
  console.log('🆔 거래내역 ID 목록:', transactions.map(t => t.id));
  
  // 필터링 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("전체");
  const [typeFilter, setTypeFilter] = useState("전체");

  // 필터 초기화 함수
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedPeriod("전체");
    setTypeFilter("전체");
  };

  // 필터가 적용되었는지 확인
  const isFilterApplied = searchTerm || selectedPeriod !== "전체" || typeFilter !== "전체";

  // 필터 옵션들
  const periodOptions = [
    { value: "전체", label: "전체 기간" },
    { value: "이번 달", label: "이번 달" },
    { value: "지난 달", label: "지난 달" },
    { value: "3개월 전", label: "3개월 전" },
    { value: "6개월 전", label: "6개월 전" },
  ];

  const typeOptions = [
    { value: "전체", label: "전체" },
    { value: "입금", label: "입금" },
    { value: "출금", label: "출금" },
  ];

  // 필터링된 거래내역
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // 검색어 필터링
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.to.toLowerCase().includes(searchTerm.toLowerCase());

      // 거래 유형 필터링
      const matchesType = typeFilter === "전체" || transaction.type === typeFilter;

      // 기간 필터링
      let matchesDate = true;
      const transactionDate = new Date(transaction.date);
      const today = new Date();

      if (selectedPeriod === "이번 달") {
        matchesDate =
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear();
      } else if (selectedPeriod === "지난 달") {
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
        matchesDate =
          transactionDate.getMonth() === lastMonth.getMonth() &&
          transactionDate.getFullYear() === lastMonth.getFullYear();
      } else if (selectedPeriod === "3개월 전") {
        const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3);
        matchesDate = transactionDate >= threeMonthsAgo;
      } else if (selectedPeriod === "6개월 전") {
        const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6);
        matchesDate = transactionDate >= sixMonthsAgo;
      }

      return matchesSearch && matchesType && matchesDate;
    });
  }, [transactions, searchTerm, selectedPeriod, typeFilter]);

  // 필터링된 결과 개수
  const filteredCount = filteredTransactions.length;
  const totalCount = transactions.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl" style={{ fontFamily: 'Hana2-CM' }}>거래내역</h1>
      </div>

      {/* 검색 및 필터 섹션 */}
      <div className="space-y-4 mb-6">
        {/* 검색바와 필터를 한 열에 배치 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="거래내역, 계좌번호, 설명 검색"
            />
          </div>
          <FilterSelect
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            options={periodOptions}
            placeholder="기간"
            className="w-32"
          />
          <FilterSelect
            value={typeFilter}
            onValueChange={setTypeFilter}
            options={typeOptions}
            placeholder="입출금"
            className="w-24"
          />
        </div>

        {/* 필터링 결과 표시 및 초기화 버튼 */}
        <div className="flex items-center justify-end text-sm text-gray-600 px-2">
          <span>
            총 {totalCount}건 중 {filteredCount}건 표시
            {isFilterApplied && (
              <span className="ml-2 text-blue-600">
                (필터 적용됨)
              </span>
            )}
          </span>
          {isFilterApplied && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
            >
              <X className="w-3 h-3" />
              필터 초기화
            </Button>
          )}
        </div>
      </div>

      <GroupedAccountTransactionList
        transactions={filteredTransactions}
        accountBalance={accountBalance}
      />
      
      {filteredTransactions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {totalCount === 0 ? "거래내역이 없습니다." : "검색 조건에 맞는 거래내역이 없습니다."}
        </div>
      )}
      
      {filteredTransactions.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  )
} 