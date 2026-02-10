import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';

export const ProtectedRoute = ({ children }) => {
  const { token, user, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      checkAuth();
    }
  }, [token, user, checkAuth]);

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isCheckingAuth || (!user && token)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};
