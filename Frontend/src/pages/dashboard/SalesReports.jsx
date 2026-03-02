import { useState, useEffect, useMemo } from "react";
import API from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, CreditCard, TrendingUp, Download, Calendar } from "lucide-react";
import RevenueChart from "@/components/dashboard/RevenueChart";
import toast from "react-hot-toast";

const SalesReports = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      // Fetch all sales (Managers/Admins have access)
      const res = await API.get("/sales?limit=100"); 
      setSales(res.data.sales || []);
    } catch (error) {
      toast.error("Failed to load sales data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Metrics
  const metrics = useMemo(() => {
    const totalRevenue = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalTxns = sales.length;
    const avgOrderValue = totalTxns > 0 ? totalRevenue / totalTxns : 0;

    // Group by Date for Chart
    const salesByDate = sales.reduce((acc, curr) => {
      const date = new Date(curr.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + curr.totalAmount;
      return acc;
    }, {});

    // Format for Recharts
    const chartData = Object.entries(salesByDate)
      .map(([name, total]) => ({ name, total }))
      .slice(-7); // Last 7 active days

    return { totalRevenue, totalTxns, avgOrderValue, chartData };
  }, [sales]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in p-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Reports</h2>
          <p className="text-muted-foreground">Overview of store performance and revenue.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTxns}</div>
            <p className="text-xs text-muted-foreground">+12 since yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Based on recent sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <RevenueChart data={metrics.chartData} />
        </div>
        <Card className="lg:col-span-1">
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    Recent Activity
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-4">
                    {sales.slice(0, 5).map((sale, i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                            <div>
                                <p className="font-medium text-sm">Sale #{sale._id.slice(-6).toUpperCase()}</p>
                                <p className="text-xs text-muted-foreground">{new Date(sale.createdAt).toLocaleTimeString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm text-emerald-600">+${sale.totalAmount.toFixed(2)}</p>
                                <p className="text-[10px] text-muted-foreground">{sale.items.length} items</p>
                            </div>
                        </div>
                    ))}
                </div>
             </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Cashier</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No sales records found.
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell className="font-mono text-xs font-medium">
                    {sale._id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    {new Date(sale.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {sale.cashierId?.name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {sale.items.length} items
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${sale.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Completed
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SalesReports;