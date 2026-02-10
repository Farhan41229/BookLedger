import { useEffect } from "react";
import { Outlet } from "react-router"; 
import useAuthStore from "@/store/authStore";
import { Toaster } from "@/components/ui/toaster"; // Ensure you have your toaster here

const RootLayout = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        {/* Simple Loading Spinner */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
};

export default RootLayout;