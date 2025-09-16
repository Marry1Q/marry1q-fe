"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DaumPostcodeModal from "./DaumPostcodeModal";
import { colors } from "@/constants/colors";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { geocodeAddress } from "./geocodeAddress";
import type { AddressResult } from "./types";

interface AddressSearchButtonProps {
  onSelected: (result: AddressResult) => void;
  address?: string | null;
  className?: string;
}

/**
 * Opens Kakao/Daum Postcode popup to select a road address,
 * then geocodes it to lat/lng using Kakao Local REST API (client-side).
 */
export default function AddressSearchButton({ onSelected, address, className }: AddressSearchButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const restApiKey = useMemo(() => process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY, []);

  const onComplete = useCallback(async (data: any) => {
    const roadAddress: string = data?.roadAddress || data?.address || "";
    if (!roadAddress) return;
    setLoading(true);
    setError(null);
    try {
      const result = await geocodeAddress(roadAddress, restApiKey);
      if (!result.lat || !result.lng) {
        setError("주소를 좌표로 변환하지 못했습니다");
        onSelected({ address: roadAddress });
      } else {
        onSelected({ address: roadAddress, ...result });
      }
    } catch (e: any) {
      setError(e?.message || "지오코딩 실패");
      onSelected({ address: roadAddress });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }, [restApiKey, onSelected]);

  useEffect(() => {}, []);

  const primaryBg = colors.primary.main;

  const renderButton = () => {
    if (!address) {
      return (
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          className={`${className || "w-full mt-4 py-3"}`}
          style={{ borderColor: colors.primary.main, color: colors.primary.main, fontFamily: "Hana2-Medium" }}
        >
          {loading ? "주소 검색 준비 중..." : "등록하기"}
        </Button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`h-10 w-10 rounded flex items-center justify-center ${className || ""}`}
        style={{ backgroundColor: primaryBg, color: "#fff" }}
        aria-label="주소 재검색"
        title="주소 재검색"
      >
        <Search size={18} />
      </button>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {renderButton()}
      {error && <span className="text-xs text-red-500">{error}</span>}
      <DaumPostcodeModal open={open} onOpenChange={setOpen} onComplete={onComplete} height={450} />
    </div>
  );
}


