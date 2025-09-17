"use client"

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, AlertCircle, CheckCircle } from "lucide-react";

interface KakaoShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: number;
  templateArgs?: Record<string, string | number | undefined>;
  isLoading?: boolean;
  error?: string | null;
}

export function KakaoShareModal({ 
  isOpen, 
  onClose, 
  templateId, 
  templateArgs,
  isLoading = false,
  error = null
}: KakaoShareModalProps) {
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2" style={{ fontFamily: "Hana2-CM" }}>
              <MessageCircle className="w-5 h-5 text-yellow-500" />
              카카오톡 공유
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="py-6">
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-hana">카카오톡으로 공유 중...</p>
              <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요.</p>
            </div>
          )}
          
          {error && (
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4 font-hana">{error}</p>
              <Button onClick={onClose} variant="outline" className="font-hana">
                닫기
              </Button>
            </div>
          )}
          
          {!isLoading && !error && (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4 font-hana">
                카카오톡 공유가 시작되었습니다.
              </p>
              <p className="text-sm text-gray-500 font-hana">
                카카오톡 앱에서 공유를 완료해주세요.
              </p>
              <div className="mt-4">
                <Button onClick={onClose} variant="outline" className="font-hana">
                  확인
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
