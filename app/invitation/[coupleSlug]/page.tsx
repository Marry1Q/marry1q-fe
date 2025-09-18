"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { CardPreview } from "@/features/invitation/components/preview/CardPreview"
import {
  Heart,
  Share2,
} from "lucide-react"
import { useParams } from "next/navigation"
import { invitationApi } from "@/features/invitation/api/invitationApi"
import { mapApiResponseToInvitation } from "@/features/invitation/utils/invitationMapper"
import { Invitation } from "@/features/invitation/types"
import { toast } from "sonner"

export default function PublicInvitationPage() {
  const params = useParams()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 중복 API 호출 방지를 위한 ref
  const hasLoaded = useRef(false)

  // URL 파라미터에서 coupleSlug 가져오기
  const coupleSlug = params.coupleSlug as string
  
  // 청첩장 데이터 로드
  useEffect(() => {
    // 이미 로드된 경우 중복 호출 방지
    if (hasLoaded.current) return;
    
    const loadInvitation = async () => {
      hasLoaded.current = true;
      setIsLoading(true);
      setError(null);
      
      try {
        // coupleSlug를 사용한 공개 청첩장 조회
        const response = await invitationApi.getPublicInvitation(coupleSlug);
        
        if (response.success && response.data) {
          console.log('백엔드 응답 데이터:', response.data);
          const invitationData = mapApiResponseToInvitation(response.data);
          console.log('매핑된 청첩장 데이터:', invitationData);
          console.log('계좌번호 확인 - 신랑:', invitationData.groomAccount);
          console.log('계좌번호 확인 - 신부:', invitationData.brideAccount);
          console.log('accountInfo 확인:', invitationData.accountInfo);
          console.log('모임통장 정보 확인:', invitationData.meetingAccountInfo);
          console.log('좌표 확인 - 위도:', invitationData.venueLatitude);
          console.log('좌표 확인 - 경도:', invitationData.venueLongitude);
          setInvitation(invitationData);
        } else {
          setError('청첩장을 찾을 수 없습니다.');
          toast.error('청첩장을 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('Failed to load invitation:', error);
        setError('청첩장을 불러오는데 실패했습니다.');
        toast.error('청첩장을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInvitation();
  }, [coupleSlug]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
      toast.success('클립보드에 복사되었습니다.');
    } catch (err) {
      console.error('Failed to copy: ', err)
      toast.error('복사에 실패했습니다.');
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: invitation ? `${invitation.groomName} ♥ ${invitation.brideName} 결혼합니다` : '청첩장',
        text: "청첩장을 확인해보세요!",
        url: window.location.href,
      })
    } else {
      copyToClipboard(window.location.href, 'url')
    }
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">청첩장을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">청첩장을 찾을 수 없습니다</h2>
          <p className="text-gray-500">요청하신 청첩장이 존재하지 않거나 삭제되었습니다.</p>
        </div>
      </div>
    );
  }

  // 청첩장 데이터를 CardPreview 형식으로 변환
  const invitationData = {
    id: invitation.id,
    title: invitation.title,
    status: invitation.status || '완료',
    createdDate: invitation.createdAt,
    lastModified: invitation.updatedAt,
    views: invitation.views || 0,
    totalViews: invitation.totalViews,
    todayViews: invitation.todayViews || 0,
    template: invitation.template || '기본',
    isPrimary: invitation.isPrimary || invitation.isRepresentative,
    mainImage: invitation.mainImageUrl,
    weddingDate: invitation.weddingDate,
    weddingTime: invitation.weddingTime,
    weddingLocation: invitation.weddingLocation || invitation.weddingHall,
    venue: invitation.venue || invitation.weddingHall,
    venueAddress: invitation.venueAddress,
    venueLatitude: invitation.venueLatitude,
    venueLongitude: invitation.venueLongitude,
    message: invitation.message || invitation.invitationMessage,
    groomName: invitation.groomName,
    brideName: invitation.brideName,
    groomPhone: invitation.groomPhone,
    bridePhone: invitation.bridePhone,
    groomParents: invitation.groomParents,
    brideParents: invitation.brideParents,
    accountMessage: invitation.accountMessage,
    groomParentsDetail: invitation.groomParentsDetail,
    brideParentsDetail: invitation.brideParentsDetail,
    contact: invitation.contact,
    accountInfo: invitation.accountInfo,
    meetingAccountInfo: invitation.meetingAccountInfo, // 모임통장 정보 추가
    uploadedPhotos: invitation.uploadedPhotos || [],
    selectedTemplate: invitation.selectedTemplate || 1,
    selectedColor: invitation.selectedColor || '#F0426B',
    shareImage: invitation.shareImage || invitation.mainImageUrl,
  };

  const uploadedPhotos = invitation.uploadedPhotos || [
    "/placeholder.svg?height=600&width=400&text=웨딩사진1",
    "/placeholder.svg?height=600&width=400&text=웨딩사진2",
    "/placeholder.svg?height=600&width=400&text=웨딩사진3",
    "/placeholder.svg?height=600&width=400&text=웨딩사진4",
  ];

  const shareImage = invitation.mainImageUrl || "/placeholder.svg?height=300&width=400&text=대표사진";

  return (
    <div className="min-h-screen bg-white">
      {/* 모바일 청첩장 컨테이너 - 모든 화면에서 동일 */}
      <div className="w-full max-w-sm mx-auto bg-white">
        
        {/* Header 제거 - 공개 청첩장에는 헤더가 없어야 함 */}

        {/* CardPreview 컴포넌트 사용 */}
        <CardPreview 
          invitationData={invitationData}
          uploadedPhotos={uploadedPhotos}
          shareImage={shareImage}
          isPreview={false}
        />
      </div>

      {/* 데스크톱에서 추가되는 흰색 배경 */}
      <div className="hidden lg:block fixed inset-0 bg-white -z-10" />
    </div>
  )
} 