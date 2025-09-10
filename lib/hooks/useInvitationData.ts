import { useState, useCallback, useEffect } from 'react';
import { Invitation, InvitationStats, SortOption } from '@/features/invitation/types';
import { 
  useInvitations, 
  useFetchInvitations,
  useCreateInvitation,
  useUpdateInvitation,
  useDeleteInvitation,
  useSetRepresentative,
  useIsLoading, 
  useError 
} from '@/features/invitation/store/selectors';
import { mapInvitationToApiRequest, mapInvitationToUpdateRequest, mapApiResponseToInvitation } from '@/features/invitation/utils/invitationMapper';
import { useAuth } from './useAuth';
import { invitationApi } from '@/features/invitation/api/invitationApi';

export const useInvitationData = () => {
  const { isAuthenticated } = useAuth();
  const invitations = useInvitations();
  const fetchInvitations = useFetchInvitations();
  const createInvitation = useCreateInvitation();
  const updateInvitationAction = useUpdateInvitation();
  const deleteInvitationAction = useDeleteInvitation();
  const setRepresentativeAction = useSetRepresentative();
  const isLoading = useIsLoading();
  const error = useError();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 인증 상태에 따라 데이터 로드
  useEffect(() => {
    if (isAuthenticated) {
      fetchInvitations();
    }
  }, [isAuthenticated, fetchInvitations]);

  // 대표 청첩장 찾기
  const primaryInvitation = invitations.find(inv => inv.isRepresentative || inv.isPrimary);

  // 통계 계산 (목데이터 함수 대신 직접 계산)
  const stats: InvitationStats = {
    totalInvitations: invitations.length,
    completedInvitations: invitations.filter(inv => inv.status === '완료').length,
    draftInvitations: invitations.filter(inv => inv.status === '초안').length,
    totalViews: invitations.reduce((sum, inv) => sum + inv.totalViews, 0),
    primaryInvitation: primaryInvitation ? {
      id: primaryInvitation.id,
      title: primaryInvitation.title,
      totalViews: primaryInvitation.totalViews,
      todayViews: primaryInvitation.todayViews || 0,
      mainImageUrl: primaryInvitation.mainImageUrl, // 백엔드 DTO 기준으로 mainImageUrl 사용
      weddingDate: primaryInvitation.weddingDate,
      weddingLocation: primaryInvitation.weddingLocation || primaryInvitation.weddingHall,
      groomName: primaryInvitation.groomName,
      brideName: primaryInvitation.brideName,
    } : undefined,
  };

  // 검색 및 정렬된 청첩장 목록
  const filteredInvitations = invitations.filter(invitation => {
    const matchesSearch = searchTerm === '' || 
      invitation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.groomName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.brideName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'oldest':
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'views':
        return b.totalViews - a.totalViews;
      default:
        return 0;
    }
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredInvitations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvitations = filteredInvitations.slice(startIndex, startIndex + itemsPerPage);

  // 특정 ID의 청첩장 조회
  const getInvitationById = useCallback(async (id: number) => {
    try {
      const response = await invitationApi.getInvitation(id);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invitation by ID:', error);
      throw error;
    }
  }, []);

  // 대표 청첩장 설정 (API 연동 완료)
  const setPrimaryInvitation = useCallback(async (id: number) => {
    return await setRepresentativeAction(id);
  }, [setRepresentativeAction]);

  // 청첩장 삭제
  const deleteInvitation = useCallback(async (id: number) => {
    return await deleteInvitationAction(id);
  }, [deleteInvitationAction]);

  // 청첩장 추가
  const addInvitation = useCallback(async (invitationData: Partial<Invitation>, mainImage?: File) => {
    const apiRequest = await mapInvitationToApiRequest(invitationData);
    const result = await createInvitation(apiRequest, mainImage);
    return result;
  }, [createInvitation]);

  // 청첩장 업데이트
  const updateInvitation = useCallback(async (id: number, updates: Partial<Invitation>, mainImage?: File) => {
    const apiRequest = await mapInvitationToUpdateRequest(updates);
    const result = await invitationApi.updateInvitation(id, apiRequest, mainImage);
    return result.success;
  }, []);

  // 조회수 업데이트 (API 연동 필요)
  const incrementViews = useCallback((id: number, increment: number = 1) => {
    // TODO: API 연동 구현
    console.log('Increment views:', id, increment);
  }, []);

  // 상태 변경 (API 연동 필요)
  const changeStatus = useCallback((id: number, status: '완료' | '초안') => {
    // TODO: API 연동 구현
    console.log('Change status:', id, status);
  }, []);

  // 템플릿 변경 (API 연동 필요)
  const changeTemplate = useCallback((id: number, template: string) => {
    // TODO: API 연동 구현
    console.log('Change template:', id, template);
  }, []);

  // 제목 변경
  const changeTitle = useCallback(async (id: number, title: string) => {
    return await updateInvitationAction(id, { title });
  }, [updateInvitationAction]);

  // 공유 이미지 변경 (API 연동 필요)
  const changeShareImage = useCallback((id: number, imageUrl: string) => {
    // TODO: API 연동 구현
    console.log('Change share image:', id, imageUrl);
  }, []);

  // 검색어 변경
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  }, []);

  // 정렬 변경
  const handleSortChange = useCallback((value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
  }, []);

  // 페이지 변경
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    // 상태
    invitations,
    searchTerm,
    sortBy,
    currentPage,
    stats,
    primaryInvitation,
    paginatedInvitations,
    totalPages,
    isLoading,
    error,
    
    // 액션
    getInvitationById,
    setPrimaryInvitation,
    deleteInvitation,
    addInvitation,
    updateInvitation,
    incrementViews,
    changeStatus,
    changeTemplate,
    changeTitle,
    changeShareImage,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
  };
}; 