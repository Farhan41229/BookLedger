import { useState, useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Package, LogOut, ShoppingBag, TrendingUp,
  Clock, CheckCircle, XCircle, BookOpen, ChevronRight,
  Star, Camera, Save, Loader2, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';
import API from '@/lib/axios';
import ProfileForm from '@/components/profile/ProfileForm';

const NAV_ITEMS = [
  { id: 'orders', label: 'Order History', icon: ShoppingBag },
  { id: 'profile', label: 'Profile Settings', icon: User },
];

const StatusBadge = ({ status }) => {
  const config = {
    Completed: { variant: 'default', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    Cancelled:  { variant: 'destructive', icon: XCircle,  color: 'text-red-500',   bg: 'bg-red-500/10'  },
    Pending:    { variant: 'secondary',   icon: Clock,    color: 'text-amber-500', bg: 'bg-amber-500/10' },
  }[status] || { variant: 'secondary', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' };

  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color} ${config.bg}`}>
      <Icon className="h-3 w-3" />
      {status || 'Completed'}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-sm group hover:shadow-md transition-shadow"
  >
    <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity ${color}`} />
    <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl ${color} bg-opacity-15 mb-3`}>
      <Icon className="h-5 w-5 text-current" />
    </div>
    <p className="text-2xl font-bold tracking-tight">{value}</p>
    <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
  </motion.div>
);

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
        } catch {
          toast.error('Failed to load order history');
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  const totalSpent = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const completedOrders = orders.filter(o => (o.status || 'Completed') === 'Completed').length;

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/3 to-purple-500/5">
      {/* ── Hero Header ──────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-card border-b border-border/50">
        {/* decorative blobs */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-10 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          {/* Avatar */}
          <div className="relative group flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-purple-500 blur-md opacity-30 group-hover:opacity-50 transition-opacity scale-110" />
            <Avatar className="relative h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-xl">
              <AvatarImage src={user?.profileImage} alt={user?.name} className="object-cover" />
              <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary/20 to-purple-500/20">
                {user?.name?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Info */}
          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold truncate">{user?.name}</h1>
              <Badge variant="secondary" className="self-center sm:self-auto flex items-center gap-1 w-fit">
                <Shield className="h-3 w-3" /> Customer
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="h-4 w-4 flex-shrink-0" />
              {user?.email}
            </p>
          </div>

          {/* Logout button */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 flex-shrink-0"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8 space-y-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard icon={ShoppingBag}   label="Total Orders"      value={orders.length}               color="bg-primary text-primary"           delay={0.05} />
          <StatCard icon={TrendingUp}    label="Total Spent"       value={`$${totalSpent.toFixed(2)}`} color="bg-emerald-500 text-emerald-600"    delay={0.10} />
          <StatCard icon={CheckCircle}   label="Completed"         value={completedOrders}              color="bg-violet-500 text-violet-600"      delay={0.15} />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl w-fit">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              {activeTab === id && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                />
              )}
              <Icon className="relative h-4 w-4" />
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {/* ── ORDERS TAB ── */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Purchase History</h2>
                  <p className="text-sm text-muted-foreground">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
                </div>

                {loadingOrders ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="h-32 rounded-2xl bg-muted/50 animate-pulse" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-border/60 bg-card/40 text-center gap-4"
                  >
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-primary/60" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">No orders yet</h3>
                      <p className="text-muted-foreground max-w-xs">Start exploring our collection and find your next great read.</p>
                    </div>
                    <Button className="mt-2 animated-gradient text-white" onClick={() => window.location.href = '/books'}>
                      <BookOpen className="mr-2 h-4 w-4" /> Browse Books
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, idx) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="rounded-2xl border border-border/50 bg-card overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        {/* Order header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-gradient-to-r from-muted/30 to-transparent border-b border-border/40">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">
                                Order <span className="font-mono text-primary">#{order._id.slice(-8).toUpperCase()}</span>
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Clock className="h-3 w-3" />
                                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                            <span className="text-lg font-bold text-primary">${order.totalAmount.toFixed(2)}</span>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>

                        {/* Order items */}
                        <div className="p-5 space-y-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between gap-4 py-2 group/item">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-sm truncate">{item.bookId?.title || 'Unknown Book'}</p>
                                  {item.bookId?.author && (
                                    <p className="text-xs text-muted-foreground truncate">{item.bookId.author}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 flex-shrink-0">
                                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md font-medium">
                                  ×{item.quantity}
                                </span>
                                <span className="font-semibold text-sm w-16 text-right">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="px-5 pb-4 flex justify-between items-center text-xs text-muted-foreground border-t border-border/30 pt-3">
                          <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                          <span className="font-semibold text-foreground">Total: ${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── PROFILE TAB ── */}
            {activeTab === 'profile' && (
              <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="relative p-6 border-b border-border/40 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5 overflow-hidden">
                  <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/5 blur-xl" />
                  <h2 className="text-xl font-bold relative">Profile Details</h2>
                  <p className="text-sm text-muted-foreground mt-0.5 relative">Manage your personal information and profile picture.</p>
                </div>

                <div className="p-6 space-y-8">
                  {/* Read-only info strip */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-muted/30 border border-border/40 p-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium mb-0.5">Email Address</p>
                        <p className="text-sm font-semibold truncate">{user?.email}</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-muted/30 border border-border/40 p-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-4 w-4 text-violet-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-0.5">Account Role</p>
                        <p className="text-sm font-semibold">{user?.role}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Editable form */}
                  <ProfileForm />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomerProfile;
