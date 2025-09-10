import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InvitationFiltersProps {
  searchTerm: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function InvitationFilters({ 
  searchTerm, 
  sortBy, 
  onSearchChange, 
  onSortChange 
}: InvitationFiltersProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="청첩장 제목으로 검색..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">최근 수정순</SelectItem>
          <SelectItem value="title">제목순</SelectItem>
          <SelectItem value="created">생성일순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 