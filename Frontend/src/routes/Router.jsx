import { createBrowserRouter } from "react-router";

// Layouts
import RootLayout from "@/layouts/RootLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import PublicLayout from "@/layouts/PublicLayout";
// Pages
import Landing from "@/pages/Landing";
import LoginPage from "@/pages/LoginPage";
// import SignupPage from "@/pages/auth/SignupPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

// Dashboard Pages
import DashboardMain from "@/pages/dashboard/DashboardMain";

// Protection
import ProtectedRoute from "@/components/auth/ProtectedRoute"; // Ensure this path is correct for your project
import RedirectAuthenticatedUser from "@/components/auth/RedirectAuthenticatedUser"; // Ensure this path is correct

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <Landing /> },
        ],
      },
      { index: true, element: <Landing /> },

      // Auth Routes
      {
        path: "login",
        element: (
          <RedirectAuthenticatedUser>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </RedirectAuthenticatedUser>
        ),
      },
      // {
      //   path: "signup",
      //   element: (
      //     <RedirectAuthenticatedUser>
      //       <AuthLayout>
      //         <LoginPage />
      //       </AuthLayout>
      //     </RedirectAuthenticatedUser>
      //   ),
      // },
      {
        path: "verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "forgot-password",
        element: (
          <RedirectAuthenticatedUser>
            <AuthLayout>
              <ForgotPasswordPage />
            </AuthLayout>
          </RedirectAuthenticatedUser>
        ),
      },
      {
        path: "reset-password/:token",
        element: (
          <RedirectAuthenticatedUser>
            <AuthLayout>
              <ResetPasswordPage />
            </AuthLayout>
          </RedirectAuthenticatedUser>
        ),
      },

      // Dashboard Routes (New Implementation)
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardMain />,
          },
          // Future routes (Books, Sales, etc.) will go here
        ],
      },
    ],
  },
]);

export default router;
