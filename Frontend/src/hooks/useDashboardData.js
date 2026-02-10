import { useState, useEffect, useCallback } from 'react';
import API from '@/lib/axios';
import { adminStats, managerStats, cashierStats, revenueData, recentSales } from '@/lib/dummyData';
import { Users, AlertTriangle, DollarSign, Package, ShoppingCart, Activity, FileText } from 'lucide-react';

export const useDashboardData = (role) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toggle this to false to switch to REAL backend data
  const USE_MOCK = false; 

  const fetchAdminData = useCallback(async () => {
    try {
      // 1. Fetch Users Count
      const usersRes = await API.get('/users?limit=1');
      const totalUsers = usersRes.data.pagination.total;

      // 2. Fetch Audit Logs
      const auditRes = await API.get('/admin/audit?limit=5');
      
      // 3. Fetch Sales Summary (for Revenue)
      // Note: We use a wide date range to get total revenue
      const salesRes = await API.get('/sales/reports/summary');

      return {
        stats: [
          { title: "Total Users", value: totalUsers, icon: Users, trend: "neutral" },
          { title: "Total Revenue", value: `$${salesRes.data.report.summary.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: "up" },
          { title: "System Health", value: "98%", icon: Activity, trend: "up" }, // Hardcoded for now
          { title: "Audit Events", value: auditRes.data.pagination.total, icon: FileText, trend: "neutral" },
        ],
        chartData: revenueData, // Keep dummy chart until backend supports monthly aggregation
        recentActivity: auditRes.data.logs.map(log => ({
          id: log._id.substring(0, 8),
          user: log.performedBy?.name || 'Unknown',
          status: log.action,
          amount: log.targetCollection,
          date: new Date(log.timestamp).toLocaleDateString()
        }))
      };
    } catch (err) {
      console.error("Admin Fetch Error:", err);
      throw err;
    }
  }, []);

  const fetchManagerData = useCallback(async () => {
    try {
      // 1. Inventory Status
      const invRes = await API.get('/inventory/status');
      const { totalBooks, belowReorderBooks, totalInventoryValue } = invRes.data.inventory;

      // 2. Sales Report
      const salesRes = await API.get('/sales/reports/summary');
      const { totalRevenue, totalTransactions } = salesRes.data.report.summary;

      return {
        stats: [
          { title: "Monthly Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: "up" },
          { title: "Low Stock Items", value: belowReorderBooks, icon: AlertTriangle, trend: belowReorderBooks > 0 ? "down" : "neutral" },
          { title: "Books Sold", value: totalTransactions, icon: ShoppingCart, trend: "up" },
          { title: "Inventory Value", value: `$${totalInventoryValue.toLocaleString()}`, icon: Package, trend: "neutral" },
        ],
        chartData: revenueData, // Backend needs an endpoint for time-series data
        recentActivity: [], // Manager specific recent activity if needed
        lowStock: [] // Could fetch from /inventory/low-stock
      };
    } catch (err) {
      console.error("Manager Fetch Error:", err);
      throw err;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (USE_MOCK) {
          // Simulate network delay
          await new Promise(r => setTimeout(r, 800));
          if (role === 'Admin') setData({ stats: adminStats, chartData: revenueData, recentActivity: recentSales });
          else if (role === 'Manager') setData({ stats: managerStats, chartData: revenueData, recentActivity: [] });
          else setData({ stats: cashierStats, chartData: [], recentActivity: recentSales });
        } else {
          // Real API Calls
          let result;
          if (role === 'Admin') result = await fetchAdminData();
          else if (role === 'Manager') result = await fetchManagerData();
          else {
            // Cashier fallback (API doesn't have specific "my stats" endpoint yet)
            result = { stats: cashierStats, chartData: [], recentActivity: recentSales }; 
          }
          setData(result);
        }
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, fetchAdminData, fetchManagerData]);

  return { data, loading, error };
};