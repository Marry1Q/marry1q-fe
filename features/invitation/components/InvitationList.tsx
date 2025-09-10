import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { InvitationItem } from "./InvitationItem";
import { Invitation } from "@/features/invitation/types";

interface InvitationListProps {
  invitations: Invitation[];
  onSetPrimary?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function InvitationList({ invitations, onSetPrimary, onDelete }: InvitationListProps) {
  return (
    <div className="space-y-6">
      {/* Invitation List */}
      {invitations.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {invitations.map((invitation) => (
                <InvitationItem
                  key={invitation.id}
                  invitation={invitation}
                  onSetPrimary={onSetPrimary}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">
              다른 검색어나 필터를 사용해보세요.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 