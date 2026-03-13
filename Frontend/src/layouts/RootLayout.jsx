import { Outlet } from 'react-router';
import ScrollProgress from '@/components/layout/ScrollProgress';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

const RootLayout = () => {
  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default RootLayout;
