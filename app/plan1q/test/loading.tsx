import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";

export default function TestLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainLayout>
        <main className="container mx-auto p-4 max-w-4xl">
          {/* 헤더 스켈레톤 */}
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-8 w-20" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>

          {/* 메인 컨텐츠 스켈레톤 */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-2 w-full" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Skeleton className="h-6 w-96 mx-auto mb-8" />
                <div className="space-y-3 max-w-2xl mx-auto">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </MainLayout>
    </div>
  );
}
