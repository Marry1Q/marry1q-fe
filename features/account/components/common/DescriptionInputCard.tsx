import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface DescriptionInputCardProps {
  title: string;
  description: string;
  onDescriptionChange: (value: string) => void;
  placeholder?: string;
}

export function DescriptionInputCard({
  title,
  description,
  onDescriptionChange,
  placeholder = "한글 최대 20자까지 입력 가능합니다",
}: DescriptionInputCardProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 한글 최대 20자 제한
    if (value.length <= 20) {
      onDescriptionChange(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h1 className="text-3xl" style={{ fontFamily: "Hana2-CM" }}>
          {title}
        </h1>
      </CardHeader>
      <CardContent>
        <Input
          value={description}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={20}
          className="text-lg"
          style={{ fontFamily: "Hana2-Medium" }}
        />
        <div className="text-sm text-gray-500 mt-2 text-right">
          {description.length}/20자
        </div>
      </CardContent>
    </Card>
  );
}
