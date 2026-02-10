import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RecentSalesTable from "@/components/dashboard/RecentSalesTable";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const AdminDashboard = () => {
  const { data, loading, error } = useDashboardData('Admin');

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
          : data?.stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))
        }
      </div>

      {/* Charts & Logs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {loading ? (
           <Skeleton className="col-span-4 h-[400px] rounded-xl" />
        ) : (
           <RevenueChart data={data?.chartData} />
        )}
        
        <div className="col-span-4 lg:col-span-3">
           {/* We reuse the table but pass in audit logs mapped to the same structure */}
           {/* Note: In a real app, create a dedicated AuditTable component */}
           {!loading && <RecentSalesTable title="Recent Activity" limit={5} />} 
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;