// 카테고리별 아이콘 매핑
export const getCategoryIcon = (financeCategoryId: number | null): string => {
  if (!financeCategoryId) {
    return '/hana3dIcon/hanaIcon3d_6_83.png'; // 기타 (톱니바퀴 아이콘)
  }

  const categoryIconMap: Record<number, string> = {
    // 신혼여행/허니문
    15: '/hana3dIcon/hanaIcon3d_6_11.png', // 비행기 모양 아이콘
    
    // 신혼집/가구/인테리어
    16: '/hana3dIcon/hanaIcon3d_6_101.png', // 분홍색 집 아이콘
    
    // 예식장/연회장 비용
    14: '/hana3dIcon/hanaIcon3d_6_35.png', // 건물 아이콘
    
    // 웨딩드레스/수트
    12: '/hana3dIcon/hanaIcon3d_6_53.png', // 넥타이 아이콘
    
    // 웨딩촬영/스냅
    13: '/hana3dIcon/hanaIcon3d_6_31.png', // 카메라/촬영 아이콘
  };

  return categoryIconMap[financeCategoryId] || '/hana3dIcon/hanaIcon3d_6_83.png';
};

// 카테고리명 매핑
export const getCategoryName = (financeCategoryId: number | null): string => {
  if (!financeCategoryId) {
    return '기타';
  }

  const categoryNameMap: Record<number, string> = {
    15: '신혼여행/허니문',
    16: '신혼집/가구/인테리어',
    14: '예식장/연회장 비용',
    12: '웨딩드레스/수트',
    13: '웨딩촬영/스냅',
  };

  return categoryNameMap[financeCategoryId] || '기타';
};

// 카테고리 정보 객체
export const getCategoryInfo = (financeCategoryId: number | null) => {
  return {
    id: financeCategoryId,
    name: getCategoryName(financeCategoryId),
    icon: getCategoryIcon(financeCategoryId),
  };
};
