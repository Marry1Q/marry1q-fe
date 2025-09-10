import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils";

interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: keyof typeof colors.hana;
  className?: string;
}

export function StatisticsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "mint",
  className
}: StatisticsCardProps) {
  const colorObj = colors.hana[color];

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div 
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: colorObj.main }}
      />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          {icon && (
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${colorObj.main}20` }}
            >
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span 
              className="text-2xl font-bold"
              style={{ color: colorObj.main }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {trend && (
              <span className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 