export const adminDashboardData = {
  stats: {
    todaySales: { value: 45, change: 12, trend: "up" },
    todayRevenue: { value: 2450.0, change: 8, trend: "up" },
    booksSold: { value: 156, change: 5, trend: "up" },
    activeCustomers: { value: 342, change: 2, trend: "up" },
  },
  salesTrend: [
    { date: "Mon", sales: 1200 },
    { date: "Tue", sales: 1450 },
    { date: "Wed", sales: 1380 },
    { date: "Thu", sales: 1620 },
    { date: "Fri", sales: 1550 },
    { date: "Sat", sales: 1890 },
    { date: "Sun", sales: 2450 },
  ],
  topBooks: [
    { title: "The Great Gatsby", sales: 45, revenue: 674.55 },
    { title: "1984", sales: 38, revenue: 645.62 },
    { title: "To Kill a Mockingbird", sales: 32, revenue: 479.68 },
    { title: "Harry Potter", sales: 25, revenue: 549.75 },
  ],
  recentTransactions: [
    { id: "1234", amount: 45.99, time: "2m ago", cashier: "John D." },
    { id: "1235", amount: 28.5, time: "5m ago", cashier: "Jane S." },
    { id: "1236", amount: 156.0, time: "12m ago", cashier: "John D." },
    { id: "1237", amount: 89.99, time: "18m ago", cashier: "Mike W." },
  ],
  inventoryAlerts: {
    outOfStock: 12,
    lowStock: 23,
    needReorder: 8,
    deadStock: 5,
  },
};

// ... existing adminDashboardData ...

export const managerDashboardData = {
  stats: {
    revenue: { value: 12450.0, change: 8, trend: "up" },
    weeklySales: { value: 45600.0, change: 12, trend: "up" },
    inventoryCount: { value: 1240, change: -5, trend: "down" },
    lowStock: { value: 23, change: 2, trend: "up" },
  },
  salesByCategory: [
    { name: "Fiction", value: 45 },
    { name: "Non-Fiction", value: 30 },
    { name: "Sci-Fi", value: 15 },
    { name: "Mystery", value: 10 },
  ],
  deadStock: [
    { title: "Old Textbooks 2020", days: 120, stock: 45 },
    { title: "Travel Guides 2021", days: 95, stock: 12 },
    { title: "Legacy DVD Sets", days: 300, stock: 8 },
  ],
};

export const cashierDashboardData = {
  stats: {
    mySales: { value: 28, change: 5, trend: "up" },
    myRevenue: { value: 456.8, change: 12, trend: "up" },
    avgSale: { value: 38.07, change: 2, trend: "up" },
  },
  recentSales: [
    { id: "1240", time: "2m ago", total: 45.99, items: 2 },
    { id: "1239", time: "15m ago", total: 12.5, items: 1 },
    { id: "1238", time: "32m ago", total: 156.0, items: 5 },
  ],
  hourlyPerformance: [
    { time: "9am", sales: 120 },
    { time: "10am", sales: 250 },
    { time: "11am", sales: 180 },
    { time: "12pm", sales: 450 }, // Peak
    { time: "1pm", sales: 300 },
  ],
};
