"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar24 } from "@/components/ui/Calendar24"

import { GroomInfoCard } from "../card/GroomInfoCard"
import { BrideInfoCard } from "../card/BrideInfoCard"

import type { InvitationData } from "../../types/invitation"

interface BasicInfoFormProps {
  invitationData: InvitationData
  updateInvitationData: (field: string, value: any) => void
  updateNestedData: (parent: string, field: string, value: any) => void
  isCalendarOpen: boolean
  setIsCalendarOpen: (open: boolean) => void
}

export function BasicInfoForm({ 
  invitationData, 
  updateInvitationData, 
  updateNestedData, 
  isCalendarOpen, 
  setIsCalendarOpen 
}: BasicInfoFormProps) {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 청첩장 제목 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Hana2-CM' }}>청첩장 제목</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={invitationData.title}
            onChange={(e) => updateInvitationData("title", e.target.value)}
            placeholder="청첩장 제목을 입력하세요"
            
          />
        </CardContent>
      </Card>

      {/* 신랑신부 정보 */}
      <GroomInfoCard 
        invitationData={invitationData}
        updateInvitationData={updateInvitationData}
        updateNestedData={updateNestedData}
      />

      <BrideInfoCard 
        invitationData={invitationData}
        updateInvitationData={updateInvitationData}
        updateNestedData={updateNestedData}
      />

      {/* 메시지 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Hana2-CM' }}>초대 메시지</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={invitationData.message}
            onChange={(e) => updateInvitationData("message", e.target.value)}
            placeholder="청첩장에 표시될 메시지를 입력하세요"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* 결혼식 정보 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Hana2-CM' }}>결혼식 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>날짜 및 시간</Label>
            <div className="mt-2">
              <Calendar24
                date={invitationData.weddingDate}
                onDateChange={(date) => {
                  updateInvitationData("weddingDate", date)
                }}
                onTimeChange={(time) => {
                  updateInvitationData("weddingTime", time)
                }}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="venue">장소</Label>
            <Input
              id="venue"
              value={invitationData.venue}
              onChange={(e) => updateInvitationData("venue", e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="venueAddress">주소</Label>
            <Input
              id="venueAddress"
              value={invitationData.venueAddress}
              onChange={(e) => updateInvitationData("venueAddress", e.target.value)}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      

      {/* 마음전하실곳 메시지 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Hana2-CM' }}>마음 전하실 곳 메시지</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={invitationData.accountMessage}
            onChange={(e) => updateInvitationData("accountMessage", e.target.value)}
            placeholder="마음전하실곳 섹션에 표시될 메시지를 입력하세요"
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  )
} 