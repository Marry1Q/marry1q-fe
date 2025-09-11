"use client"

import { useState } from "react"
import { useKakaoShare } from "./useKakaoShare"
import { copyToClipboard } from "./shareUtils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type ShareMenuProps = {
  templateId: number;
  templateArgs?: Record<string, string | number | undefined>;
  linkUrl: string;
}

export function ShareMenu({ templateId, templateArgs, linkUrl }: ShareMenuProps) {
  const { isReady, sendCustom } = useKakaoShare();
  const [open, setOpen] = useState(false);

  const onKakao = () => {
    if (!isReady()) {
      toast.error("카카오 공유를 초기화할 수 없습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    const ok = sendCustom(templateId, templateArgs);
    if (!ok) {
      toast.error("카카오 공유 중 오류가 발생했습니다.");
    }
    setOpen(false);
  };

  const onCopy = async () => {
    const ok = await copyToClipboard(linkUrl);
    if (ok) toast.success("링크가 복사되었습니다.");
    else toast.error("링크 복사에 실패했습니다.");
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      <Button onClick={() => setOpen((v) => !v)}>공유</Button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow">
          <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={onKakao}>카카오톡 공유</button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={onCopy}>링크 복사</button>
        </div>
      )}
    </div>
  )
}


