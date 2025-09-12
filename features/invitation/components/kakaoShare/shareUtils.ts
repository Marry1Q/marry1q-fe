export function toHHmm(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

// 🔧 개선된 청첩장 설명 생성 함수
export function buildInvitationDesc(dateStr?: string, timeStr?: string, venue?: string, address?: string): string {
  const parts: string[] = [];
  if (dateStr) parts.push(dateStr);
  if (timeStr) parts.push(timeStr);
  if (venue) parts.push(venue);
  if (address) parts.push(address);
  return parts.join(' / ');
}

// 🔧 카카오 공유용 포맷팅 함수 추가
export function formatForKakaoShare(invitation: {
  title?: string;
  weddingDate?: string;
  weddingTime?: string;
  weddingLocation?: string;
  venueAddress?: string;
  mainImageUrl?: string;
  groomName?: string;
  brideName?: string;
}) {
  const formatWeddingDate = (dateString: string): string => {
    if (!dateString) return "날짜 미정";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "날짜 미정";
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
      
      return `${year}. ${month}. ${day}. ${dayOfWeek}`;
    } catch {
      return "날짜 미정";
    }
  };

  const formatWeddingTime = (timeString?: string): string => {
    if (!timeString) return "";
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const minute = parseInt(minutes);
      
      const ampm = hour < 12 ? "AM" : "PM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayMinute = minute.toString().padStart(2, '0');
      
      return `${ampm} ${displayHour}:${displayMinute}`;
    } catch {
      return timeString;
    }
  };

  return {
    title: invitation.title || "결혼식에 초대합니다",
    date: `${formatWeddingDate(invitation.weddingDate || "")}\n${formatWeddingTime(invitation.weddingTime)}`,
    venue: `${invitation.weddingLocation || "장소 미정"} ${invitation.venueAddress || ""}`.trim(),
    groomName: invitation.groomName || "",
    brideName: invitation.brideName || "",
    // 이미지 URL을 절대 경로로 변환
    THU: invitation.mainImageUrl ? 
      (invitation.mainImageUrl.startsWith('http') ? 
        invitation.mainImageUrl : 
        `${typeof window !== 'undefined' ? window.location.origin : ''}${invitation.mainImageUrl}`) : 
      `${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/invitationMainImage1.jpeg`,
  };
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}