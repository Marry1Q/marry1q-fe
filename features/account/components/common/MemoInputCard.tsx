import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface MemoInputCardProps {
  memo: string;
  onMemoChange: (value: string) => void;
  placeholder?: string;
}

export function MemoInputCard({
  memo,
  onMemoChange,
  placeholder = "메모를 입력하세요",
}: MemoInputCardProps) {
  return (
    <Card>
      <CardHeader>
        {/* <CardTitle>메모 (선택사항)</CardTitle> */}
        <h1 className="text-3xl" style={{ fontFamily: "Hana2-CM" }}>
          메모 (선택사항)
        </h1>
      </CardHeader>
      <CardContent>
        <Textarea
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      </CardContent>
    </Card>
  );
}
