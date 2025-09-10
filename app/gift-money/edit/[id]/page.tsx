"use client";

import { useState, useEffect } from "react";
import { GiftMoneyForm } from "@/features/giftMoney/components/GiftMoneyForm";
import { colors } from "@/constants/colors";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { showConfirmDialog } from "@/components/ui/CustomAlert";
import { giftMoneyApi, GiftMoneyResponse, UpdateGiftMoneyRequest } from "@/features/giftMoney/api/giftMoneyApi";
import { useFetchSummaryStatistics, useFetchFullStatistics } from "@/features/giftMoney/store/selectors";

export default function EditGiftMoneyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const giftMoneyId = Number(id);

  // Store 액션들
  const fetchSummaryStatistics = useFetchSummaryStatistics();
  const fetchFullStatistics = useFetchFullStatistics();

  // 상태 관리
  const [giftMoney, setGiftMoney] = useState<GiftMoneyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 축의금 데이터 조회
  useEffect(() => {
    const fetchGiftMoney = async () => {
      try {
        setIsLoading(true);
        const response = await giftMoneyApi.getGiftMoney(giftMoneyId);
        setGiftMoney(response.data!);
      } catch (error) {
        console.error('축의금 조회 실패:', error);
        toast.error("축의금 정보를 불러오는데 실패했습니다.", {
          style: {
            background: colors.danger.light,
            color: colors.danger.main,
            border: `1px solid ${colors.danger.main}`,
            fontFamily: "Hana2-Medium",
          },
        });
        router.push("/gift-money");
      } finally {
        setIsLoading(false);
      }
    };

    if (giftMoneyId) {
      fetchGiftMoney();
    }
  }, [giftMoneyId, router]);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // 폼 데이터를 API 요청 형식으로 변환
      const requestData: UpdateGiftMoneyRequest = {
        name: data.name,
        amount: typeof data.amount === 'string' ? parseInt(data.amount.replace(/,/g, '')) : data.amount,
        relationship: data.relationship.toUpperCase() as 'FAMILY' | 'RELATIVE' | 'FRIEND' | 'COLLEAGUE' | 'ACQUAINTANCE' | 'OTHER',
        source: data.source.toUpperCase() as 'CASH' | 'TRANSFER',
        phone: data.phone || undefined,
        address: data.address || undefined,
        memo: data.memo || undefined,
        giftDate: data.date.toISOString().split('T')[0] // Date를 "yyyy-MM-dd" 형식으로 변환
      };

      // 축의금 수정
      await giftMoneyApi.updateGiftMoney(giftMoneyId, requestData);
      
      // 감사 상태가 변경된 경우 별도 API 호출
      if (data.thanksCompleted !== giftMoney?.thanksSent) {
        const thanksData = {
          thanksSent: data.thanksCompleted,
          thanksDate: data.thanksCompleted ? new Date().toISOString().split('T')[0] : undefined,
          thanksSentBy: data.thanksCompleted ? "사용자" : undefined
        };
        
        await giftMoneyApi.updateThanksStatus(giftMoneyId, thanksData);
      }
      
      toast.success("축의금이 수정되었습니다!", {
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

      // 수정 완료 후 목록 페이지로 이동
      router.push("/gift-money");
    } catch (error) {
      console.error('축의금 수정 실패:', error);
      toast.error("축의금 수정에 실패했습니다.", {
        style: {
          background: colors.danger.light,
          color: colors.danger.main,
          border: `1px solid ${colors.danger.main}`,
          fontFamily: "Hana2-Medium",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const result = await showConfirmDialog({
      title: "정말로 이 축의금을 삭제하시겠습니까?",
      confirmButtonText: "삭제하기",
      cancelButtonText: "취소",
      showCancelButton: true,
    });
    
    if (result.isConfirmed) {
      try {
        await giftMoneyApi.deleteGiftMoney(giftMoneyId);
        
        toast.success("축의금이 삭제되었습니다.", {
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

        // 삭제 완료 후 목록 페이지로 이동
        router.push("/gift-money");
      } catch (error) {
        console.error('축의금 삭제 실패:', error);
        toast.error("축의금 삭제에 실패했습니다.", {
          style: {
            background: colors.danger.light,
            color: colors.danger.main,
            border: `1px solid ${colors.danger.main}`,
            fontFamily: "Hana2-Medium",
          },
        });
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // 로딩 중이거나 데이터가 없으면 로딩 표시
  if (isLoading || !giftMoney) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // 폼에 전달할 초기 데이터 변환
  const initialData = {
    id: giftMoney.giftMoneyId,
    name: giftMoney.name,
    amount: giftMoney.amount.toLocaleString(), // 구분표가 포함된 형태로 변환
    relationship: giftMoney.relationship.toLowerCase(),
    source: giftMoney.source.toLowerCase(),
    phone: giftMoney.phone || "",
    address: giftMoney.address || "",
    memo: giftMoney.memo || "",
    date: new Date(giftMoney.giftDate),
    thanksCompleted: giftMoney.thanksSent
  };

  return (
    <GiftMoneyForm
      isEditMode={true}
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onDelete={handleDelete}
      isSubmitting={isSubmitting}
    />
  );
} 