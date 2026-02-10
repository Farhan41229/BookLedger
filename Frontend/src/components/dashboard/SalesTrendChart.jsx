import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const SalesTrendChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="hsl(var(--muted-foreground))" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          dy={10}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
          itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};