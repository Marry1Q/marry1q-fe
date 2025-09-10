"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Target,
  TrendingUp,
  Users,
  ArrowDownLeft,
  Send,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Calendar,
  ShoppingBag,
  Utensils,
  Gift,
  MoreHorizontal,
  Trash2,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Home,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { colors, getGradient } from "../../constants/colors";
import MainLayout from "@/components/layout/MainLayout";
import { AccountTabs } from "../../features/account/components/AccountTabs";
import { AccountTransaction } from "../../features/account/components/AccountTransaction";

import { CheckCard } from "../../features/account/components/CheckCard";
import { AutoTransfer } from "../../features/account/components/AutoTransfer";
import { toast } from "sonner";
import { AccountOverview } from "@/features/account/components/AccountOverview";
import { DashboardInfoCard } from "@/components/ui/DashboardInfoCard";
import { AutoTransferCard } from "@/features/account/components/AutoTransferCard";
import { 
  useAccounts, 
  useAutoTransfers, 
  useMeetingAccount,
  useTransactions as useAccountTransactions,
  usePagination,
  useAccountsLoading, 
  useAccountsError, 
  useFetchAccounts, 
  useFetchAutoTransfers,
  useFetchMeetingAccount,
  useFetchTransactions
} from "@/features/account/store/selectors";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function AccountPage() {
  // Zustand Store 사용
  const accounts = useAccounts();
  const autoTransfers = useAutoTransfers();
  const meetingAccount = useMeetingAccount();
  const transactions = useAccountTransactions();
  const pagination = usePagination();
  const isLoading = useAccountsLoading();
  const error = useAccountsError();
  const fetchAccounts = useFetchAccounts();
  const fetchAutoTransfers = useFetchAutoTransfers();
  const fetchMeetingAccount = useFetchMeetingAccount();
  const fetchTransactions = useFetchTransactions();

  // 컴포넌트 상태 관리
  const [activeTab, setActiveTab] = useState("overview");
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [cardNickname, setCardNickname] = useState("우리 모임통장 카드");
  const [isEditRecurringOpen, setIsEditRecurringOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<any>(null);
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
  const [dailyLimit, setDailyLimit] = useState("5000000");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // 페이지 전체 로딩 상태 관리
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsPageLoading(true);
      setIsDataLoaded(false);
      
      try {
        console.log('🚀 페이지 데이터 로드 시작');
        
        // 계좌 목록, 자동이체 목록, 모임통장 정보, 거래내역을 병렬로 로드
        await Promise.all([
          fetchAccounts(),
          fetchAutoTransfers(),
          fetchMeetingAccount(),
          fetchTransactions(0, 20)
        ]);
        
        console.log('✅ 모든 데이터 로드 완료');
        setIsDataLoaded(true);
      } catch (err) {
        console.error('계정 데이터 로드 실패:', err);
      } finally {
        // 모든 데이터 로드가 완료된 후에만 로딩 상태 해제
        setTimeout(() => {
          setIsPageLoading(false);
        }, 500); // 0.5초 지연으로 깜빡임 방지
      }
    };

    loadData();
  }, [fetchAccounts, fetchAutoTransfers, fetchMeetingAccount, fetchTransactions]);

  // 페이지 로딩 중 표시
  if (isPageLoading) {
    return (
      <LoadingSpinner
        variant="fullscreen"
        text="로딩중..."
      />
    );
  }

  // 데이터가 로드되지 않았거나 에러 상태 표시
  if (!isDataLoaded || error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-destructive">
              {error || '데이터를 불러오는데 실패했습니다.'}
            </p>
            <Button onClick={() => window.location.reload()}>
              다시 시도
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 모임통장 정보 (실제 API 데이터 사용)
  const accountBalance = meetingAccount?.balance || 0;
  const accountNumber = meetingAccount?.accountNumber || "";
  const accountName = meetingAccount?.accountName || "";
  const cardNumber = meetingAccount?.cardNumber || "5310-****-****-1234";

  // 자동이체 카드 클릭 핸들러
  const handleAutoTransferCardClick = () => {
    setActiveTab("recurring");
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "recurring") {
      // 자동이체 탭으로 이동할 때 데이터 새로고침
      fetchAutoTransfers();
    }
  };

  // 거래내역 데이터 (실제 API 데이터 사용) - 컴포넌트 호환성을 위한 변환
  console.log('🔍 원본 거래내역 데이터:', transactions);
  
  const sortedTransactions = transactions.map(t => ({
    id: t.id,
    type: t.type,
    description: t.description,
    amount: t.amount,
    date: t.transactionDate,
    time: t.transactionTime,
    from: t.fromName,
    to: t.toName,
    categoryIcon: t.categoryIcon,
    color: t.type === '입금' ? 'text-green-500' : 'text-red-500',
    category: t.categoryName || '기타',
    balanceAfterTransaction: t.balanceAfterTransaction
  })) || [];
  
  console.log('🔄 변환된 거래내역 데이터:', sortedTransactions);
  console.log('📊 중복 확인 - ID 목록:', sortedTransactions.map(t => t.id));
  
  // 페이지네이션된 거래내역 (API에서 이미 페이징된 데이터를 받아오므로 그대로 사용)
  const paginatedTransactions = sortedTransactions;

  // 페이지네이션 계산
  const totalPages = Math.ceil(pagination.total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const formatAmount = (value: string) => {
    const number = value.replace(/[^\d]/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleDailyLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value);
    setDailyLimit(formatted);
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(accountNumber);
    toast.success("복사 완료!", {
      style: {
        background: colors.primary.toastBg,
        color: colors.primary.main,
        border: `1px solid ${colors.primary.main}`,
        fontFamily: "Hana2-Medium",
      },
    });
  };

  const saveDailyLimit = () => {
    toast.success("일일 한도가 저장되었습니다", {
      style: {
        background: colors.primary.toastBg,
        color: colors.primary.main,
        border: `1px solid ${colors.primary.main}`,
        fontFamily: "Hana2-Medium",
      },
    });
    setIsLimitDialogOpen(false);
  };



  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl" style={{ fontFamily: "Hana2-CM" }}>
            모임통장
          </h1>
        </div>
        <div className="grid grid-cols-4 gap-6 mb-6">
          {/* AccountOverview - 2칸 차지 */}
          <div className="col-span-2">
            <div className="h-60 overflow-hidden">
              <AccountOverview
                accountBalance={accountBalance}
                accountNumber={accountNumber}
                accountName={accountName}
                isBalanceVisible={isBalanceVisible}
                setIsBalanceVisible={setIsBalanceVisible}
              />
            </div>
          </div>
          {/* 자동이체 일정 카드 - 1칸 차지 */}
          <div className="col-span-1">
            <AutoTransferCard
              recurringDeposits={autoTransfers}
              onCardClick={handleAutoTransferCardClick}
            />
          </div>
          {/* 빈 공간 - 1칸 */}
          <div className="col-span-1"></div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <AccountTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {activeTab === "overview" && (
          <AccountTransaction
            transactions={paginatedTransactions}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
          setCurrentPage(page);
          fetchTransactions(page - 1, itemsPerPage); // API 호출 (0-based index)
        }}
            accountBalance={accountBalance}
          />
        )}

        {activeTab === "recurring" && (
          <AutoTransfer
            recurringDeposits={autoTransfers}
            formatAmount={formatAmount}
            meetingAccount={meetingAccount ? { accountNumber: meetingAccount.accountNumber, bankCode: meetingAccount.bank } : undefined}
          />
        )}



        {activeTab === "card" && (
          <CheckCard
            cardNickname={cardNickname}
            setCardNickname={setCardNickname}
            cardNumber={cardNumber}
            dailyLimit={dailyLimit}
            setDailyLimit={setDailyLimit}
            isLimitDialogOpen={isLimitDialogOpen}
            setIsLimitDialogOpen={setIsLimitDialogOpen}
            handleDailyLimitChange={handleDailyLimitChange}
            saveDailyLimit={saveDailyLimit}
          />
        )}
      </div>
    </MainLayout>
  );
}
