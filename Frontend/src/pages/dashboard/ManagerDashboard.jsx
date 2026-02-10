import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { useDashboardData } from "@/hooks/useDashboardData"; // Import hook
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ManagerDashboard = () => {
  const { data, loading } = useDashboardData('Manager');

  return (
    <div className="space-y-6 fade-in">
      <h2 className="text-3xl font-bold tracking-tight">Store Performance</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading 
          ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
          : data?.stats.map((stat, i) => <StatCard key={i} {...stat} />)
        }
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
         <div className="lg:col-span-2">
            {loading 
              ? <Skeleton className="h-[350px] rounded-xl" />
              : <RevenueChart data={data?.chartData} />
            }
         </div>
         
         {/* Low Stock (Static for now, can be connected to /inventory/low-stock later) */}
         <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Low Stock Alerts
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Placeholder Logic */}
                    {[
                        { title: "The Great Gatsby", stock: 2 },
                        { title: "1984", stock: 5 },
                        { title: "Clean Code", stock: 1 }
                    ].map((book, i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                            <div>
                                <p className="font-medium">{book.title}</p>
                                <p className="text-xs text-muted-foreground">ISBN: 978-0-123...{i}</p>
                            </div>
                            <div className="text-sm font-bold text-amber-600">
                                {book.stock} left
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;