"use client";

import { GiftMoneyForm } from "@/features/giftMoney/components/GiftMoneyForm";
import { colors } from "@/constants/colors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { giftMoneyApi, CreateGiftMoneyRequest } from "@/features/giftMoney/api/giftMoneyApi";
import { useFetchSummaryStatistics, useFetchFullStatistics } from "@/features/giftMoney/store/selectors";

export default function CreateGiftMoneyPage() {
  const router = useRouter();
  const fetchSummaryStatistics = useFetchSummaryStatistics();
  const fetchFullStatistics = useFetchFullStatistics();

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

  return (
    <GiftMoneyForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
} 