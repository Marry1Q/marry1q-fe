"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import type { ImageState } from "@/features/invitation/types/invitation"

interface ShareImageUploadProps {
  currentImageState?: ImageState;
  onImageChange?: (imageState: ImageState) => void;
}

export function ShareImageUpload({ 
  currentImageState, 
  onImageChange 
}: ShareImageUploadProps) {
  
  const [isDragOver, setIsDragOver] = useState(false)
  const [imageState, setImageState] = useState<ImageState>(
    currentImageState || {
      file: null,
      previewUrl: "/placeholder.svg?height=300&width=400&text=대표+사진",
      uploadedUrl: "",
      isUploaded: false
    }
  )

  // props로 받은 currentImageState가 변경되면 상태 업데이트
  useEffect(() => {
    if (currentImageState) {
      setImageState(currentImageState);
    }
  }, [currentImageState]);

  // 컴포넌트 언마운트 시 임시 URL 정리
  useEffect(() => {
    return () => {
      if (imageState.previewUrl && imageState.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageState.previewUrl);
      }
    };
  }, [imageState.previewUrl]);

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    
    try {
      // 1. 이전 임시 URL 정리
      if (imageState.previewUrl && imageState.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageState.previewUrl);
      }
      
      // 2. 새 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(file);
      
      // 3. 상태 업데이트 (업로드하지 않고 미리보기만)
      const newImageState: ImageState = {
        file: file,
        previewUrl: previewUrl,
        uploadedUrl: "",
        isUploaded: false
      };
      
      setImageState(newImageState);
      
      // 4. 부모 컴포넌트에 변경 알림
      if (onImageChange) {
        onImageChange(newImageState);
      }
    } catch (error) {
      console.error('Image selection error:', error);
      toast.error('이미지 선택에 실패했습니다.');
      
      // 에러 시 상태 복원
      const errorImageState: ImageState = {
        file: null,
        previewUrl: "/placeholder.svg?height=300&width=400&text=대표+사진",
        uploadedUrl: "",
        isUploaded: false
      };
      
      setImageState(errorImageState);
      if (onImageChange) {
        onImageChange(errorImageState);
      }
    }
  }

  const handleDeleteImage = async () => {
    try {
      // 1. 이전 임시 URL 정리
      if (imageState.previewUrl && imageState.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageState.previewUrl);
      }
      
      // 2. 상태 초기화
      const resetImageState: ImageState = {
        file: null,
        previewUrl: "/placeholder.svg?height=300&width=400&text=대표+사진",
        uploadedUrl: "",
        isUploaded: false
      };
      
      setImageState(resetImageState);
      
      // 3. 부모 컴포넌트에 변경 알림
      if (onImageChange) {
        onImageChange(resetImageState);
      }
      
      toast.success('이미지가 삭제되었습니다.');
    } catch (error) {
      console.error('Delete image error:', error);
      toast.error('이미지 삭제에 실패했습니다.');
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleFileSelect(file);
      } else {
        toast.error('이미지 파일만 업로드 가능합니다.');
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        handleFileSelect(file);
      } else {
        toast.error('이미지 파일만 업로드 가능합니다.');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ fontFamily: "Hana2-CM" }}>
          대표 사진
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">


          {/* 파일 선택 버튼 */}
          <div className="flex justify-center">
            <Button
              onClick={handleClick}
              variant="outline"
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              이미지 선택
            </Button>
          </div>

          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* 안내 메시지 */}
          <div className="text-sm text-gray-500 text-center">
            <p>이미지 선택 시 청첩장에 미리보기가 표시됩니다</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 