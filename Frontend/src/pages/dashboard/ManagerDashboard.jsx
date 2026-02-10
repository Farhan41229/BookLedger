import { useState, useEffect } from "react";
import { Package, TrendingUp, AlertCircle, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { managerDashboardData } from "@/data/dashboardData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function ManagerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => setData(managerDashboardData), 500);
  }, []);

  if (!data) return <div className="p-10 text-center text-muted-foreground">Loading...</div>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`$${data.stats.revenue.value}`} change={data.stats.revenue.change} trend={data.stats.revenue.trend} icon={DollarSign} />
        <StatCard title="Weekly Sales" value={`$${data.stats.weeklySales.value}`} change={data.stats.weeklySales.change} trend={data.stats.weeklySales.trend} icon={TrendingUp} />
        <StatCard title="Total Inventory" value={data.stats.inventoryCount.value} change={data.stats.inventoryCount.change} trend={data.stats.inventoryCount.trend} icon={Package} />
        <StatCard title="Low Stock Alerts" value={data.stats.lowStock.value} change={data.stats.lowStock.change} trend={data.stats.lowStock.trend} icon={AlertCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales By Category */}
        <Card>
          <CardHeader><CardTitle>Sales by Category</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.salesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground mt-4">
              {data.salesByCategory.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  {item.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dead Stock Watchlist */}
        <Card>
          <CardHeader><CardTitle>Dead Stock Watchlist (90+ Days)</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.deadStock.map((item, i) => (
                <div key={i} className="flex items-center justify-between border-l-4 border-destructive bg-destructive/5 p-3 rounded-r-md">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.days} days unsold</p>
                  </div>
                  <span className="font-bold text-sm">{item.stock} units</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}