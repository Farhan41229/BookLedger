import useAuthStore from "@/store/authStore";
import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard"; 
import CashierDashboard from "./CashierDashboard"; 

export default function DashboardMain() {
  const { user } = useAuthStore();
  const role = user?.role;

  // Render based on Role
  if (role === 'Admin') return <AdminDashboard />;
  if (role === 'Manager') return <ManagerDashboard />;
  if (role === 'Cashier') return <CashierDashboard />;

  // Fallback
  return (
    <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
      Unauthorized: No valid role assigned.
    </div>
  );
}