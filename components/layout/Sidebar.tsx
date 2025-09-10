"use client";

import { Heart, TrendingUp, Users, Gift, Target, X, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarItem } from "../ui/SidebarItem";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { showConfirmDialog } from "@/components/ui/CustomAlert";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    const result = await showConfirmDialog({
      title: "로그아웃",
      text: "정말 로그아웃하시겠습니까?",
      confirmButtonText: "로그아웃",
      cancelButtonText: "취소",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      await logout();
      onClose(); // 사이드바 닫기
    }
  };

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      )}

      {/* 사이드바 */}
      <div
        className={`fixed right-0 top-0 h-full w-64 bg-white border-l border-gray-200 p-6 z-50 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 닫기 버튼 (사이드바 내부 좌측 상단) */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 left-4 bg-white shadow-none border-gray-200 w-10 h-10 flex items-center justify-center"
        >
          <X className="w-6 h-6 text-gray-700 rounded-none" />
        </Button>

        {/* 네비게이션 */}
        <nav className="space-y-1 mt-10" style={{ fontFamily: "Hana2-CM" }}>
          <div className="flex items-center gap-1 mb-10 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/Marry1Q_logo.png" alt="Marry1Q" className="w-10" />
            </div>
            <h1
              className="text-2xl text-gray-800 ml-3"
              style={{ fontFamily: "Hana2-Medium" }}
            >
              {user?.customerName || '사용자'}님, <br />
              안녕하세요!
            </h1>
          </div>

          <SidebarItem
            icon={TrendingUp}
            label="가계부"
            href="/"
            isActive={pathname === "/"}
          />
          <SidebarItem
            icon={Users}
            label="모임통장"
            href="/account"
            isActive={pathname === "/account"}
          />
          <SidebarItem
            icon={Target}
            label="Plan1Q"
            href="/plan1q"
            isActive={pathname === "/plan1q"}
          />
          <SidebarItem
            icon={Gift}
            label="축의금 관리"
            href="/gift-money"
            isActive={pathname === "/gift-money"}
          />
          <SidebarItem
            icon={Heart}
            label="모바일 청첩장"
            href="/invitation"
            isActive={pathname === "/invitation"}
          />
        </nav>

        {/* 로그아웃 버튼 */}
        <div className="absolute bottom-6 left-6 right-6">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-gray-700 hover:text-red-600 hover:border-red-300 transition-colors"
            style={{ fontFamily: "Hana2-CM" }}
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </Button>
        </div>
      </div>
    </>
  );
}
