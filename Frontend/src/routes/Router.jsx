import React from "react";
import { createBrowserRouter } from "react-router";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardMain from "@/pages/dashboard/DashboardMain";
import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import Landing from "@/pages/Landing";
import AboutPage from "@/pages/AboutPage";
import AuthLayout from "@/layouts/AuthLayout";
import LoginPage from "@/pages/LoginPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import DashboardPage from "@/pages/DashboardPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "about", element: <AboutPage /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    path: "/dashboard",
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
      // Future routes to be added here in next phases:
      // { path: "books", element: <BooksPage /> },
      // { path: "sales", element: <SalesPage /> },
      // etc.
    ],
  },
]);

export default router;
