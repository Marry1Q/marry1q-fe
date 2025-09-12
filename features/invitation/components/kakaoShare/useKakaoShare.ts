"use client"

declare global {
  interface Window {
    Kakao?: any;
  }
}

type TemplateArgs = Record<string, string | number | undefined>

export function useKakaoShare() {
  const getKakao = () => (typeof window !== 'undefined' ? window.Kakao : undefined);

  const isReady = () => {
    const Kakao = getKakao();
    return !!(Kakao && Kakao.isInitialized && Kakao.isInitialized());
  };

  const tryInit = () => {
    const Kakao = getKakao();
    const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
    if (Kakao && Kakao.init && !Kakao.isInitialized() && key) {
      try {
        Kakao.init(key);
      } catch {
        // ignore
      }
    }
  };

  const waitForReady = async (timeoutMs = 3000, intervalMs = 100): Promise<boolean> => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      tryInit();
      if (isReady()) return true;
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    return isReady();
  };

  const sendCustom = async (templateId: number, templateArgs?: TemplateArgs): Promise<boolean> => {
    const ready = await waitForReady();
    if (!ready) return false;
    try {
      getKakao()!.Share.sendCustom({ templateId, templateArgs });
      return true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Kakao sendCustom error:', e);
      return false;
    }
  };

  return { isReady, sendCustom };
}


