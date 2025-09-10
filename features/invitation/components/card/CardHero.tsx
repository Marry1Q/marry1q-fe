import React from "react";
import { Invitation } from "@/features/invitation/types";

interface CardHeroProps {
  invitation?: Invitation;
  uploadedPhotos?: string[];
  isPreview?: boolean;
}

export function CardHero({ invitation, uploadedPhotos = [], isPreview }: CardHeroProps) {
  // invitation이 없을 경우 기본값 설정
  const defaultInvitation: Invitation = {
    id: 0,
    coupleId: 0,
    title: "우리의 결혼식",
    status: "초안",
    views: 0,
    totalViews: 0,
    todayViews: 0,
    template: "클래식 로맨틱",
    isPrimary: false,
    mainImageUrl: "/invitation/invitationMainImage1.jpeg",
    weddingDate: "",
    weddingTime: "",
    weddingHall: "",
    venueAddress: "",
    createdAt: "",
    updatedAt: "",
    isRepresentative: false,
    groomName: "성훈",
    brideName: "채연",
    groomPhone: "",
    bridePhone: "",
    groomParents: "이영준 · 김경숙",
    brideParents: "김명국 · 정은희",
  };

  const currentInvitation = invitation || defaultInvitation;
  
  // 메인 이미지 결정 로직
  const getMainImage = () => {
    // mainImageUrl (백엔드 응답) 우선 확인
    if (currentInvitation.mainImageUrl) {
      return currentInvitation.mainImageUrl;
    }
    // shareImage (프론트엔드 상태) 확인
    if (currentInvitation.shareImage) {
      return currentInvitation.shareImage;
    }
    if (uploadedPhotos && uploadedPhotos.length > 0) {
      return uploadedPhotos[0];
    }
    return null; // 이미지가 없음을 나타냄
  };
  
  const mainImage = getMainImage();
  
  // 디버깅을 위한 로그 추가
  console.log('CardHero - mainImage:', mainImage);
  console.log('CardHero - currentInvitation.mainImageUrl:', currentInvitation.mainImageUrl);
  console.log('CardHero - currentInvitation.shareImage:', currentInvitation.shareImage);
  
  // 부모님 이름 분리 - groomParentsDetail과 brideParentsDetail 우선 사용
  const groomParents = currentInvitation.groomParentsDetail 
    ? [currentInvitation.groomParentsDetail.father, currentInvitation.groomParentsDetail.mother]
    : typeof currentInvitation.groomParents === 'string' 
      ? currentInvitation.groomParents.split(" · ") 
      : ["", ""];
  const brideParents = currentInvitation.brideParentsDetail
    ? [currentInvitation.brideParentsDetail.father, currentInvitation.brideParentsDetail.mother]
    : typeof currentInvitation.brideParents === 'string'
      ? currentInvitation.brideParents.split(" · ")
      : ["", ""];
  
  // 디버깅을 위한 로그 추가
  console.log('CardHero - currentInvitation:', currentInvitation);
  console.log('CardHero - groomParentsDetail:', currentInvitation.groomParentsDetail);
  console.log('CardHero - brideParentsDetail:', currentInvitation.brideParentsDetail);
  console.log('CardHero - groomParents (parsed):', groomParents);
  console.log('CardHero - brideParents (parsed):', brideParents);
  
  return (
    <section className="relative bg-white max-w-sm mb-12">
      {/* 배경 이미지 컨테이너 */}
      <div className="relative w-full h-screen mb-12">
        {/* 메인 이미지 */}
        {mainImage ? (
          <img 
            draggable="false" 
            className="relative w-full h-full object-cover select-none pointer-events-none" 
            style={{
              filter: "contrast(85%) brightness(115%) saturate(95%) sepia(5%) hue-rotate(5deg)"
            }}
            src={mainImage}
            alt="Wedding background"
            onError={(e) => {
              // 이미지 로드 실패 시 기본 이미지로 대체
              const target = e.target as HTMLImageElement;
              target.src = "/invitation/invitationMainImage1.jpeg";
            }}
          />
        ) : (
          <div className="relative w-full h-full bg-gradient-to-b from-pink-100 to-white flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm">메인 이미지가 없습니다</p>
            </div>
          </div>
        )}
      </div>
      
      {/* 신랑신부 정보 - 새로운 레이아웃 */}
      <div className="relative flex flex-col items-center justify-center bg-white mb-12">     
        
        <div className="flex items-center justify-center tracking-widest mt-12">
          <div className="flex flex-col items-end gap-4">
            {/* 신랑 부모님 */}
            <div className="flex flex-col items-center">
              <div className="font-semibold text-center break-keep">
                {groomParents[0] || "신랑 아버지"}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-semibold text-center break-keep">
              {brideParents[0] || "신부 아버지"}
              </div>
            </div>
          </div>
          
          {/* 중앙 구분선 */}
          <div className="flex flex-col items-center gap-4 mx-4">
            <div className="mx-3">·</div>
            <div className="mx-3">·</div>
          </div>
          
          {/* 신부 측 */}
          <div className="flex flex-col items-end gap-4">
            {/* 신부 부모님 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                
              </div>
              <div className="font-semibold text-center break-keep">
              {groomParents[1] || "신랑 어머니"}
                
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-semibold text-center break-keep">
                {brideParents[1] || "신부 어머니"}
              </div>
            </div>
          </div>
          
          {/* 관계 표시 */}
          <div className="flex flex-col items-center gap-4 mx-4">
            <div className="mr-20" style={{ marginRight: '10px' }}>의</div>
            <div className="mr-20" style={{ marginRight: '10px' }}>의</div>
          </div>
          
          {/* 관계명 */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-center whitespace-pre-wrap" style={{ marginRight: '10px' }}>아들</div>
            <div className="text-center whitespace-pre-wrap" style={{ marginRight: '10px' }}>딸</div>
          </div>
          
          {/* 이름 */}
          <div className="flex flex-col items-center gap-4 ml-12">
            <div className="font-semibold text-center whitespace-pre-wrap">
              {currentInvitation.groomName || "신랑"}
            </div>
            <div className="font-semibold text-center whitespace-pre-wrap">
              {currentInvitation.brideName || "신부"}
            </div>
          </div>
        </div>       
      </div>
      {/* 메시지 영역 */}
      <div className="text-center mt-12">
          <p className="text-lg mb-4" style={{ fontFamily: 'Bona Nova SC', color: '#d099a1' }}>
            INVITE YOU
          </p>
        </div>
      <div className="text-center space-y-4">
          {currentInvitation.message ? (
            <div className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
              {currentInvitation.message}
            </div>
          ) : (
            <>
              <p className="text-base text-gray-800 leading-relaxed">
                저희 두 사람이 평생을 함께하기 위해<br />
                서로의 반려자가 되려 합니다.
              </p>
              <p className="text-base text-gray-800 leading-relaxed">
                그 진실한 서약을 하는 자리에<br />
                소중한 분들을 모십니다.
              </p>
              <p className="text-base text-gray-800 leading-relaxed">
                자리하시어 축복해 주시면<br />
                대단히 감사하겠습니다.
              </p>
            </>
          )}
        </div>
    </section>
  );
}