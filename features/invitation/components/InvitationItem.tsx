import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Edit, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { colors } from "@/constants/colors";
import { Invitation } from "@/features/invitation/types";

interface InvitationItemProps {
  invitation: Invitation;
  onSetPrimary?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function InvitationItem({ invitation, onSetPrimary, onDelete }: InvitationItemProps) {
  return (
    <div className={`p-4 hover:bg-gray-50 transition-colors ${invitation.isPrimary ? 'border-l-4' : ''}`} style={invitation.isPrimary ? { 
      backgroundColor: '#fef2f2', 
      borderLeftColor: colors.hana.red.main 
    } : {}}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src="/hana3dIcon/hanaIcon3d_6_33.png" 
              alt="하나 아이콘" 
              className="w-8 h-8"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className={`font-medium ${invitation.isPrimary ? 'text-gray-900' : ''}`}>{invitation.title}</p>
            </div>
           </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSetPrimary?.(invitation.id)}
            className={invitation.isPrimary ? "!text-transparent" : "text-gray-400"}
            style={invitation.isPrimary ? { color: colors.hana.red.main } : {}}
            title="대표 청첩장으로 설정"
          >
            <Star 
              className={`w-4 h-4 ${invitation.isPrimary ? "fill-current" : ""}`}
              style={invitation.isPrimary ? { color: colors.hana.red.main } : {}}
            />
          </Button>
          
          <Link href={`/invitation/edit/${invitation.id}`}>
            <Button variant="ghost" size="sm" title="편집">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(invitation.id)}
            disabled={invitation.isPrimary}
            title={invitation.isPrimary ? "대표 청첩장은 삭제할 수 없습니다" : "삭제"}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 