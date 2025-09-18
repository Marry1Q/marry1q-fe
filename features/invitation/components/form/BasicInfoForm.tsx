"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar24 } from "@/components/ui/Calendar24"
import AddressSearchButton from "../card/location/AddressSearchButton"
import dynamic from "next/dynamic"
import { useCallback, useEffect } from "react"
import { useMeetingAccount, useFetchMeetingAccount } from "@/features/account/store/selectors"

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
  // store에서 모임통장 정보 가져오기
  const meetingAccount = useMeetingAccount();
  const fetchMeetingAccount = useFetchMeetingAccount();
  
  // 모임통장 정보가 없으면 자동으로 로드
  useEffect(() => {
    if (!meetingAccount) {
      console.log('BasicInfoForm - 모임통장 정보가 없어서 자동 로드 시작');
      fetchMeetingAccount();
    }
  }, [meetingAccount, fetchMeetingAccount]);
  
  // 모임통장 정보가 없으면 store에서 값을 가져와서 자동으로 채우기
  useEffect(() => {
    console.log('BasicInfoForm - meetingAccount:', meetingAccount);
    console.log('BasicInfoForm - invitationData.meetingAccountInfo:', invitationData.meetingAccountInfo);
    
    if (!invitationData.meetingAccountInfo && meetingAccount) {
      // 안심계좌번호가 있으면 사용, 없으면 일반 계좌번호 사용
      const accountNumber = meetingAccount.safeAccountNumber || meetingAccount.accountNumber;
      const meetingAccountInfo = `하나 ${accountNumber}`;
      console.log('BasicInfoForm - 생성된 meetingAccountInfo:', meetingAccountInfo);
      updateInvitationData("meetingAccountInfo", meetingAccountInfo);
    }
  }, [invitationData.meetingAccountInfo, meetingAccount, updateInvitationData]);

  // 프리뷰는 왼쪽 카드에만 표시하므로 폼 내 지도는 제거
  const handleAddressSelected = useCallback(({ address, lat, lng }: { address: string; lat?: number; lng?: number }) => {
    if (address !== undefined) updateInvitationData("venueAddress", address)
    if (lat !== undefined) updateInvitationData("venueLatitude", lat)
    if (lng !== undefined) updateInvitationData("venueLongitude", lng)
  }, [updateInvitationData])

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
            <div className="mt-2">
              <Calendar24
                date={invitationData.weddingDate}
                time={invitationData.weddingTime}
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
            {invitationData.venueAddress ? (
              <div className="mt-2 flex gap-2">
                <Input
                  id="venueAddress"
                  value={invitationData.venueAddress}
                  onChange={(e) => updateInvitationData("venueAddress", e.target.value)}
                  className="flex-1"
                  placeholder="도로명 주소를 선택하세요"
                  readOnly
                />
                <AddressSearchButton onSelected={handleAddressSelected} address={invitationData.venueAddress} />
              </div>
            ) : (
              <div className="mt-2">
                <AddressSearchButton onSelected={handleAddressSelected} address={invitationData.venueAddress} className="w-full" />
              </div>
            )}
            {/* 좌표 표기는 제거, 지도 프리뷰는 왼쪽 카드에서만 표시 */}
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