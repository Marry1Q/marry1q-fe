import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { colors } from "@/constants/colors";

interface TrendChartProps {
  data: Array<{ date: string; amount: number; count: number }>;
}

export function TrendChart({ data }: TrendChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length >= 2) {
      const amountValue = payload[0]?.value || 0;
      const countValue = payload[1]?.value || 0;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-600">
            총액: {amountValue.toLocaleString()}원
          </p>
          <p className="text-sm text-gray-600">
            건수: {countValue}건
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.hana.green.main }}
          />
          시간별 축의금 추이
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.hana.green.main} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.hana.green.main} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 10000).toFixed(0)}만원`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}건`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke={colors.hana.green.main}
              strokeWidth={3}
              fill="url(#areaGradient)"
              yAxisId="left"
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={colors.hana.red.main}
              strokeWidth={2}
              yAxisId="right"
              dot={{ fill: colors.hana.red.main, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors.hana.red.main, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 