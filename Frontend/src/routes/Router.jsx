// import React from "react";
// import { createBrowserRouter } from "react-router";
// import RootLayout from "@/layouts/RootLayout";
// import Landing from "@/pages/Landing";
// import AboutPage from "@/pages/AboutPage";
// import AuthLayout from "@/layouts/AuthLayout";
// import LoginPage from "@/pages/LoginPage";
// import VerifyEmailPage from "@/pages/VerifyEmailPage";
// import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
// import ResetPasswordPage from "@/pages/ResetPasswordPage";
// import DashboardPage from "@/pages/DashboardPage";
// import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// import DashboardLayout from '@/layouts/DashboardLayout';
// import AdminDashboard from '@/pages/dashboard/AdminDashboard';
// import ManagerDashboard from '@/pages/dashboard/ManagerDashboard';
// import CashierDashboard from '@/pages/dashboard/CashierDashboard';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootLayout />,
//     children: [
//       { index: true, element: <Landing /> },
//       { path: "about", element: <AboutPage /> },
//     ],
//   },
//   {
//     path: "/auth",
//     element: <AuthLayout />,
//     children: [
//       {
//         path: "login",
//         element: <LoginPage />,
//       },
//       {
//         path: "verify-email",
//         element: <VerifyEmailPage />,
//       },
//       {
//         path: "forgot-password",
//         element: <ForgotPasswordPage />,
//       },
//       {
//         path: "reset-password/:token",
//         element: <ResetPasswordPage />,
//       },
//     ],
//   },
//   {
//     path: '/dashboard',
//     element: (
//       <ProtectedRoute>
//         <DashboardLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { index: true, element: <DashboardPage /> },
      
//       { path: 'admin', element: <AdminDashboard /> },
//       { path: 'manager', element: <ManagerDashboard /> },
//       { path: 'cashier', element: <CashierDashboard /> },
//     ],
//   },
// ]);

// export default router;


import React from 'react';
import { createBrowserRouter } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
import Landing from '@/pages/Landing';
import AboutPage from '@/pages/AboutPage';
import AuthLayout from '@/layouts/AuthLayout';
import LoginPage from '@/pages/LoginPage';
import VerifyEmailPage from '@/pages/VerifyEmailPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';

// --- DASHBOARD IMPORTS ---
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardPage from '@/pages/DashboardPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Role Dashboards
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import ManagerDashboard from '@/pages/dashboard/ManagerDashboard';
import CashierDashboard from '@/pages/dashboard/CashierDashboard';

// Admin Pages
import UserManagement from '@/pages/dashboard/UserManagement';
import AuditLogPage from '@/pages/dashboard/AuditLogPage';
import SettingsPage from '@/pages/dashboard/SettingsPage';

// Manager Pages
import InventoryPage from '@/pages/dashboard/InventoryPage';
import BookCatalog from '@/pages/dashboard/BookCatalog';
import SalesReports from '@/pages/dashboard/SalesReports';

// Cashier Pages
import SalesHistory from '@/pages/dashboard/SalesHistory';
import CashierStats from '@/pages/dashboard/CashierStats';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'verify-email', element: <VerifyEmailPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password/:token', element: <ResetPasswordPage /> },
    ],
  },
  // --- PROTECTED DASHBOARD ROUTES ---
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // Main Dashboard Views
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/dashboard/admin', element: <AdminDashboard /> },
      { path: '/dashboard/manager', element: <ManagerDashboard /> },
      { path: '/dashboard/cashier', element: <CashierDashboard /> },

      // Admin Modules
      { path: '/users', element: <UserManagement /> },
      { path: '/admin/audit', element: <AuditLogPage /> },
      { path: '/settings', element: <SettingsPage /> },

      // Manager Modules
      { path: '/inventory', element: <InventoryPage /> },
      { path: '/books', element: <BookCatalog /> },
      { path: '/sales/reports', element: <SalesReports /> },

      // Cashier Modules
      { path: '/sales/history', element: <SalesHistory /> },
      { path: '/dashboard/cashier/stats', element: <CashierStats /> },
    ],
  },
]);

export default router;