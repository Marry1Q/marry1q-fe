import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";
import { colors } from "@/../../constants/colors";

interface AccountItemProps {
  name: string;
  accountNumber: string;
  bankName: string;
  fieldId: string;
  onCopy: (text: string, fieldId: string) => void;
  copiedField: string | null;
}

export default function AccountItem({ 
  name, 
  accountNumber, 
  bankName, 
  fieldId, 
  onCopy, 
  copiedField 
}: AccountItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div>

        <p className="text-sm text-gray-700 Pretendard">{accountNumber || bankName}</p>
      </div>
      <div className="flex">
        <button 
          onClick={() => {
            onCopy(accountNumber || `${bankName} ${accountNumber}`, fieldId);
            toast.success("복사 완료!", {
              style: {
                background: colors.primary.toastBg,
                color: colors.primary.main,
                border: `1px solid ${colors.primary.main}`,
                fontFamily: "Hana2-Medium",
              },
            });
          }}
          className="py-2 bg-white text-gray-600 text-sm rounded-lg"
        >
          {copiedField === fieldId ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
        <button 
          onClick={() => {
            // 하나원큐 앱 실행 딥링크
            const hana1qUrl = 'hana1q://';
            
            // 디바이스 타입 감지
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isAndroid = /Android/.test(navigator.userAgent);
            
            // 플랫폼별 스토어 URL
            let fallbackUrl = '';
            if (isIOS) {
              fallbackUrl = 'https://apps.apple.com/kr/app/hana1q/id1362508015';
            } else if (isAndroid) {
              fallbackUrl = 'https://play.google.com/store/apps/details?id=com.hanabank.hana1q';
            } else {
              // 데스크톱의 경우 기본적으로 안드로이드 스토어로 이동
              fallbackUrl = 'https://play.google.com/store/apps/details?id=com.hanabank.hana1q';
            }
            
            // iOS에서 딥링크 처리 개선
            if (isIOS) {
              // iOS에서는 iframe을 사용하여 딥링크 시도
              const iframe = document.createElement('iframe');
              iframe.style.display = 'none';
              iframe.src = hana1qUrl;
              document.body.appendChild(iframe);
              
              // iframe 제거
              setTimeout(() => {
                document.body.removeChild(iframe);
              }, 100);
              
              // 앱이 설치되어 있지 않을 경우를 대비해 2초 후 스토어로 리다이렉트
              setTimeout(() => {
                window.location.href = fallbackUrl;
              }, 2000);
            } else {
              // Android 및 기타 플랫폼
              window.location.href = hana1qUrl;
              
              // 앱이 설치되어 있지 않을 경우를 대비해 3초 후 스토어로 리다이렉트
              setTimeout(() => {
                window.location.href = fallbackUrl;
              }, 3000);
            }
          }}
          className="px-4 bg-white text-black text-sm rounded-lg flex items-center justify-center"
        >
          <img 
            src="/hana1qLogo.png" 
            alt="하나원큐" 
            className="w-4 h-4"
          />
        </button>
      </div>
    </div>
  );
} 