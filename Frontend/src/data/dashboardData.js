export const adminDashboardData = {
  stats: {
    todaySales: { value: 45, change: 12, trend: 'up' },
    todayRevenue: { value: 2450.00, change: 8, trend: 'up' },
    booksSold: { value: 156, change: 5, trend: 'up' },
    activeCustomers: { value: 342, change: 2, trend: 'up' }
  },
  salesTrend: [
    { date: 'Mon', sales: 1200 },
    { date: 'Tue', sales: 1450 },
    { date: 'Wed', sales: 1380 },
    { date: 'Thu', sales: 1620 },
    { date: 'Fri', sales: 1550 },
    { date: 'Sat', sales: 1890 },
    { date: 'Sun', sales: 2450 }
  ],
  topBooks: [
    { title: 'The Great Gatsby', sales: 45, revenue: 674.55 },
    { title: '1984', sales: 38, revenue: 645.62 },
    { title: 'To Kill a Mockingbird', sales: 32, revenue: 479.68 },
    { title: 'Harry Potter', sales: 25, revenue: 549.75 }
  ],
  recentTransactions: [
    { id: '1234', amount: 45.99, time: '2m ago', cashier: 'John D.' },
    { id: '1235', amount: 28.50, time: '5m ago', cashier: 'Jane S.' },
    { id: '1236', amount: 156.00, time: '12m ago', cashier: 'John D.' },
    { id: '1237', amount: 89.99, time: '18m ago', cashier: 'Mike W.' }
  ],
  inventoryAlerts: {
    outOfStock: 12,
    lowStock: 23,
    needReorder: 8,
    deadStock: 5
  }
};