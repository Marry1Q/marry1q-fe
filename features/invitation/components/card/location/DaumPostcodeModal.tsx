"use client";

import { useEffect, useMemo, useState } from "react";
import { DaumPostcodeEmbed } from "react-daum-postcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DaumPostcodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  onComplete: (data: any) => void;
  height?: number;
}

export default function DaumPostcodeModal({
  open,
  onOpenChange,
  title = "주소 검색",
  onComplete,
  height = 420,
}: DaumPostcodeModalProps) {
  const [mountKey, setMountKey] = useState(0);

  // Remount the embed each time dialog opens to avoid rendering issues
  useEffect(() => {
    if (open) setMountKey((k) => k + 1);
  }, [open]);

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          <div className="w-full overflow-hidden rounded border" style={{ height }}>
            {open && (
              <DaumPostcodeEmbed key={mountKey} onComplete={onComplete} autoClose={false} style={containerStyle} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


