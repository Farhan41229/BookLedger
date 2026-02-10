import { useState, useEffect } from "react";
import { ShoppingCart, DollarSign, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesTrendChart } from "@/components/dashboard/SalesTrendChart";
import { adminDashboardData } from "@/data/dashboardData";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setData(adminDashboardData);
    }, 500);
  }, []);

  if (!data)
    return (
      <div className="p-10 text-center text-muted-foreground">
        Loading dashboard...
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sales Today"
          value={data.stats.todaySales.value}
          change={data.stats.todaySales.change}
          trend={data.stats.todaySales.trend}
          icon={ShoppingCart}
        />
        <StatCard
          title="Revenue Today"
          value={`$${data.stats.todayRevenue.value.toLocaleString()}`}
          change={data.stats.todayRevenue.change}
          trend={data.stats.todayRevenue.trend}
          icon={DollarSign}
        />
        <StatCard
          title="Books Sold Today"
          value={data.stats.booksSold.value}
          change={data.stats.booksSold.change}
          trend={data.stats.booksSold.trend}
          icon={BookOpen}
        />
        <StatCard
          title="Active Customers"
          value={data.stats.activeCustomers.value}
          change={data.stats.activeCustomers.change}
          trend={data.stats.activeCustomers.trend}
          icon={Users}
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesTrendChart data={data.salesTrend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topBooks.map((book, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{book.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {book.sales} sold
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-sm">
                    ${book.revenue.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-sm">Sale #{tx.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.cashier} • {tx.time}
                    </p>
                  </div>
                  <span className="font-bold text-sm">
                    ${tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Quick View */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-destructive">
                  {data.inventoryAlerts.outOfStock}
                </div>
                <div className="text-xs text-muted-foreground uppercase font-bold">
                  Out of Stock
                </div>
              </div>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {data.inventoryAlerts.lowStock}
                </div>
                <div className="text-xs text-muted-foreground uppercase font-bold">
                  Low Stock
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
