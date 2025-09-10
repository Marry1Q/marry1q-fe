import React, { useState } from "react";
import { Image, X, ChevronLeft, ChevronRight } from "lucide-react";

interface CardGalleryProps {
  uploadedPhotos: string[];
  isPreview?: boolean;
}

export function CardGallery({ uploadedPhotos, isPreview }: CardGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null && selectedImage < uploadedPhotos.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  // Pinterest 스타일 갤러리 레이아웃을 위한 높이 계산
  const getRandomHeight = (index: number) => {
    const heights = [200, 250, 300, 350, 400];
    return heights[index % heights.length];
  };

  return (
    <>
      <div className="relative">
        {/* 스와이프 안내 오버레이 */}
        {uploadedPhotos.length > 0 && (
          <div className="px-4 pb-3 absolute right-4 top-6 z-20 bg-black bg-opacity-50 rounded-md">
            <div className="mx-auto flex items-center justify-center overflow-hidden">
              {/* 스와이프 애니메이션 아이콘 */}
              <div className="w-6 h-6 text-white animate-pulse">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>
            </div>
            <div className="text-sm font-light text-center text-white tracking-tight">
              <span>밀어서 갤러리 사진보기</span>
            </div>
          </div>
        )}

        {/* 갤러리 영역 */}
        <div className="overflow-x-auto section-gallery-area-2 gallery-box-size box-size px-3 relative gallery-wrapper" style={{ height: '60rem', overflow: 'auto' }}>
          <div className="relative">
            {/* Pinterest 스타일 갤러리 그리드 */}
            <div className="relative" style={{ width: `${uploadedPhotos.length * 200}px` }}>
              {uploadedPhotos.map((photo, index) => {
                const height = getRandomHeight(index);
                const left = index * 200;
                const top = index % 3 === 0 ? 0 : index % 3 === 1 ? height * 0.5 : height;
                
                return (
                  <div
                    key={index}
                    className="absolute p-[6px]"
                    style={{
                      top: `${top}px`,
                      left: `${left}px`,
                      width: '200px',
                      height: `${height}px`
                    }}
                  >
                    <div
                      className="w-full h-full cursor-pointer gallery-item rounded-md select-none pointer-events-none overflow-hidden"
                      onClick={() => handleImageClick(index)}
                    >
                      <img
                        src={photo}
                        alt={`사진 ${index + 1}`}
                        className="bg-full w-full h-full object-cover block cursor-pointer gallery-item rounded-md select-none pointer-events-none"
                        draggable={false}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* 이전/다음 버튼 */}
            {selectedImage > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            
            {selectedImage < uploadedPhotos.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
            
            {/* 이미지 */}
            <img
              src={uploadedPhotos[selectedImage]}
              alt={`사진 ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* 인디케이터 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {selectedImage + 1} / {uploadedPhotos.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}