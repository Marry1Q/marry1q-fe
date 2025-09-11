"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import MainLayout from "@/components/layout/MainLayout"
import { Pagination } from "@/components/layout/Pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { colors } from "@/constants/colors"
import { toast } from "sonner"
import { 
  InvitationDashboard, 
  PrimaryInvitationPreview, 
  InvitationList, 
  InvitationFilters, 
  ShareMenu,
} from "@/features/invitation/components"
import { useInvitationData } from "@/lib/hooks/useInvitationData"
import { useAuth } from "@/lib/hooks/useAuth"
import { showConfirmDialog } from "@/components/ui/CustomAlert";

export default function InvitationPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const {
    invitations: invitationList,
    searchTerm,
    sortBy,
    currentPage,
    stats,
    primaryInvitation,
    paginatedInvitations,
    totalPages,
    setPrimaryInvitation,
    deleteInvitation,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
  } = useInvitationData()

  // 인증 상태 확인 및 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, authLoading, router]);

  // 로딩 중이거나 인증되지 않은 경우 로딩 표시
  if (authLoading || !isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">로딩 중...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleSetPrimary = (id: number) => {
    setPrimaryInvitation(id)
    toast.success("대표 청첩장이 설정되었습니다!", {
      style: {
        background: colors.primary.toastBg,
        color: colors.primary.main,
        border: `1px solid ${colors.primary.main}`,
        fontFamily: "Hana2-Medium",
      },
    })
  }

  const handleDelete = async (id: number) => {
    const result = await showConfirmDialog({
      title: "정말 삭제하시겠습니까?",
      confirmButtonText: "삭제하기",
      cancelButtonText: "취소",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      deleteInvitation(id)
      toast.success("청첩장이 삭제되었습니다!", {
        style: {
          background: colors.primary.toastBg,
          color: colors.primary.main,
          border: `1px solid ${colors.primary.main}`,
          fontFamily: "Hana2-Medium",
        },
      })
    }
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const linkUrl = primaryInvitation ? `${origin}/invitation/public/${(primaryInvitation as any).coupleSlug ?? ''}` : origin;
  const templateArgs = primaryInvitation ? {
    title: primaryInvitation.title,
    date: primaryInvitation.weddingDate,
    time: (primaryInvitation as any).weddingTime,
    venue: (primaryInvitation as any).venue ?? (primaryInvitation as any).weddingHall,
    imageUrl: (primaryInvitation as any).mainImageUrl,
    linkUrl,
  } : undefined;

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Hana2-CM" }}>
            모바일 청첩장
          </h1>
          <div className="flex items-center gap-2">
            {primaryInvitation && (
              <ShareMenu templateId={124176} templateArgs={templateArgs} linkUrl={linkUrl} />
            )}
            <Link href="/invitation/create">
              <Button style={{ backgroundColor: colors.primary.main }}>
                <Plus className="w-4 h-4 mr-2" />새 청첩장 만들기
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-gray-600 mb-6">아름다운 모바일 청첩장을 만들어 소중한 사람들을 초대하세요.</p>

        {/* 2열 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽 열: 대표 청첩장 */}
          <div className="space-y-4">
            {primaryInvitation ? (
              <PrimaryInvitationPreview invitation={primaryInvitation} />
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-500">대표 청첩장이 설정되지 않았습니다.</p>
                <p className="text-sm text-gray-400 mt-2">청첩장 목록에서 대표로 설정할 청첩장을 선택해주세요.</p>
              </div>
            )}
          </div>

          {/* 오른쪽 열: 청첩장 목록 */}
          <div className="space-y-4">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle style={{fontFamily: "Hana2-CM"}}>
                    청첩장 목록
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">총 {paginatedInvitations.length}개</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 검색 및 정렬 섹션 */}
                  <InvitationFilters
                    searchTerm={searchTerm}
                    sortBy={sortBy}
                    onSearchChange={handleSearchChange}
                    onSortChange={(value) => handleSortChange(value as any)}
                  />

                  {/* 내 청첩장 목록 */}
                  <InvitationList
                    invitations={paginatedInvitations}
                    onSetPrimary={handleSetPrimary}
                    onDelete={handleDelete}
                  />

                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
