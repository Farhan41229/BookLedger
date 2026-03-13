import { useState } from 'react';
import useAuthStore from '@/store/authStore';
import { motion } from 'framer-motion';
import { User, Mail, Package, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import API from '@/lib/axios';
import { useEffect } from 'react';

const CustomerProfile = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await API.get('/sales/my-orders');
          setOrders(res.data.sales || []);
        } catch (error) {
          toast.error('Failed to load order history');
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <div className="grid md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <Card className="h-fit bg-card/40 border-border/50 shadow-lg shadow-primary/5">
            <CardContent className="p-4 space-y-2">
              <div className="mb-6 px-4">
                <p className="font-semibold text-lg">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>

              <Button 
                variant={activeTab === 'orders' ? 'secondary' : 'ghost'} 
                className="w-full justify-start text-left font-medium"
                onClick={() => setActiveTab('orders')}
              >
                <Package className="mr-3 h-4 w-4" />
                Order History
              </Button>
              <Button 
                variant={activeTab === 'profile' ? 'secondary' : 'ghost'} 
                className="w-full justify-start text-left font-medium"
                onClick={() => setActiveTab('profile')}
              >
                <User className="mr-3 h-4 w-4" />
                Profile Settings
              </Button>

              <div className="pt-4 mt-4 border-t border-border/50">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'orders' && (
              <Card className="bg-card/40 border-border/50 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View and track your recent purchases.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <div className="flex justify-center py-12">
                       <span className="animate-pulse text-muted-foreground">Loading orders...</span>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border/50">
                      <Package className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                      <h3 className="text-lg font-medium">No orders yet</h3>
                      <p className="text-muted-foreground mt-1">When you buy books, they will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-border/50">
                        <div className="bg-muted/30 p-4 rounded-lg flex flex-col justify-center items-center">
                          <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                          <p className="text-2xl font-bold text-primary">{orders.length}</p>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg flex flex-col justify-center items-center">
                          <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                          <p className="text-2xl font-bold text-emerald-600">
                             ${orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {orders.map((order) => (
                        <div key={order._id} className="border border-border/50 rounded-lg p-4 bg-muted/10">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                               <p className="text-xs text-muted-foreground">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                               <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                               <p className="font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
                               <Badge variant={order.status === 'Cancelled' ? 'destructive' : 'secondary'} className="mt-1 text-[10px]">
                                 {order.status || 'Completed'}
                               </Badge>
                            </div>
                          </div>
                          <div className="space-y-2 mt-4 pt-4 border-t border-border/50">
                             {order.items.map((item, idx) => (
                               <div key={idx} className="flex justify-between text-sm">
                                 <div className="flex items-center gap-2">
                                     <span className="font-medium text-muted-foreground">{item.quantity}x</span>
                                     <span>{item.bookId?.title || 'Unknown Book'}</span>
                                 </div>
                                 <span className="text-muted-foreground">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                               </div>
                             ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'profile' && (
              <Card className="bg-card/40 border-border/50 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Manage your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4 max-w-md">
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                      <div className="px-3 py-2 border rounded-md bg-muted/50">{user?.name}</div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
                      <div className="px-3 py-2 border rounded-md bg-muted/50">{user?.email}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
