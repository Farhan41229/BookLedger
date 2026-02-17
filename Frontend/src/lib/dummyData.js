// 1. Add 'Activity' to the import list
import { Users, AlertTriangle, DollarSign, Package, ShoppingCart, Activity } from 'lucide-react';

export const adminStats = [
  {
    title: "Total Users",
    value: "1,284",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Active Sessions",
    value: "423",
    change: "+4%",
    trend: "up",
    icon: Activity, // Now uses the imported icon
  },
  {
    title: "System Health",
    value: "99.9%",
    change: "Stable",
    trend: "neutral",
    icon: AlertTriangle,
  },
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
];

export const managerStats = [
  {
    title: "Monthly Revenue",
    value: "$12,345",
    change: "+15%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Low Stock Items",
    value: "23",
    change: "-5",
    trend: "down",
    icon: AlertTriangle,
  },
  {
    title: "Books Sold",
    value: "1,432",
    change: "+8%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Inventory Value",
    value: "$124,500",
    change: "+2%",
    trend: "up",
    icon: Package,
  },
];

export const cashierStats = [
  {
    title: "Today's Sales",
    value: "$1,234",
    change: "+12%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Transactions",
    value: "45",
    change: "+5",
    trend: "up",
    icon: ShoppingCart,
  },
];

export const revenueData = [
  { name: 'Jan', total: 1500 },
  { name: 'Feb', total: 2300 },
  { name: 'Mar', total: 3200 },
  { name: 'Apr', total: 4500 },
  { name: 'May', total: 3800 },
  { name: 'Jun', total: 5200 },
  { name: 'Jul', total: 5800 },
];

export const recentSales = [
  {
    id: "TRX-9871",
    user: "John Doe",
    amount: "$120.50",
    status: "Completed",
    date: "2 mins ago",
  },
  {
    id: "TRX-9872",
    user: "Jane Smith",
    amount: "$75.20",
    status: "Processing",
    date: "5 mins ago",
  },
  {
    id: "TRX-9873",
    user: "Bob Johnson",
    amount: "$350.00",
    status: "Completed",
    date: "12 mins ago",
  },
  {
    id: "TRX-9874",
    user: "Alice Brown",
    amount: "$42.00",
    status: "Failed",
    date: "25 mins ago",
  },
];

// 2. The helper function 'Activity' has been removed from here.