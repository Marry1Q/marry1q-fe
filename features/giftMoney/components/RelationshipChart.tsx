import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { colors } from "@/constants/colors";
import { useState } from "react";

interface RelationshipChartProps {
  data: Array<{ name: string; amount: number; count?: number }>;
}

const COLORS_LIGHT = [
  colors.hana.mint.light,
  colors.hana.blue.light,
  colors.hana.yellow.light,
  colors.hana.red.light,
  colors.hana.purple.light,
  colors.hana.brown.light,
  colors.hana.green.light,
];

const COLORS_DARK = [
  colors.hana.mint.main,
  colors.hana.blue.main,
  colors.hana.yellow.main,
  colors.hana.red.main,
  colors.hana.purple.main,
  colors.hana.brown.main,
  colors.hana.green.main,
];

export function RelationshipChart({ data }: RelationshipChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const totalCount = data.reduce((sum, item) => sum + (item.count || 0), 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0]?.payload;
      if (!data) return null;
      
      const percentage = (((data.count || 0) / totalCount) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.count || 0}명 ({percentage}%)
          </p>
          <p className="text-xs text-gray-500">
            총 {data.amount.toLocaleString()}원
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    if (!payload || payload.length === 0) return null;

    return (
      <div className="flex flex-col gap-2 mt-4">
        {payload.map((entry: any, index: number) => {
          const data = entry.payload;
          const percentage = (((data.count || 0) / totalCount) * 100).toFixed(0);
          const isHovered = hoveredIndex === index;
          
          return (
            <div 
              key={index} 
              className="flex items-center gap-3 cursor-pointer transition-colors"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div 
                className="w-3 h-3 rounded-full transition-colors"
                style={{ 
                  backgroundColor: isHovered ? COLORS_DARK[index % COLORS_DARK.length] : entry.color 
                }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium transition-colors ${
                    isHovered ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {data.name} {percentage}%
                  </span>
                  <span className="text-sm text-gray-600">
                    {data.count || 0}명 · {data.amount.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: "Hana2-CM" }}>
          관계별 인원 분포
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data.map(item => ({ ...item, count: item.count || 0 }))}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={data.length > 1 ? 2 : 0}
              startAngle={90}
              endAngle={data.length > 1 ? -270 : 450}
              dataKey="count"
              onMouseEnter={(data, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={hoveredIndex === index ? COLORS_DARK[index % COLORS_DARK.length] : COLORS_LIGHT[index % COLORS_LIGHT.length]}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 