"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { InvitationData } from "../../types/invitation"

interface BrideInfoCardProps {
  invitationData: InvitationData
  updateInvitationData: (field: string, value: any) => void
  updateNestedData: (parent: string, field: string, value: any) => void
}

export function BrideInfoCard({ 
  invitationData, 
  updateInvitationData, 
  updateNestedData 
}: BrideInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Hana2-CM' }}>신부 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="brideName">이름</Label>
          <Input
            id="brideName"
            value={invitationData.brideName}
            onChange={(e) => updateInvitationData("brideName", e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="brideFather">아버지 성함</Label>
          <Input
            id="brideFather"
            value={invitationData.brideParents.father}
            onChange={(e) => updateNestedData("brideParents", "father", e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="brideMother">어머니 성함</Label>
          <Input
            id="brideMother"
            value={invitationData.brideParents.mother}
            onChange={(e) => updateNestedData("brideParents", "mother", e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="bridePhone">연락처</Label>
          <Input
            id="bridePhone"
            value={invitationData.contact.bride}
            onChange={(e) => updateNestedData("contact", "bride", e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="brideAccount">계좌번호</Label>
          <Input
            id="brideAccount"
            value={invitationData.accountInfo.bride.accountNumber}
            onChange={(e) => {
              const updatedBrideAccount = { ...invitationData.accountInfo.bride, accountNumber: e.target.value }
              updateNestedData("accountInfo", "bride", updatedBrideAccount)
            }}
            className="mt-2"
            placeholder="예: 하나 110-654-321987"
          />
        </div>
      </CardContent>
    </Card>
  )
} 