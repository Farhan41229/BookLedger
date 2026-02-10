import { useState, useEffect, useMemo } from "react";
import API from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { Loader2, DollarSign, ShoppingCart, TrendingUp, Calendar } from "lucide-react";
import useAuthStore from "@/store/authStore";

const CashierStats = () => {
  const { user } = useAuthStore();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Attempt to fetch sales. 
        // Note: If the backend restricts this, we might need a specific /sales/me endpoint later.
        const res = await API.get("/sales");
        
        // Filter sales for the current logged-in cashier just in case
        const mySales = (res.data.sales || []).filter(sale => 
            sale.cashierId?._id === user?.id || sale.cashierId === user?.id
        );
        
        setSales(mySales);
      } catch (error) {
        console.error("Failed to load performance stats", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchStats();
  }, [user]);

  // Calculate Metrics on the fly
  const metrics = useMemo(() => {
    const totalRevenue = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalTxns = sales.length;
    const avgTicket = totalTxns > 0 ? totalRevenue / totalTxns : 0;

    // Group sales by date for the chart
    const salesByDate = sales.reduce((acc, curr) => {
      const date = new Date(curr.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + curr.totalAmount;
      return acc;
    }, {});

    // Convert to array format for Recharts
    const chartData = Object.entries(salesByDate)
      .map(([name, total]) => ({ name, total }))
      .slice(-7); // Last 7 days

    return { totalRevenue, totalTxns, avgTicket, chartData };
  }, [sales]);

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="space-y-6 fade-in p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Performance</h2>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Lifetime Overview</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard 
            title="Total Revenue Generated" 
            value={`$${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            trend="neutral"
            change="Lifetime"
        />
        <StatCard 
            title="Total Transactions" 
            value={metrics.totalTxns} 
            icon={ShoppingCart}
            trend="neutral"
            change="Completed sales"
        />
        <StatCard 
            title="Average Ticket Size" 
            value={`$${metrics.avgTicket.toFixed(2)}`} 
            icon={TrendingUp}
            trend="neutral"
            change="Per transaction"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-1">
        <RevenueChart data={metrics.chartData} />
      </div>
    </div>
  );
};

export default CashierStats;