"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { InvitationData } from "../../types/invitation"

interface GroomInfoCardProps {
  invitationData: InvitationData
  updateInvitationData: (field: string, value: any) => void
  updateNestedData: (parent: string, field: string, value: any) => void
}

export function GroomInfoCard({ 
  invitationData, 
  updateInvitationData, 
  updateNestedData 
}: GroomInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Hana2-CM' }}>신랑 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="groomName">이름</Label>
          <Input
            id="groomName"
            value={invitationData.groomName}
            onChange={(e) => updateInvitationData("groomName", e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="groomFather" >아버지 성함</Label>
          <Input
            id="groomFather"
            value={invitationData.groomParents.father}
            onChange={(e) => updateNestedData("groomParents", "father", e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="groomMother">어머니 성함</Label>
          <Input
            id="groomMother"
            value={invitationData.groomParents.mother}
            onChange={(e) => updateNestedData("groomParents", "mother", e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="groomPhone">연락처</Label>
          <Input
            id="groomPhone"
            value={invitationData.contact.groom}
            onChange={(e) => updateNestedData("contact", "groom", e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="groomAccount">계좌번호</Label>
          <Input
            id="groomAccount"
            value={invitationData.accountInfo.groom.accountNumber}
            onChange={(e) => {
              const updatedGroomAccount = { ...invitationData.accountInfo.groom, accountNumber: e.target.value }
              updateNestedData("accountInfo", "groom", updatedGroomAccount)
            }}
            className="mt-2"
            placeholder="예: 하나 110-654-321987"
          />
        </div>
      </CardContent>
    </Card>
  )
} 