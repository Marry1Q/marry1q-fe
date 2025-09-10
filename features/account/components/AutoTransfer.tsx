"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AutoTransferItem } from "./AutoTransferItem"
import { AutoTransferEdit } from "./AutoTransferEdit"
import { useState } from "react"
import { showErrorToast } from "@/components/ui/toast"
import { useCreateAutoTransfer, useUpdateAutoTransfer, useDeleteAutoTransfer, useIsCreatingAutoTransfer } from "../store/selectors"
import { AutoTransfer as AutoTransferType } from "../types/account"
import { getBankCode, getBankName } from "../utils/bankUtils";
import { colors } from "@/constants/colors";

interface AutoTransferForm {
  id: number
  toAccountName: string
  toAccountNumber: string
  bankName: string
  amount: number
  frequency: string
  memo?: string
  periodMonths: number
}

interface AutoTransferProps {
  recurringDeposits: AutoTransferType[]
  formatAmount: (value: string) => string
  meetingAccount?: {
    accountNumber: string;
    bankCode: string;
  };
}

export function AutoTransfer({ recurringDeposits, formatAmount, meetingAccount }: AutoTransferProps) {
  const [isEditRecurringOpen, setIsEditRecurringOpen] = useState(false)
  const [editingRecurring, setEditingRecurring] = useState<AutoTransferForm | null>(null)
  const [isNew, setIsNew] = useState(false)
  
  console.log('자동이체 목록 데이터:', recurringDeposits)
  
  const createAutoTransfer = useCreateAutoTransfer()
  const updateAutoTransfer = useUpdateAutoTransfer()
  const deleteAutoTransfer = useDeleteAutoTransfer()
  const isCreating = useIsCreatingAutoTransfer()

  const handleAddNew = () => {
    setEditingRecurring({
      id: Date.now(),
      toAccountName: "",
      toAccountNumber: "",
      bankName: "",
      amount: 0,
      frequency: "매월 25일",
      memo: "",
      periodMonths: 12,
    })
    setIsNew(true)
    setIsEditRecurringOpen(true)
  }

  // 데이터가 없을 때 표시할 메시지
  if (!recurringDeposits || recurringDeposits.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl" style={{ fontFamily: 'Hana2-CM' }}>자동이체 관리</h1>
          <Button 
            onClick={handleAddNew}
            style={{ backgroundColor: colors.primary.main }}
            className="hover:bg-[#006b6b] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            추가
          </Button>
        </div>
        <div className="text-center py-8 text-gray-500">
          등록된 자동이체가 없습니다.
        </div>
      </div>
    );
  }

  const handleEditRecurring = (deposit: AutoTransferType) => {
    console.log('편집할 자동이체 데이터:', deposit)
    
    // 은행코드를 은행명으로 변환
    const bankName = deposit.toBankCode ? (getBankName(deposit.toBankCode) || "") : "";
    
    setEditingRecurring({
      id: deposit.id,
      toAccountName: deposit.name,
      toAccountNumber: deposit.toAccountNumber || "", // 실제 데이터 사용
      bankName: bankName, // 은행코드를 은행명으로 변환
      amount: deposit.amount,
      frequency: deposit.frequency,
      memo: deposit.memo || `${deposit.name} 자동이체`,
      periodMonths: deposit.periodMonths || 12, // 기본값 12개월
    })
    setIsNew(false)
    setIsEditRecurringOpen(true)
  }

  const handleDeleteRecurring = async (deposit: AutoTransferType) => {
    console.log("삭제할 자동이체 ID:", deposit.id)
    
    try {
      const success = await deleteAutoTransfer(deposit.id)
      
      if (success) {
        setIsEditRecurringOpen(false)
      }
      // 토스트는 store에서 처리되므로 여기서는 제거
    } catch (error) {
      console.error("자동이체 삭제 중 에러:", error)
      // 에러 토스트는 store에서 처리되므로 여기서는 제거
    }
  }

  const saveRecurringEdit = async () => {
    if (!editingRecurring) return
    
    try {
      console.log("자동이체 저장 시작:", editingRecurring)
      
      // 모임통장 정보에서 계좌번호 가져오기
      if (!meetingAccount?.accountNumber) {
        showErrorToast('모임통장 정보 조회에 실패했습니다.');
        return;
      }
      
      // 은행명을 은행코드로 변환
      const bankCode = getBankCode(editingRecurring.bankName);
      if (!bankCode) {
        showErrorToast('지원하지 않는 은행입니다. 정확한 은행명을 입력해주세요.');
        return;
      }

      // API 요청 데이터 구성 (백엔드 DTO와 정확히 일치)
      const requestData = {
        toAccountNumber: editingRecurring.toAccountNumber,
        toAccountName: editingRecurring.toAccountName,
        toBankCode: bankCode,
        amount: editingRecurring.amount,
        frequency: editingRecurring.frequency,
        memo: editingRecurring.memo || `${editingRecurring.toAccountName} 자동이체`,
        periodMonths: editingRecurring.periodMonths
      }
      
      console.log("API 요청 데이터:", requestData)
      
      let success = false
      
      if (isNew) {
        // 새로 생성 - fromAccountNumber 추가
        const createData = {
          ...requestData,
          fromAccountNumber: meetingAccount.accountNumber
        }
        success = await createAutoTransfer(createData)
      } else {
        // 수정 - PUT /api/account/auto-transfers/{id} 사용
        success = await updateAutoTransfer(editingRecurring.id, requestData)
      }
      
      if (success) {
        console.log("자동이체 저장 성공")
        setIsEditRecurringOpen(false)
        setEditingRecurring(null)
      } else {
        console.error("자동이체 저장 실패")
      }
    } catch (error) {
      console.error("자동이체 저장 중 에러:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl" style={{ fontFamily: 'Hana2-CM' }}>자동이체 관리</h1>
        <Button 
          onClick={handleAddNew}
          style={{ backgroundColor: colors.primary.main }}
          className="hover:bg-[#006b6b] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          추가
        </Button>
      </div>
      
      <div className="space-y-4">
        {recurringDeposits.map((deposit) => (
          <AutoTransferItem
            key={deposit.id}
            deposit={deposit}
            onEdit={handleEditRecurring}
            onDelete={handleDeleteRecurring}
          />
        ))}
      </div>

      {isEditRecurringOpen && editingRecurring && (
        <AutoTransferEdit
          isOpen={isEditRecurringOpen}
          onOpenChange={setIsEditRecurringOpen}
          editingRecurring={editingRecurring}
          setEditingRecurring={setEditingRecurring}
          onDelete={() => {
            if (editingRecurring) {
              // 은행명을 은행코드로 변환
              const bankCode = getBankCode(editingRecurring.bankName) || "";
              
              handleDeleteRecurring({
                id: editingRecurring.id,
                name: editingRecurring.toAccountName,
                toAccountNumber: editingRecurring.toAccountNumber,
                toBankCode: bankCode,
                amount: editingRecurring.amount,
                frequency: editingRecurring.frequency,
                memo: editingRecurring.memo,
                nextDate: "",
                active: true
              })
            }
          }}
          onSave={saveRecurringEdit}
          formatAmount={formatAmount}
          isNew={isNew}
          isLoading={isCreating}
        />
      )}
    </div>
  )
} 