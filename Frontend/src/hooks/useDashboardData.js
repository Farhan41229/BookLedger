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
    // Fetch each piece of data independently so one failure doesn't kill the whole dashboard
    let totalUsers = 'N/A';
    let totalRevenue = 'N/A';
    let auditTotal = 'N/A';
    let recentActivity = [];

    try {
      const usersRes = await API.get('/users?limit=1');
      totalUsers = usersRes.data.pagination?.total ?? 'N/A';
    } catch (err) {
      console.warn("Could not fetch user count:", err.response?.data?.message || err.message);
    }

    try {
      const auditRes = await API.get('/admin/audit?limit=5');
      auditTotal = auditRes.data.pagination?.total ?? 'N/A';
      recentActivity = (auditRes.data.logs || []).map(log => ({
        id: log._id.substring(0, 8),
        user: log.performedBy?.name || 'Unknown',
        status: log.action,
        amount: log.targetCollection,
        date: new Date(log.timestamp).toLocaleDateString()
      }));
    } catch (err) {
      console.warn("Could not fetch audit logs:", err.response?.data?.message || err.message);
    }

    try {
      const salesRes = await API.get('/sales/reports/summary');
      const rev = salesRes.data.report?.summary?.totalRevenue;
      totalRevenue = rev !== undefined ? `$${Number(rev).toLocaleString()}` : 'N/A';
    } catch (err) {
      console.warn("Could not fetch sales summary:", err.response?.data?.message || err.message);
    }

    return {
      stats: [
        { title: "Total Users", value: totalUsers, icon: Users, trend: "neutral" },
        { title: "Total Revenue", value: totalRevenue, icon: DollarSign, trend: "up" },
        { title: "System Health", value: "98%", icon: Activity, trend: "up" },
        { title: "Audit Events", value: auditTotal, icon: FileText, trend: "neutral" },
      ],
      chartData: revenueData,
      recentActivity,
    };
  }, []);

  const fetchManagerData = useCallback(async () => {
    let totalRevenue = 'N/A';
    let totalTransactions = 'N/A';
    let totalBooks = 'N/A';
    let belowReorderBooks = 'N/A';
    let totalInventoryValue = 'N/A';

    try {
      const invRes = await API.get('/inventory/status');
      totalBooks = invRes.data.inventory.totalBooks;
      belowReorderBooks = invRes.data.inventory.belowReorderBooks;
      totalInventoryValue = invRes.data.inventory.totalInventoryValue;
    } catch (err) {
      console.warn("Could not fetch inventory status:", err.response?.data?.message || err.message);
    }

    try {
      const salesRes = await API.get('/sales/reports/summary');
      const summary = salesRes.data.report?.summary;
      if (summary) {
        totalRevenue = `$${Number(summary.totalRevenue).toLocaleString()}`;
        totalTransactions = summary.totalTransactions;
      }
    } catch (err) {
      console.warn("Could not fetch sales summary:", err.response?.data?.message || err.message);
    }

    return {
      stats: [
        { title: "Monthly Revenue", value: totalRevenue, icon: DollarSign, trend: "up" },
        { title: "Low Stock Items", value: belowReorderBooks, icon: AlertTriangle, trend: belowReorderBooks > 0 ? "down" : "neutral" },
        { title: "Books Sold", value: totalTransactions, icon: ShoppingCart, trend: "up" },
        { title: "Inventory Value", value: typeof totalInventoryValue === 'number' ? `$${totalInventoryValue.toLocaleString()}` : totalInventoryValue, icon: Package, trend: "neutral" },
      ],
      chartData: revenueData,
      recentActivity: [],
      lowStock: []
    };
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