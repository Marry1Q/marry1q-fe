"use client"

declare global {
  interface Window {
    Kakao?: any;
  }
}

type TemplateArgs = Record<string, string | number | undefined>

export function useKakaoShare() {
  const isReady = () => {
    if (typeof window === 'undefined') return false;
    const Kakao = window.Kakao;
    return !!(Kakao && Kakao.isInitialized && Kakao.isInitialized());
  };

  const sendCustom = (templateId: number, templateArgs?: TemplateArgs) => {
    if (!isReady()) return false;
    try {
      window.Kakao!.Share.sendCustom({ templateId, templateArgs });
      return true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Kakao sendCustom error:', e);
      return false;
    }
  };

  return { isReady, sendCustom };
}


