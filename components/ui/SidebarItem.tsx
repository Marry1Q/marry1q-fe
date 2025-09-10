import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { colors } from "@/constants/colors";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarItem({
  icon: Icon,
  label,
  href,
  isActive,
  onClick,
}: SidebarItemProps) {
  const classNames = `
    flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
    ${
      isActive
        ? "text-white"
        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    }
  `;

  const style = {
    backgroundColor: isActive ? colors.primary.main : undefined,
  };

  const content = (
    <div className={classNames} style={style}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <a onClick={onClick}>{content}</a>
      </Link>
    );
  }

  return <div onClick={onClick}>{content}</div>;
}
