"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams, useSearchParams, useRouter } from "next/navigation"
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
import { mapApiResponseToInvitation, mapInvitationToUpdateRequest } from "@/features/invitation/utils/invitationMapper"
import { useAuth } from "@/lib/hooks/useAuth"
import { toast } from "sonner"
import { colors } from "@/constants/colors"
import { format } from "date-fns"

export default function EditInvitationPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { updateInvitation, getInvitationById } = useInvitationData()
  
  const invitationId = parseInt(params.id as string)
  
  const [activeTab, setActiveTab] = useState("content")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [shareImage, setShareImage] = useState<string>("/placeholder.svg?height=300&width=400&text=대표+사진")
  const [currentInvitation, setCurrentInvitation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // 이미지 상태 관리
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    previewUrl: "/placeholder.svg?height=300&width=400&text=대표+사진",
    uploadedUrl: "",
    isUploaded: false
  })

  // 새로 업로드된 이미지 파일 추적
  const [newImageFile, setNewImageFile] = useState<File | null>(null)

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

  // 인증 상태 확인 및 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, authLoading, router]);

  // 청첩장 데이터 로드
  useEffect(() => {
    const loadInvitationData = async () => {
      if (!isAuthenticated || !invitationId) return;
      
      setIsLoading(true);
      try {
        // 실제 API 호출로 변경
        const invitation = await getInvitationById(invitationId);
        if (invitation) {
          // 디버깅을 위한 로그 추가
                console.log('Backend response:', invitation);
      console.log('Backend mainImageUrl:', invitation.mainImageUrl);
      console.log('Backend groomAccount:', invitation.groomAccount);
      console.log('Backend brideAccount:', invitation.brideAccount);
      console.log('Backend totalViews:', invitation.totalViews);
          
          // 백엔드 DTO를 프론트엔드 타입으로 변환
          const mappedInvitation = mapApiResponseToInvitation(invitation);
          console.log('Mapped invitation:', mappedInvitation);
          console.log('Mapped mainImageUrl:', mappedInvitation.mainImageUrl);
          console.log('Mapped groomAccount:', mappedInvitation.groomAccount);
          console.log('Mapped brideAccount:', mappedInvitation.brideAccount);
          setCurrentInvitation(mappedInvitation);
          
          // InvitationData 형태로 변환
          setInvitationData({
            title: mappedInvitation.title || "",
            groomName: mappedInvitation.groomName || "",
            brideName: mappedInvitation.brideName || "",
            weddingDate: mappedInvitation.weddingDate ? new Date(mappedInvitation.weddingDate) : new Date(),
            weddingTime: mappedInvitation.weddingTime || "",
            venue: mappedInvitation.venue || mappedInvitation.weddingHall || "",
            venueAddress: mappedInvitation.venueAddress || "",
            groomParents: {
              father: mappedInvitation.groomParentsDetail?.father || "",
              mother: mappedInvitation.groomParentsDetail?.mother || "",
            },
            brideParents: {
              father: mappedInvitation.brideParentsDetail?.father || "",
              mother: mappedInvitation.brideParentsDetail?.mother || "",
            },
            contact: {
              groom: mappedInvitation.contact?.groom || "",
              bride: mappedInvitation.contact?.bride || "",
            },
            message: mappedInvitation.message || mappedInvitation.invitationMessage || "",
            accountMessage: mappedInvitation.accountMessage || "",
            accountInfo: {
              groom: {
                name: mappedInvitation.groomName || "신랑",
                accountNumber: mappedInvitation.groomAccount || mappedInvitation.accountInfo?.groom?.accountNumber || "",
                bankName: mappedInvitation.accountInfo?.groom?.bankName || "",
                fieldId: "groom-account"
              },
              bride: {
                name: mappedInvitation.brideName || "신부",
                accountNumber: mappedInvitation.brideAccount || mappedInvitation.accountInfo?.bride?.accountNumber || "",
                bankName: mappedInvitation.accountInfo?.bride?.bankName || "",
                fieldId: "bride-account"
              }
            },
          });
          
          // 메인 이미지 설정
          const mainImageUrl = mappedInvitation.mainImageUrl || "/placeholder.svg?height=300&width=400&text=대표+사진";
          setShareImage(mainImageUrl);
          setImageState({
            file: null,
            previewUrl: mainImageUrl,
            uploadedUrl: mainImageUrl,
            isUploaded: true
          });
          
          // 새 이미지 파일 추적 초기화 (기존 이미지가 있는 경우)
          setNewImageFile(null);
          
          // currentInvitation에도 shareImage 설정
          setCurrentInvitation((prev: any) => ({
            ...prev,
            shareImage: mainImageUrl,
            mainImageUrl: mainImageUrl
          }));
        }
        
      } catch (error) {
        console.error('Failed to load invitation data:', error);
        toast.error('청첩장 데이터를 불러오는데 실패했습니다.');
        
        // 에러 시 임시로 목데이터 사용
        setCurrentInvitation({
          id: invitationId,
          title: "김민수 ♥ 이지은 결혼식에 초대합니다",
          groomName: "김민수",
          brideName: "이지은",
          weddingDate: "2024-12-31",
          weddingTime: "14:00",
          venue: "그랜드 호텔 그랜드볼룸",
          venueAddress: "서울시 강남구 테헤란로 123",
          mainImageUrl: "/invitation/invitationMainImage1.jpeg",
        });
        
        setInvitationData({
          title: "김민수 ♥ 이지은 결혼식에 초대합니다",
          groomName: "김민수",
          brideName: "이지은",
          weddingDate: new Date("2024-12-31"),
          weddingTime: "14:00",
          venue: "그랜드 호텔 그랜드볼룸",
          venueAddress: "서울시 강남구 테헤란로 123",
          groomParents: {
            father: "김철수",
            mother: "이영희",
          },
          brideParents: {
            father: "이영수",
            mother: "박미영",
          },
          contact: {
            groom: "010-1234-5678",
            bride: "010-9876-5432",
          },
          message: "저희 두 사람이 사랑으로 하나가 되는 소중한 자리에 오셔서 축복해 주시면 더없는 기쁨이겠습니다.",
          accountMessage: "마음만 받겠습니다.",
          accountInfo: {
            groom: {
              name: "신랑",
              accountNumber: "123-456-789012",
              bankName: "하나은행",
              fieldId: "groom-account"
            },
            bride: {
              name: "신부",
              accountNumber: "987-654-321098",
              bankName: "하나은행",
              fieldId: "bride-account"
            }
          },
        });
        
        setShareImage("/invitation/invitationMainImage1.jpeg");
        setImageState({
          file: null,
          previewUrl: "/invitation/invitationMainImage1.jpeg",
          uploadedUrl: "/invitation/invitationMainImage1.jpeg",
          isUploaded: true
        });
        
        // 새 이미지 파일 추적 초기화
        setNewImageFile(null);
        
      } finally {
        setIsLoading(false);
      }
    };

    loadInvitationData();
  }, [isAuthenticated, invitationId, getInvitationById]);

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

  // 실시간 프리뷰 업데이트를 위한 useEffect
  useEffect(() => {
    if (currentInvitation) {
      setCurrentInvitation((prev: any) => ({
        ...prev,
        title: invitationData.title,
        groomName: invitationData.groomName,
        brideName: invitationData.brideName,
        weddingDate: invitationData.weddingDate ? invitationData.weddingDate.toISOString().split('T')[0] : "",
        weddingTime: invitationData.weddingTime || format(invitationData.weddingDate, 'HH:mm'),
        weddingLocation: invitationData.venue,
        venue: invitationData.venue,
        venueAddress: invitationData.venueAddress,
        message: invitationData.message,
        groomPhone: invitationData.contact.groom,
        bridePhone: invitationData.contact.bride,
        groomParents: `${invitationData.groomParents.father} · ${invitationData.groomParents.mother}`,
        brideParents: `${invitationData.brideParents.father} · ${invitationData.brideParents.mother}`,
        groomParentsDetail: invitationData.groomParents,
        brideParentsDetail: invitationData.brideParents,
        contact: invitationData.contact,
        accountMessage: invitationData.accountMessage,
        accountInfo: invitationData.accountInfo,
        shareImage: shareImage, // shareImage도 업데이트
        mainImageUrl: shareImage, // mainImageUrl도 동기화
      }))
    }
  }, [invitationData, shareImage])

  // 이미지 상태 변경 핸들러
  const handleImageChange = (newImageState: ImageState) => {
    setImageState(newImageState);
    setShareImage(newImageState.previewUrl || newImageState.uploadedUrl || "/placeholder.svg?height=300&width=400&text=대표+사진");
    
    // 새로 업로드된 파일이 있는 경우 추적
    if (newImageState.file) {
      setNewImageFile(newImageState.file);
    }
  };

  // 저장 함수
  const handleSave = async () => {
    if (!invitationId) return;
    
    setIsSaving(true);
    try {
      // 현재 invitationData를 백엔드 DTO 형태로 변환
      const updateData = await mapInvitationToUpdateRequest({
        title: invitationData.title,
        invitationMessage: invitationData.message,
        weddingDate: invitationData.weddingDate ? invitationData.weddingDate.toISOString().split('T')[0] : "",
        weddingTime: invitationData.weddingTime || format(invitationData.weddingDate, 'HH:mm'),
        weddingHall: invitationData.venue,
        venueAddress: invitationData.venueAddress,
        accountMessage: invitationData.accountMessage,
        groomName: invitationData.groomName,
        groomPhone: invitationData.contact.groom,
        groomFatherName: invitationData.groomParents.father,
        groomMotherName: invitationData.groomParents.mother,
        groomAccount: invitationData.accountInfo.groom.accountNumber, // 계좌번호 필드명 확인
        brideName: invitationData.brideName,
        bridePhone: invitationData.contact.bride,
        brideFatherName: invitationData.brideParents.father,
        brideMotherName: invitationData.brideParents.mother,
        brideAccount: invitationData.accountInfo.bride.accountNumber, // 계좌번호 필드명 확인
      });
      
      // 이미지 파일이 새로 업로드된 경우에만 전송
      const mainImageFile = newImageFile || undefined;
      
      const success = await updateInvitation(invitationId, updateData, mainImageFile);
      
      if (success) {
        toast.success("청첩장이 수정되었습니다!", {
          style: {
            background: colors.primary.toastBg,
            color: colors.primary.main,
            border: `1px solid ${colors.primary.main}`,
            fontFamily: "Hana2-Medium",
          },
        });
        router.push('/invitation');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error("청첩장 수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 로딩 중이거나 인증되지 않은 경우 로딩 표시
  if (authLoading || !isAuthenticated || isLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: '#f9fafb' }}>
      <FormHeader 
        title="청첩장 수정" 
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
                    shareImage={shareImage}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    청첩장을 불러오는 중...
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
                        <Button onClick={handleSave} style={{ backgroundColor: "#008485" }}>
                          <Save className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <TabsContent value="content">
                      <BasicInfoForm
                        invitationData={invitationData}
                        updateInvitationData={(field: string, value: any) => {
                          setInvitationData(prev => ({
                            ...prev,
                            [field]: value,
                          }));
                        }}
                        updateNestedData={(parent: string, field: string, value: any) => {
                          setInvitationData((prev) => ({
                            ...prev,
                            [parent]: {
                              ...(prev[parent as keyof InvitationData] as Record<string, any>),
                              [field]: value,
                            },
                          }));
                        }}
                        isCalendarOpen={isCalendarOpen}
                        setIsCalendarOpen={setIsCalendarOpen}
                      />
                    </TabsContent>

                    <TabsContent value="share">
                      <ShareImageUpload
                        currentImageState={imageState}
                        onImageChange={handleImageChange}
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