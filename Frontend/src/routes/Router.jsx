


import React from 'react';
import { createBrowserRouter } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
import Landing from '@/pages/Landing';
import AboutPage from '@/pages/AboutPage';
import CatalogPage from '@/pages/CatalogPage';
import BookDetailPage from '@/pages/BookDetailPage';
import CustomerProfile from '@/pages/CustomerProfile';
import CheckoutPage from '@/pages/CheckoutPage';
import AuthLayout from '@/layouts/AuthLayout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
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
import DashboardProfile from '@/pages/dashboard/DashboardProfile';

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
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'books/:id', element: <BookDetailPage /> },
      { 
        path: 'profile', 
        element: (
          <ProtectedRoute>
            <CustomerProfile />
          </ProtectedRoute>
        ) 
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        )
      }
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
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
      { path: '/dashboard/profile', element: <DashboardProfile /> },

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