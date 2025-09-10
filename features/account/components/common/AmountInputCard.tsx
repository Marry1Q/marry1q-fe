import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AmountInputCardProps {
  title: string;
  amount: string;
  onAmountChange: (value: string) => void;
  maxAmount?: number;
  quickAmounts?: number[];
}

export function AmountInputCard({
  title,
  amount,
  onAmountChange,
  maxAmount,
  quickAmounts = [100000, 500000, 1000000],
}: AmountInputCardProps) {
  const formatAmount = (value: string) => {
    const number = value.replace(/[^\d]/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value);
    onAmountChange(formatted);
  };

  return (
    <Card>
      <CardHeader>
        {/* <CardTitle style={{ fontFamily: "Hana2-Regular" }}>{title}</CardTitle> */}
        <h1 className="text-3xl" style={{ fontFamily: "Hana2-CM" }}>
          {title}
        </h1>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
            className="text-2xl font-bold text-right pr-8"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            원
          </span>
        </div>
        <div className="flex justify-between gap-2 mt-3">
          <p className="text-sm text-gray-500 mt-2">
            {maxAmount && `최대 가능 ${maxAmount.toLocaleString()}원`}
          </p>
          {maxAmount && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAmountChange(maxAmount.toLocaleString())}
            >
              전액
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
