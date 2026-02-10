import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ShoppingCart, DollarSign, Search, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { cashierDashboardData } from "@/data/dashboardData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function CashierDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => setData(cashierDashboardData), 500);
  }, []);

  if (!data) return <div className="p-10 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Button asChild size="lg" className="h-24 text-lg bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 border">
            <Link to="/dashboard/new-sale">
               <ShoppingCart className="mr-2 h-8 w-8" /> New Sale (POS)
            </Link>
         </Button>
         <Button asChild size="lg" variant="outline" className="h-24 text-lg">
            <Link to="/dashboard/books">
               <Search className="mr-2 h-8 w-8" /> Lookup Book
            </Link>
         </Button>
         <Button asChild size="lg" variant="outline" className="h-24 text-lg">
            <Link to="/dashboard/customers">
               <UserPlus className="mr-2 h-8 w-8" /> Add Customer
            </Link>
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="My Sales Today" value={data.stats.mySales.value} change={data.stats.mySales.change} trend={data.stats.mySales.trend} icon={ShoppingCart} />
        <StatCard title="My Revenue" value={`$${data.stats.myRevenue.value}`} change={data.stats.myRevenue.change} trend={data.stats.myRevenue.trend} icon={DollarSign} />
        <StatCard title="Avg. Sale Value" value={`$${data.stats.avgSale.value}`} change={data.stats.avgSale.change} trend={data.stats.avgSale.trend} icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hourly Performance */}
        <Card>
          <CardHeader><CardTitle>My Hourly Performance</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data.hourlyPerformance}>
                 <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                 <Tooltip cursor={{fill: 'transparent'}} />
                 <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Sales List */}
        <Card>
          <CardHeader><CardTitle>My Recent Transactions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                       <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Sale #{sale.id}</p>
                      <p className="text-xs text-muted-foreground">{sale.items} items • {sale.time}</p>
                    </div>
                  </div>
                  <div className="font-bold text-right">
                     ${sale.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}