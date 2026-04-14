import { Navigate } from 'react-router';
import useAuthStore from '@/store/authStore';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect users to their specific unified dashboards
  switch (user.role) {
    case 'Admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'Manager':
      return <Navigate to="/dashboard/manager" replace />;
    case 'Cashier':
      return <Navigate to="/dashboard/cashier" replace />;
    case 'Customer':
      return <Navigate to="/profile" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default DashboardPage;
