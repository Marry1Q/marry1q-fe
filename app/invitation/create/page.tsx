"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"
import { 
  BasicInfoForm, 
  ShareImageUpload,
  CardPreview,
} from "@/features/invitation/components"
import { FormHeader } from "@/components/layout/FormHeader"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import type { InvitationData, ImageState } from "@/features/invitation/types/invitation"
import { useInvitationData } from "@/lib/hooks/useInvitationData"
import { useAuth } from "@/lib/hooks/useAuth"
import { toast } from "sonner"
import { colors } from "@/constants/colors"
import { useRouter } from "next/navigation"


export default function CreateInvitationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { addInvitation } = useInvitationData()

  // 모든 useState를 최상위에서 호출
  const [activeTab, setActiveTab] = useState("content")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [mainImageState, setMainImageState] = useState<ImageState>({
    file: null,
    previewUrl: "/placeholder.svg?height=300&width=400&text=대표+사진",
    uploadedUrl: "",
    isUploaded: false
  })
  const [currentInvitation, setCurrentInvitation] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false);

  // 청첩장 정보 상태
  const [invitationData, setInvitationData] = useState<InvitationData>({
    title: "",
    groomName: "",
    brideName: "",
    weddingDate: new Date(),
    weddingTime: "",
    venue: "",
    venueAddress: "",
    groomParents: {
      father: "",
      mother: "",
    },
    brideParents: {
      father: "",
      mother: "",
    },
    contact: {
      groom: "",
      bride: "",
    },
    message: "",
    accountMessage: "",
    accountInfo: {
      groom: {
        name: "신랑",
        accountNumber: "",
        bankName: "",
        fieldId: "groom-account"
      },
      bride: {
        name: "신부",
        accountNumber: "",
        bankName: "",
        fieldId: "bride-account"
      }
    },
  })

  const [selectedTemplate, setSelectedTemplate] = useState(1)
  const [selectedColor, setSelectedColor] = useState("pink")

  // 날짜 포맷팅 함수
  const formatWeddingDate = (date: Date, time: string): string => {
    if (!date || isNaN(date.getTime())) {
      return ""
    }
    
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
    
    let timeStr = ""
    if (time) {
      const [hours, minutes] = time.split(':')
      const hour = parseInt(hours)
      const ampm = hour < 12 ? "오전" : "오후"
      const displayHour = hour < 12 ? hour : hour - 12
      timeStr = ` ${ampm} ${displayHour}시${minutes !== '00' ? minutes + '분' : ''}`
    }
    
    return `${year}년 ${month}월 ${day}일 (${dayOfWeek})${timeStr}`
  }

  // 인증 상태 확인 및 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, authLoading, router]);



  // 실시간 프리뷰 업데이트를 위한 useEffect
  useEffect(() => {
    console.log('Real-time preview update - invitationData:', invitationData);
    console.log('Real-time preview update - message:', invitationData.message);
    console.log('Real-time preview update - accountMessage:', invitationData.accountMessage);
    
    // 편집 페이지 형식을 목데이터 형식으로 변환하여 currentInvitation 업데이트
    const updatedPreviewData = {
      title: invitationData.title,
      groomName: invitationData.groomName,
      brideName: invitationData.brideName,
      weddingDate: formatWeddingDate(invitationData.weddingDate, invitationData.weddingTime),
      weddingTime: invitationData.weddingTime,
      venue: invitationData.venue,
      venueAddress: invitationData.venueAddress,
      venueLatitude: invitationData.venueLatitude,
      venueLongitude: invitationData.venueLongitude,
      message: invitationData.message,
      accountMessage: invitationData.accountMessage,
      groomParentsDetail: invitationData.groomParents,
      brideParentsDetail: invitationData.brideParents,
      contact: invitationData.contact,
      accountInfo: invitationData.accountInfo,
      meetingAccountInfo: invitationData.meetingAccountInfo, // 모임통장 정보 추가
      uploadedPhotos,
      selectedTemplate,
      selectedColor,
      mainImage: mainImageState.uploadedUrl || mainImageState.previewUrl,
    }
    
    console.log('Updated preview data:', updatedPreviewData);
    setCurrentInvitation(updatedPreviewData)
  }, [invitationData, uploadedPhotos, selectedTemplate, selectedColor, mainImageState])

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // 로딩 중이거나 인증되지 않은 경우 로딩 표시
  if (authLoading || !isAuthenticated) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    setIsSaving(true);
    try {
      console.log('청첩장 생성 시작...');
      console.log('청첩장 데이터:', invitationData);
      console.log('이미지 상태:', mainImageState);
      
      // 날짜 형식 변환
      const weddingDate = invitationData.weddingDate ? invitationData.weddingDate.toISOString().split('T')[0] : "";
      
      const invitationDataForApi = {
        title: invitationData.title,
        invitationMessage: invitationData.message,
        weddingDate: weddingDate,
        weddingTime: invitationData.weddingTime,
        weddingHall: invitationData.venue,
        venueAddress: invitationData.venueAddress,
        venueLatitude: invitationData.venueLatitude, // 위도
        venueLongitude: invitationData.venueLongitude, // 경도
        accountMessage: invitationData.accountMessage,
        groomName: invitationData.groomName,
        groomPhone: invitationData.contact.groom,
        groomFatherName: invitationData.groomParents.father,
        groomMotherName: invitationData.groomParents.mother,
        groomAccount: invitationData.accountInfo.groom.accountNumber,
        brideName: invitationData.brideName,
        bridePhone: invitationData.contact.bride,
        brideFatherName: invitationData.brideParents.father,
        brideMotherName: invitationData.brideParents.mother,
        brideAccount: invitationData.accountInfo.bride.accountNumber,
        meetingAccountInfo: invitationData.meetingAccountInfo, // 모임통장 정보 추가
      };
      
      console.log('🔍 생성 페이지 위도/경도 디버깅:');
      console.log('  - invitationData.venueLatitude:', invitationData.venueLatitude);
      console.log('  - invitationData.venueLongitude:', invitationData.venueLongitude);
      console.log('  - invitationDataForApi.venueLatitude:', invitationDataForApi.venueLatitude);
      console.log('  - invitationDataForApi.venueLongitude:', invitationDataForApi.venueLongitude);
      console.log('API 요청 데이터:', invitationDataForApi);
      console.log('계좌번호 확인 - 신랑:', invitationDataForApi.groomAccount);
      console.log('계좌번호 확인 - 신부:', invitationDataForApi.brideAccount);
      console.log('프론트엔드 계좌번호 데이터 - 신랑:', invitationData.accountInfo.groom);
      console.log('프론트엔드 계좌번호 데이터 - 신부:', invitationData.accountInfo.bride);
      
      // 이미지 파일 준비 (null인 경우 undefined로 변환)
      const mainImageFile = mainImageState.file || undefined;
      console.log('이미지 파일:', mainImageFile ? `${mainImageFile.name} (${mainImageFile.size} bytes)` : '없음');
      
      const success = await addInvitation(invitationDataForApi, mainImageFile);
      
      if (success) {
        console.log('청첩장 생성 성공!');
        toast.success("청첩장이 생성되었습니다!", {
          style: {
            background: colors.primary.toastBg,
            color: colors.primary.main,
            border: `1px solid ${colors.primary.main}`,
            fontFamily: "Hana2-Medium",
          },
        });
        
        // 생성된 청첩장 목록 페이지로 이동
        router.push('/invitation');
      } else {
        console.log('청첩장 생성 실패');
        toast.error("청첩장 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error('청첩장 생성 중 오류 발생:', error);
      toast.error("청첩장 생성에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  const updateInvitationData = (field: string, value: any) => {
    console.log(`Updating field: ${field} with value:`, value);
    
    setInvitationData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateNestedData = (parent: string, field: string, value: any) => {
    setInvitationData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof InvitationData] as Record<string, any>),
        [field]: value,
      },
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: '#f9fafb' }}>
      <FormHeader 
        title="청첩장 만들기" 
        useDefaultBack={true}
        maxWidth="7xl"
      />
      
      <div className="bg-gray-50 min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
            {/* 왼쪽 열: 청첩장 미리보기 */}
            <div className="bg-white rounded-lg shadow-sm p-6 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {currentInvitation ? (
                  <CardPreview 
                    invitationData={currentInvitation} 
                    uploadedPhotos={uploadedPhotos} 
                    shareImage={mainImageState.uploadedUrl || mainImageState.previewUrl} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    추가하기 전까진 이미지를 표시해주세요
                  </div>
                )}
              </div>
            </div>

            {/* 오른쪽 열: 편집 기능 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex justify-between">
                      <TabsList className="mb-2">
                        <TabsTrigger value="content">기본 정보</TabsTrigger>
                        <TabsTrigger value="share">대표 사진</TabsTrigger>
                      </TabsList>
                      <div className="ml-4">
                        <Button 
                          onClick={handleSave} 
                          disabled={isSaving}
                          style={{ backgroundColor: "#008485" }}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isSaving ? '저장 중...' : '저장'}
                        </Button>
                      </div>
                    </div>

                    <TabsContent value="content">
                      <BasicInfoForm
                        invitationData={invitationData}
                        updateInvitationData={updateInvitationData}
                        updateNestedData={updateNestedData}
                        isCalendarOpen={isCalendarOpen}
                        setIsCalendarOpen={setIsCalendarOpen}
                      />
                    </TabsContent>

                    <TabsContent value="share">
                      <ShareImageUpload
                        currentImageState={mainImageState}
                        onImageChange={setMainImageState}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
