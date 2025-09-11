export function toHHmm(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function buildInvitationDesc(dateStr?: string, timeStr?: string, venue?: string): string {
  const parts: string[] = [];
  if (dateStr) parts.push(dateStr);
  if (timeStr) parts.push(timeStr);
  if (venue) parts.push(venue);
  return parts.join(' / ');
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


