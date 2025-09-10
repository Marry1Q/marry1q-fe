"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import { showSuccessToast } from "@/components/ui/toast"
import { detectBankFromAccountNumber, getBankCode, getBankLogo, detectBankNameFromAccountNumber } from "@/features/account/utils/bankUtils"
import Image from "next/image"

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

interface AutoTransferEditProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingRecurring: AutoTransferForm | null
  setEditingRecurring: (deposit: AutoTransferForm | null) => void
  onDelete: () => void
  onSave: () => void
  formatAmount: (value: string) => string
  isNew?: boolean
  isLoading?: boolean
}

export function AutoTransferEdit({
  isOpen,
  onOpenChange,
  editingRecurring,
  setEditingRecurring,
  onDelete,
  onSave,
  formatAmount,
  isNew = false,
  isLoading = false,
}: AutoTransferEditProps) {

  // 계좌번호 포맷팅 함수
  const formatAccountNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, "");
    if (number.length <= 3) return number;
    if (number.length <= 6) return `${number.slice(0, 3)}-${number.slice(3)}`;
    return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6, 12)}`;
  };

  const handleSave = () => {
    onSave()
    showSuccessToast(isNew ? "정기입금이 추가되었습니다" : "정기입금이 수정되었습니다")
  }

  const handleDelete = () => {
    onDelete()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl" style={{ fontFamily: 'Hana2-CM' }}>{isNew ? "자동이체 추가" : "자동이체 편집"}</DialogTitle>
        </DialogHeader>
        {editingRecurring && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recurring-name">계좌주명</Label>
              <Input
                id="recurring-name"
                value={editingRecurring.toAccountName}
                onChange={(e) => setEditingRecurring({ ...editingRecurring, toAccountName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurring-account">계좌번호</Label>
              <Input
                id="recurring-account"
                value={editingRecurring.toAccountNumber || ""}
                onChange={(e) => {
                  const formatted = formatAccountNumber(e.target.value);
                  setEditingRecurring({ 
                    ...editingRecurring, 
                    toAccountNumber: formatted
                  });
                }}
                placeholder="000-000-000000"
                maxLength={14}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurring-bank-name">은행명</Label>
              <Input
                id="recurring-bank-name"
                value={editingRecurring.bankName || ""}
                onChange={(e) => setEditingRecurring({ 
                  ...editingRecurring, 
                  bankName: e.target.value 
                })}
                placeholder="은행을 아래에서 선택해주세요"
              />
              {/* 은행 추천 표시 */}
              {(() => {
                const recommendedBank = detectBankNameFromAccountNumber(editingRecurring.toAccountNumber || "");
                const showRecommendation = recommendedBank && 
                  !editingRecurring.bankName && 
                  (editingRecurring.toAccountNumber || "").replace(/[^\d]/g, "").length >= 3;
                
                return showRecommendation ? (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingRecurring({
                        ...editingRecurring,
                        bankName: recommendedBank
                      })}
                      className="text-sm flex items-center gap-2"
                    >
                      {(() => {
                        const bankCode = getBankCode(recommendedBank);
                        const bankLogo = bankCode ? getBankLogo(bankCode) : null;
                        return (
                          <>
                            {bankLogo && (
                              <Image
                                src={bankLogo}
                                alt={`${recommendedBank} 로고`}
                                width={20}
                                height={20}
                                className="w-5 h-5"
                              />
                            )}
                            {recommendedBank}
                          </>
                        );
                      })()}
                    </Button>
                  </div>
                ) : null;
              })()}
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurring-amount">금액</Label>
              <div className="relative">
                <Input
                  id="recurring-amount"
                  type="text"
                  value={formatAmount(editingRecurring.amount.toString())}
                  onChange={(e) =>
                    setEditingRecurring({
                      ...editingRecurring,
                      amount: Number(e.target.value.replace(/,/g, "")),
                    })
                  }
                  className="text-right pr-8"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">원</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurring-frequency">주기</Label>
              <Select
                value={editingRecurring.frequency}
                onValueChange={(value) => setEditingRecurring({ ...editingRecurring, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="매월 1일">매월 1일</SelectItem>
                  <SelectItem value="매월 15일">매월 15일</SelectItem>
                  <SelectItem value="매월 25일">매월 25일</SelectItem>
                  <SelectItem value="매주 월요일">매주 월요일</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurring-memo">메모</Label>
              <Input
                id="recurring-memo"
                value={editingRecurring.memo || ""}
                onChange={(e) => setEditingRecurring({ 
                  ...editingRecurring, 
                  memo: e.target.value 
                })}
                placeholder="메모를 입력하세요 (예: 월급 이체)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurring-period">자동이체 기간 (개월)</Label>
              <Input
                id="recurring-period"
                type="number"
                min="1"
                max="60"
                value={editingRecurring.periodMonths}
                onChange={(e) => setEditingRecurring({ 
                  ...editingRecurring, 
                  periodMonths: parseInt(e.target.value) || 1
                })}
                placeholder="자동이체를 진행할 개월 수를 입력하세요"
              />
              <p className="text-sm text-gray-500">
                자동이체를 몇 개월 동안 진행할지 설정합니다. (1-60개월)
              </p>
            </div>
          </div>
        )}
        <DialogFooter className="flex justify-between">
          {!isNew && (
            <Button variant="outline" className="text-red-600" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button 
              style={{ backgroundColor: "#008485" }} 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "처리중..." : (isNew ? "추가" : "저장")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 