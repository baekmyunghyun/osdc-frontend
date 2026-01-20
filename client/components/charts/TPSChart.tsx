import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  time: string;
  value: number;
}

interface TPSChartProps {
  data: ChartData[];
}

export default function TPSChart({ data }: TPSChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="time" 
          tick={{ fontSize: 12 }} 
          interval="preserveStartEnd"
          minTickGap={30}
        />
        <YAxis 
          domain={[(dataMin: number) => Math.floor(dataMin * 0.99), 'auto']} 
          tick={{ fontSize: 12 }} 
        />
        <Tooltip 
          contentStyle={{ backgroundColor: "#fff", borderColor: "#ccc" }}
          itemStyle={{ color: "#8884d8" }}
          cursor={{ fill: 'transparent' }}
        />
        <Bar
          dataKey="value"
          fill="#8884d8"
          radius={[4, 4, 0, 0]}
          isAnimationActive={false}
          barSize={10}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
