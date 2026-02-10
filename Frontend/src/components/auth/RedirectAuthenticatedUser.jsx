import { Navigate } from "react-router";
import useAuthStore from "@/store/authStore";

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// 👇 THIS LINE IS CRITICAL
export default RedirectAuthenticatedUser;