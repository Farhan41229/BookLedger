import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  Package,
  Users,
  Shield,
  TrendingUp,
  DollarSign,
  FileText,
  AlertCircle,
  Bell,
  Zap,
  Search,
  UserPlus
} from 'lucide-react';

export const getMenuItemsByRole = (role) => {
  const baseItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }
  ];

  const roleMenus = {
    Admin: [
      ...baseItems,
      { icon: BookOpen, label: 'Books Management', path: '/dashboard/books' },
      { icon: ShoppingCart, label: 'Sales & Transactions', path: '/dashboard/sales' },
      { icon: Package, label: 'Inventory Control', path: '/dashboard/inventory' },
      { icon: Users, label: 'Customer Management', path: '/dashboard/customers' },
      { icon: Shield, label: 'User Management', path: '/dashboard/users' },
      { icon: TrendingUp, label: 'Reports & Analytics', path: '/dashboard/reports' },
      { icon: DollarSign, label: 'Pricing & Discounts', path: '/dashboard/pricing' },
      { icon: FileText, label: 'Audit Logs', path: '/dashboard/audit' }
    ],
    Manager: [
      ...baseItems,
      { icon: BookOpen, label: 'Books Management', path: '/dashboard/books' },
      { icon: ShoppingCart, label: 'Sales & Transactions', path: '/dashboard/sales' },
      { icon: Package, label: 'Inventory Control', path: '/dashboard/inventory' },
      { icon: Users, label: 'Customer Management', path: '/dashboard/customers' },
      { icon: TrendingUp, label: 'Reports & Analytics', path: '/dashboard/reports' },
      { icon: DollarSign, label: 'Pricing & Discounts', path: '/dashboard/pricing' }
    ],
    Cashier: [
      ...baseItems,
      { icon: ShoppingCart, label: 'New Sale', path: '/dashboard/new-sale' },
      { icon: FileText, label: 'My Sales History', path: '/dashboard/my-sales' },
      { icon: BookOpen, label: 'Browse Books', path: '/dashboard/books' },
      { icon: Users, label: 'Find Customer', path: '/dashboard/customers' }
    ]
  };

  return roleMenus[role] || baseItems;
};

export const getQuickAccessByRole = (role) => {
  const quickAccess = {
    Admin: [
      { icon: AlertCircle, label: 'Dead Stock Items', path: '/dashboard/pricing' },
      { icon: Bell, label: 'Reorder Alerts', path: '/dashboard/inventory' }, // Fixed path
      { icon: TrendingUp, label: "Today's Sales", path: '/dashboard/reports' }
    ],
    Manager: [
      { icon: AlertCircle, label: 'Dead Stock Items', path: '/dashboard/pricing' },
      { icon: Bell, label: 'Reorder Alerts', path: '/dashboard/inventory' },
      { icon: TrendingUp, label: "Today's Sales", path: '/dashboard/reports' }
    ],
    Cashier: [
      { icon: Zap, label: 'Quick Checkout', path: '/dashboard/new-sale' },
      { icon: Search, label: 'Search Books', path: '/dashboard/books' },
      { icon: UserPlus, label: 'Create Customer', path: '/dashboard/customers' }
    ]
  };

  return quickAccess[role] || [];
};