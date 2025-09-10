"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  showSuccessToast, 
  showErrorToast, 
  showWarningToast, 
  showInfoToast,
  showCustomToast 
} from "@/components/ui/toast";

export default function ToastTestPage() {
  const handleSuccessToast = () => {
    showSuccessToast("작업이 성공적으로 완료되었습니다!");
  };

  const handleErrorToast = () => {
    showErrorToast("작업 중 오류가 발생했습니다.");
  };

  const handleWarningToast = () => {
    showWarningToast("주의가 필요한 상황입니다.");
  };

  const handleInfoToast = () => {
    showInfoToast("유용한 정보를 알려드립니다.");
  };

  const handleCustomSuccessToast = () => {
    showCustomToast('success', "커스텀 성공 메시지입니다.");
  };

  const handleCustomErrorToast = () => {
    showCustomToast('error', "커스텀 에러 메시지입니다.");
  };

  const handleLoginErrorToast = () => {
    showErrorToast("입력 정보를 확인해주세요");
  };

  const handleLoginSuccessToast = () => {
    showSuccessToast("김철수님, 환영합니다!");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Hana2-CM" }}>
          토스트 알림 테스트 페이지
        </h1>
        <p className="text-gray-600">
          각 버튼을 클릭하여 토스트 알림의 스타일과 동작을 확인해보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 기본 토스트 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "Hana2-CM" }}>
              기본 토스트 테스트
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleSuccessToast}
              className="w-full"
              style={{ backgroundColor: "#008485", color: "white" }}
            >
              성공 토스트
            </Button>
            <Button 
              onClick={handleErrorToast}
              variant="destructive"
              className="w-full"
            >
              에러 토스트
            </Button>
            <Button 
              onClick={handleWarningToast}
              className="w-full"
              style={{ backgroundColor: "#f1c40f", color: "white" }}
            >
              경고 토스트
            </Button>
            <Button 
              onClick={handleInfoToast}
              className="w-full"
              style={{ backgroundColor: "#4a90e2", color: "white" }}
            >
              정보 토스트
            </Button>
          </CardContent>
        </Card>

        {/* 커스텀 토스트 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "Hana2-CM" }}>
              커스텀 토스트 테스트
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleCustomSuccessToast}
              className="w-full"
              style={{ backgroundColor: "#008485", color: "white" }}
            >
              커스텀 성공 토스트
            </Button>
            <Button 
              onClick={handleCustomErrorToast}
              variant="destructive"
              className="w-full"
            >
              커스텀 에러 토스트
            </Button>
          </CardContent>
        </Card>

        {/* 실제 사용 예시 */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "Hana2-CM" }}>
              실제 사용 예시
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleLoginErrorToast}
              variant="destructive"
              className="w-full"
            >
              로그인 에러 (입력 정보 확인)
            </Button>
            <Button 
              onClick={handleLoginSuccessToast}
              className="w-full"
              style={{ backgroundColor: "#008485", color: "white" }}
            >
              로그인 성공 (환영 메시지)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 토스트 스타일 정보 */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "Hana2-CM" }}>
            토스트 스타일 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">성공 토스트</h3>
              <div className="text-sm text-gray-600">
                <p>배경: #E5F7F7 (연한 민트색)</p>
                <p>텍스트: #008485 (민트색)</p>
                <p>테두리: #008485 (민트색)</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">에러 토스트</h3>
              <div className="text-sm text-gray-600">
                <p>배경: #FEF2F2 (연한 분홍색)</p>
                <p>텍스트: #e74c3c (빨간색)</p>
                <p>테두리: #e74c3c (빨간색)</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">경고 토스트</h3>
              <div className="text-sm text-gray-600">
                <p>배경: #FEFBF0 (연한 노란색)</p>
                <p>텍스트: #f1c40f (노란색)</p>
                <p>테두리: #f1c40f (노란색)</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">정보 토스트</h3>
              <div className="text-sm text-gray-600">
                <p>배경: #F0F7FF (연한 파란색)</p>
                <p>텍스트: #4a90e2 (파란색)</p>
                <p>테두리: #4a90e2 (파란색)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 공통 설정 정보 */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "Hana2-CM" }}>
            공통 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-1">
            <p>폰트: Hana2-Medium</p>
            <p>테두리 반경: 0.75rem</p>
            <p>표시 시간: 3초</p>
            <p>위치: top-center</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
