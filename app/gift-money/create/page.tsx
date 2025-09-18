"use client";

import { GiftMoneyForm } from "@/features/giftMoney/components/GiftMoneyForm";
import { colors } from "@/constants/colors";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { giftMoneyApi, CreateGiftMoneyRequest } from "@/features/giftMoney/api/giftMoneyApi";
import { useFetchSummaryStatistics, useFetchFullStatistics } from "@/features/giftMoney/store/selectors";
import { useEffect, useState } from "react";

export default function CreateGiftMoneyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchSummaryStatistics = useFetchSummaryStatistics();
  const fetchFullStatistics = useFetchFullStatistics();

  // 안심계좌 리뷰 데이터 확인
  const safeAccountTransactionId = searchParams.get('safeAccountTransactionId');
  const safeAccountDescription = searchParams.get('description');
  const safeAccountAmount = searchParams.get('amount');
  const safeAccountDate = searchParams.get('transactionDate');

  const handleSubmit = async (data: any) => {
    try {
      // 폼 데이터를 API 요청 형식으로 변환
      const requestData: CreateGiftMoneyRequest = {
        name: data.name,
        amount: typeof data.amount === 'string' ? parseInt(data.amount.replace(/,/g, '')) : data.amount,
        relationship: data.relationship.toUpperCase() as 'FAMILY' | 'RELATIVE' | 'FRIEND' | 'COLLEAGUE' | 'ACQUAINTANCE' | 'OTHER',
        source: data.source.toUpperCase() as 'CASH' | 'TRANSFER',
        phone: data.phone || undefined,
        address: data.address || undefined,
        memo: data.memo || undefined,
        giftDate: data.date.toISOString().split('T')[0] // Date를 "yyyy-MM-dd" 형식으로 변환
      };

      // 축의금 생성
      const response = await giftMoneyApi.createGiftMoney(requestData);
      
      // 감사 상태가 완료로 설정된 경우에만 별도 API 호출 (기본값은 미완료)
      if (data.thanksCompleted) {
        const thanksData = {
          thanksSent: true,
          thanksDate: new Date().toISOString().split('T')[0],
          thanksSentBy: "사용자"
        };
        
        await giftMoneyApi.updateThanksStatus(response.data!.giftMoneyId, thanksData);
      }

      // 안심계좌 거래내역에서 가져온 데이터인 경우 리뷰 상태 변경
      if (safeAccountTransactionId) {
        await giftMoneyApi.updateSafeAccountTransactionReviewStatus(
          parseInt(safeAccountTransactionId), 
          { reviewStatus: 'REVIEWED' }
        );
      }
      
      toast.success("축의금이 등록되었습니다!", {
        style: {
          background: colors.primary.toastBg,
          color: colors.primary.main,
          border: `1px solid ${colors.primary.main}`,
          fontFamily: "Hana2-Medium",
        },
      });

      // 통계 데이터 새로고침 (요약 통계와 전체 통계 모두)
      await Promise.all([
        fetchSummaryStatistics(),
        fetchFullStatistics()
      ]);

      // 등록 완료 후 목록 페이지로 이동
      router.push("/gift-money");
    } catch (error) {
      console.error('축의금 생성 실패:', error);
      toast.error("축의금 등록에 실패했습니다.", {
        style: {
          background: colors.danger.light,
          color: colors.danger.main,
          border: `1px solid ${colors.danger.main}`,
          fontFamily: "Hana2-Medium",
        },
      });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // 안심계좌 데이터를 초기값으로 설정
  const initialData = safeAccountTransactionId ? {
    name: safeAccountDescription || "",
    amount: safeAccountAmount ? parseInt(safeAccountAmount).toLocaleString() : "",
    relationship: "",
    source: "transfer", // 계좌이체로 고정
    phone: "",
    address: "",
    memo: "",
    date: safeAccountDate ? new Date(safeAccountDate) : new Date(),
    thanksCompleted: false
  } : undefined;

  return (
    <GiftMoneyForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      initialData={initialData}
    />
  );
} 