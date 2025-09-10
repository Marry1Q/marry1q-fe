import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 섹션 스켈레톤 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
          <Skeleton className="h-8 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>

        {/* 로그인 카드 스켈레톤 */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <Skeleton className="h-6 w-20 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 로그인 방식 선택 스켈레톤 */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Skeleton className="flex-1 h-8 rounded-md" />
              <Skeleton className="flex-1 h-8 rounded-md" />
            </div>

            {/* 폼 필드들 스켈레톤 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
              
              <Skeleton className="h-12 w-full" />
            </div>

            {/* 추가 링크들 스켈레톤 */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              
              <div className="text-center">
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 보안 안내 스켈레톤 */}
        <div className="mt-6 text-center">
          <Skeleton className="h-3 w-64 mx-auto" />
        </div>
      </div>
    </div>
  );
}
