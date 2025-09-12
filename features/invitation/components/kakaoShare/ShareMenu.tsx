"use client"

import { useState } from "react"
import { ShareModal } from "./ShareModal"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

type ShareMenuProps = {
  templateId: number;
  templateArgs?: Record<string, string | number | undefined>;
  linkUrl: string;
}

export function ShareMenu({ templateId, templateArgs, linkUrl }: ShareMenuProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2"
        title="공유"
      >
        <Share2 className="w-4 h-4" />
      </Button>
      
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        templateId={templateId}
        templateArgs={templateArgs}
        linkUrl={linkUrl}
      />
    </>
  )
}


