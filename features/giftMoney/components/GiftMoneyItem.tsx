import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { colors } from "@/constants/colors";
import Image from "next/image";
import { GiftMoney } from "../types";

interface GiftMoneyItemProps {
  gift: GiftMoney;
  onToggleThanks?: (id: number, currentThanksSent: boolean) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  isLast?: boolean;
}

export function GiftMoneyItem({ gift, onToggleThanks, onEdit, onDelete, isLast = false }: GiftMoneyItemProps) {
  return (
    <Link href={`/gift-money/edit/${gift.id}`}>
      <div className={`p-4 hover:bg-gray-50 transition-colors ${!isLast ? 'border-b border-gray-200' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleThanks?.(gift.id, gift.thanksSent);
              }}
              className="p-0 border-0 bg-transparent cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Image
                src={gift.thanksSent ? "/hana3dIcon/hanaIcon3d_5_35.png" : "/hana3dIcon/hanaIcon3d_4_125.png"}
                alt="Gift Icon"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </button>
            <div>
              <p className="font-medium" style={{fontFamily: 'Hana2-CM'}}>{gift.name}님</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{gift.relationshipDisplayName}</span>
                <span>•</span>
                <span>{gift.giftDate}</span>
              </div>
              {gift.memo && <p className="text-sm text-gray-600 mt-1">메모: {gift.memo}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold" style={{color: colors.hana.blue.main, fontFamily: 'Hana2-Bold'}}>
              {gift.amount.toLocaleString()}원
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete?.(gift.id);
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Link>
  );
} 