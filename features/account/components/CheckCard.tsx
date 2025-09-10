"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CheckCardProps {
  cardNickname: string
  setCardNickname: (nickname: string) => void
  cardNumber: string
  dailyLimit: string
  setDailyLimit: (limit: string) => void
  isLimitDialogOpen: boolean
  setIsLimitDialogOpen: (open: boolean) => void
  handleDailyLimitChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  saveDailyLimit: () => void
}

export function CheckCard({
  cardNickname,
  setCardNickname,
  cardNumber,
  dailyLimit,
  setDailyLimit,
  isLimitDialogOpen,
  setIsLimitDialogOpen,
  handleDailyLimitChange,
  saveDailyLimit,
}: CheckCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-3xl mb-6" style={{ fontFamily: 'Hana2-CM' }}>체크카드 정보</h1>
        <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex justify-center">
            <img src="/HanaCard.png" alt="체크카드" className="w-1/2" />
          </div>

          <div className="space-y-2">
            <Label>카드번호</Label>
            <Input value={cardNumber} readOnly />
          </div>

          <div className="space-y-2">
            <Label>카드 별명</Label>
            <Input value={cardNickname} onChange={(e) => setCardNickname(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>카드 상태<Badge className="bg-green-100 text-green-800 ml-2">정상</Badge></Label>
          </div>
        </CardContent>
      </Card>
    </div>

    <div>
        <h1 className="text-3xl mb-6" style={{ fontFamily: 'Hana2-CM' }}>체크카드 설정</h1>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">일일 한도</p>
                <p className="text-sm text-gray-500">하루 최대 사용 금액</p>
              </div>
              <div className="text-right flex items-center gap-2">
                <p className="font-bold">{Number(dailyLimit).toLocaleString()}원</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600"
                  onClick={() => setIsLimitDialogOpen(true)}
                >
                  변경
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">해외 사용</p>
                <p className="text-sm text-gray-500">해외 결제 허용</p>
              </div>
              <Badge variant="outline">허용</Badge>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button variant="outline" className="w-full">
              카드 일시정지
            </Button>
            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
              카드 분실신고
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isLimitDialogOpen} onOpenChange={setIsLimitDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>일일 한도 변경</DialogTitle>
            <DialogDescription>체크카드 일일 사용 한도를 변경합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="daily-limit">일일 한도</Label>
              <div className="relative">
                <Input
                  id="daily-limit"
                  type="text"
                  value={dailyLimit}
                  onChange={handleDailyLimitChange}
                  className="text-right pr-8"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">원</span>
              </div>
              <p className="text-xs text-gray-500">최대 1,000만원까지 설정 가능합니다.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLimitDialogOpen(false)}>
              취소
            </Button>
            <Button style={{ backgroundColor: "#008485" }} onClick={saveDailyLimit}>
              변경하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  )
} 