import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddButtonProps {
  href: string;
  label: string;
}

export function AddButton({ href, label }: AddButtonProps) {
  return (
    <Link href={href}>
      <Button className="bg-[#008485] hover:bg-[#e05274] text-white flex items-center px-4 py-2 rounded transition-colors duration-300">
        <Plus className="w-4 h-4 mr-2" />
        {label}
      </Button>
    </Link>
  );
} 