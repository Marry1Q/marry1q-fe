// 하나은행 3D 아이콘 매핑 시스템 (실제 존재하는 파일들만 매핑)
export const iconMapping = {
  // 결혼/예식 관련
  wedding_hall: "/hana3dIcon/hanaIcon3d_3_105.png", // 예식장
  wedding_dress: "/hana3dIcon/hanaIcon3d_3_103.png", // 웨딩드레스
  wedding_ring: "/hana3dIcon/hanaIcon3d_3_105.png", // 결혼반지
  wedding_gift: "/hana3dIcon/hanaIcon3d_3_107.png", // 결혼선물

  // 주택/부동산 관련
  house_deposit: "/hana3dIcon/hanaIcon3d_83.png", // 주택보증금
  house_furniture: "/hana3dIcon/hanaIcon3d_3_13.png", // 가전제품
  house_renovation: "/hana3dIcon/hanaIcon3d_3_15.png", // 집수리
  house_moving: "/hana3dIcon/hanaIcon3d_3_17.png", // 이사비용

  // 여행/휴가 관련
  honeymoon: "/hana3dIcon/hanaIcon3d_3_121.png", // 신혼여행
  travel: "/hana3dIcon/hanaIcon3d_3_31.png", // 여행
  vacation: "/hana3dIcon/hanaIcon3d_3_33.png", // 휴가

  // 금융/투자 관련
  savings: "/hana3dIcon/hanaIcon3d_2_29.png", // 적금
  deposit: "/hana3dIcon/hanaIcon3d_3_37.png", // 예금
  investment: "/hana3dIcon/hanaIcon3d_3_47.png", // 투자
  fund: "/hana3dIcon/hanaIcon3d_4_47.png", // 펀드
  bond: "/hana3dIcon/hanaIcon3d_4_47.png", // 채권
  etf: "/hana3dIcon/hanaIcon3d_3_53.png", // ETF
  auto_transfer: "/hana3dIcon/hanaIcon3d_6_67.png", // 자동이체

  // 교육/자기계발
  education: "/hana3dIcon/hanaIcon3d_3_53.png", // 교육
  study: "/hana3dIcon/hanaIcon3d_3_65.png", // 공부
  certification: "/hana3dIcon/hanaIcon3d_3_67.png", // 자격증

  // 차량 관련
  car: "/hana3dIcon/hanaIcon3d_3_69.png", // 자동차
  car_maintenance: "/hana3dIcon/hanaIcon3d_3_71.png", // 차량정비

  // 건강/의료
  health: "/hana3dIcon/hanaIcon3d_3_83.png", // 건강
  medical: "/hana3dIcon/hanaIcon3d_3_85.png", // 의료

  // 기타
  shopping: "/hana3dIcon/hanaIcon3d_3_87.png", // 쇼핑
  entertainment: "/hana3dIcon/hanaIcon3d_3_89.png", // 엔터테인먼트
  sports: "/hana3dIcon/hanaIcon3d_3_119.png", // 스포츠
  hobby: "/hana3dIcon/hanaIcon3d_3_121.png", // 취미

  // 기본 아이콘들 (기존 코드와 호환)
  star: "/hana3dIcon/hanaIcon3d_3_101.png",
  house_blue_roof: "/hana3dIcon/hanaIcon3d_3_11.png",
  rocket: "/hana3dIcon/hanaIcon3d_3_29.png",
  gift_box: "/hana3dIcon/hanaIcon3d_3_107.png",
  house_red_roof: "/hana3dIcon/hanaIcon3d_3_13.png",
} as const;

export type IconName = keyof typeof iconMapping;

// 아이콘 카테고리별 분류
export const iconCategories = {
  wedding: ["wedding_hall", "wedding_dress", "wedding_ring", "wedding_gift"],
  housing: [
    "house_deposit",
    "house_furniture",
    "house_renovation",
    "house_moving",
  ],
  travel: ["honeymoon", "travel", "vacation"],
  finance: ["savings", "deposit", "investment", "fund", "bond", "etf", "auto_transfer"],
  education: ["education", "study", "certification"],
  vehicle: ["car", "car_maintenance"],
  health: ["health", "medical"],
  lifestyle: ["shopping", "entertainment", "sports", "hobby"],
} as const;

// 아이콘 메타데이터
export const iconMetadata = {
  wedding_hall: {
    name: "예식장",
    category: "wedding",
    description: "결혼식 예식장 비용",
  },
  wedding_dress: {
    name: "웨딩드레스",
    category: "wedding",
    description: "웨딩드레스 및 정장",
  },
  wedding_ring: {
    name: "결혼반지",
    category: "wedding",
    description: "결혼반지 구매",
  },
  wedding_gift: {
    name: "결혼선물",
    category: "wedding",
    description: "결혼 관련 선물",
  },
  house_deposit: {
    name: "주택보증금",
    category: "housing",
    description: "주택 전세/월세 보증금",
  },
  house_furniture: {
    name: "가전제품",
    category: "housing",
    description: "가전제품 및 가구",
  },
  honeymoon: {
    name: "신혼여행",
    category: "travel",
    description: "신혼여행 자금",
  },
  savings: { name: "적금", category: "finance", description: "저축 및 적금" },
  deposit: { name: "예금", category: "finance", description: "예금 상품" },
  investment: { name: "투자", category: "finance", description: "투자 상품" },
  fund: { name: "펀드", category: "finance", description: "펀드 상품" },
  bond: { name: "채권", category: "finance", description: "채권 상품" },
  etf: { name: "ETF", category: "finance", description: "ETF 상품" },
  auto_transfer: { name: "자동이체", category: "finance", description: "정기 자동이체" },
} as const;
