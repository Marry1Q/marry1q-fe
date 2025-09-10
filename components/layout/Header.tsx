import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { showConfirmDialog } from "@/components/ui/CustomAlert";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { logout } = useAuth();

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
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-4 py-2 h-16">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <img src="/Marry1Q_logo.png" alt="Marry1Q" className="w-8 ml-1" />
        <h1
          className="text-2xl font-bold text-gray-800 ml-1"
          style={{ fontFamily: "Hana2-CM" }}
        >
          Marry1Q
        </h1>
      </Link>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="shadow-none rounded-lg w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="로그아웃"
        >
          <LogOut className="w-6 h-6 text-gray-800 rounded-none" strokeWidth={2.5} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="shadow-none rounded-lg w-8 h-8 flex items-center justify-center"
        >
          <Menu className="w-6 h-6 text-gray-800 rounded-none" strokeWidth={2.5} />
        </Button>
      </div>
    </header>
  );
}
