import useAuthStore from "@/store/authStore";
import AdminDashboard from "./AdminDashboard";
// Placeholder imports for future phases
// import ManagerDashboard from "./ManagerDashboard"; 
// import CashierDashboard from "./CashierDashboard"; 

export default function DashboardMain() {
  const { user } = useAuthStore();
  const role = user?.role;

  // Role Switcher
  if (role === 'Admin') return <AdminDashboard />;
  if (role === 'Manager') return <div className="p-8">Manager Dashboard (Implementation Pending)</div>;
  if (role === 'Cashier') return <div className="p-8">Cashier Dashboard (Implementation Pending)</div>;

  return <div className="p-8">Unauthorized Role</div>;
}