import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader2, CheckCircle2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import API from '@/lib/axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const hasProcessed = useRef(false);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const saleData = {
        cashierId: user?._id, 
        items: items.map(item => ({
          bookId: item._id,
          quantity: item.quantity,
          unitPrice: item.price,
          title: item.title
        })),
        totalAmount: getTotal()
      };

      const res = await API.post('/sales/create-checkout-session', { items: saleData.items });
      window.location.href = res.data.url;
    } catch (error) {
       console.error(error);
       toast.error(error.response?.data?.message || 'Failed to process order. Please try again.');
       setLoading(false); // only disable loading if error. success will redirect.
    }
  };

  useEffect(() => {
    if (success || items.length === 0) return;

    const query = new URLSearchParams(window.location.search);
    
    if (query.get("success") && !hasProcessed.current) {
      hasProcessed.current = true;
      const completeOrder = async () => {
        setLoading(true);
        try {
          const saleData = {
            cashierId: user?._id, 
            items: items.map(item => ({
              bookId: item._id,
              quantity: item.quantity,
              unitPrice: item.price
            })),
            totalAmount: getTotal()
          };
          
          await API.post('/sales', saleData);
          setSuccess(true);
          clearCart();
          toast.success('Order placed successfully!');
          window.history.replaceState(null, '', '/checkout');
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || 'Failed to process order. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      completeOrder();
    }

    if (query.get("canceled")) {
      toast.error("Order canceled - you can checkout when you're ready.");
      window.history.replaceState(null, '', '/checkout');
    }
  }, [items.length, success, clearCart, getTotal, user]);

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4 shadow-xl border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-center py-8">
          <CardContent className="space-y-4">
            <CheckCircle2 className="h-20 w-20 text-emerald-500 mx-auto" />
            <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Payment Successful!</h2>
            <p className="text-muted-foreground">Thank you for your purchase.</p>
            <Button className="mt-6" onClick={() => navigate('/catalog')}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button variant="ghost" className="mb-6 -ml-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Checkout</h1>

        <div className="flex justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
            <Card className="bg-card/40 border-border/50 shadow-lg shadow-primary/5">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-xl">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                  {items.map((item) => (
                    <div key={item._id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                         <span className="font-semibold">{item.quantity}x</span>
                         <span className="truncate max-w-[180px]">{item.title}</span>
                      </div>
                      <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  onClick={handleCheckout}
                  className="w-full animated-gradient text-white h-12 mt-6 shadow-lg text-lg"
                  disabled={loading || items.length === 0}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
