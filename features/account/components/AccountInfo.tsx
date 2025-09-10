"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Download } from "lucide-react"

interface AccountInfoProps {
  accountNumber: string
  downloadBankbook: () => void
}

export function AccountInfo({ accountNumber, downloadBankbook }: AccountInfoProps) {
  return (
    <div className="max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl" style={{ fontFamily: 'Hana2-CM' }}>계좌정보</h1>
      </div>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label>계좌명</Label>
            <Input value="민수♥지은 모임통장" readOnly />
          </div>
          <div className="space-y-2">
            <Label>계좌번호</Label>
            <Input value={accountNumber} readOnly />
          </div>
          <div className="space-y-2">
            <Label>은행</Label>
            <Input value="하나은행" readOnly />
          </div>
            <Button variant="outline" className="w-full" onClick={downloadBankbook}>
              <Download className="w-4 h-4 mr-2" />
              통장 사본 다운로드
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 