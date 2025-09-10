"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  showSuccessAlert,
  showWarningAlert,
  showErrorAlert,
  showInfoAlert,
  showConfirmDialog,
  showAccountDeleteConfirm,
  showPageLeaveConfirm,
  showSuccessMessage,
} from "@/components/ui/CustomAlert";

export default function AlertTestPage() {
  const handleSuccessAlert = () => {
    showSuccessAlert({
      title: "성공!",
      text: "작업이 성공적으로 완료되었습니다.",
    });
  };

  const handleWarningAlert = () => {
    showWarningAlert({
      title: "경고",
      text: "이 작업은 되돌릴 수 없습니다.",
    });
  };

  const handleErrorAlert = () => {
    showErrorAlert({
      title: "오류 발생",
      text: "작업 중 오류가 발생했습니다.",
    });
  };

  const handleInfoAlert = () => {
    showInfoAlert({
      title: "정보",
      text: "이것은 정보 메시지입니다.",
    });
  };

  const handleConfirmDialog = () => {
    showConfirmDialog({
      title: "확인",
      text: "정말로 이 작업을 수행하시겠습니까?",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      showCancelButton: true,
    });
  };

  const handleAccountDelete = () => {
    showAccountDeleteConfirm("356 03", "NH농협은행");
  };

  const handlePageLeave = () => {
    showPageLeaveConfirm();
  };

  const handleSuccessMessage = () => {
    showSuccessMessage(
      "Plan1Q 생성 완료!",
      "버킷리스트 목표를 위한 포트폴리오가 성공적으로 생성되었습니다."
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Hana2-CM" }}>
          CustomAlert 테스트
        </h1>
        <p className="text-gray-600">새로운 은행 앱 스타일 알림 컴포넌트 테스트</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "Hana2-CM" }}>성공 알림</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSuccessAlert} className="w-full">
              성공 알림 보기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "Hana2-CM" }}>경고 알림</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleWarningAlert} 
              className="w-full"
              variant="outline"
            >
              경고 알림 보기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "Hana2-CM" }}>에러 알림</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleErrorAlert} 
              className="w-full"
              variant="destructive"
            >
              에러 알림 보기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "Hana2-CM" }}>정보 알림</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleInfoAlert} 
              className="w-full"
              variant="secondary"
            >
              정보 알림 보기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "Hana2-CM" }}>확인 다이얼로그</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleConfirmDialog} 
              className="w-full"
              variant="outline"
            >
              확인 다이얼로그 보기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "Hana2-CM" }}>계좌 삭제 확인</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleAccountDelete} 
              className="w-full"
              variant="destructive"
            >
              계좌 삭제 확인 보기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "Hana2-CM" }}>페이지 이탈 확인</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handlePageLeave} 
              className="w-full"
              variant="outline"
            >
              페이지 이탈 확인 보기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "Hana2-CM" }}>성공 메시지</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSuccessMessage} 
              className="w-full"
              style={{ backgroundColor: "#008485" }}
            >
              Plan1Q 성공 메시지 보기
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "Hana2-CM" }}>
          사용법
        </h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• <code>showSuccessAlert()</code> - 성공 알림</p>
          <p>• <code>showWarningAlert()</code> - 경고 알림</p>
          <p>• <code>showErrorAlert()</code> - 에러 알림</p>
          <p>• <code>showInfoAlert()</code> - 정보 알림</p>
          <p>• <code>showConfirmDialog()</code> - 확인/취소 다이얼로그</p>
          <p>• <code>showAccountDeleteConfirm()</code> - 계좌 삭제 확인</p>
          <p>• <code>showPageLeaveConfirm()</code> - 페이지 이탈 확인</p>
          <p>• <code>showSuccessMessage()</code> - 성공 메시지</p>
        </div>
      </div>
    </div>
  );
} 