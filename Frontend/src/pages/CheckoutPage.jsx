import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { CreditCard, Truck, User, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconInput } from '@/components/auth/IconInput';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import API from '@/lib/axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const saleData = {
        cashierId: user._id, 
        items: items.map(item => ({
          bookId: item.book._id,
          quantity: item.quantity,
          unitPrice: item.book.price
        })),
        totalAmount: getTotal()
      };

      await API.post('/sales', saleData);
      
      setSuccess(true);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (error) {
       console.error(error);
       toast.error(error.response?.data?.message || 'Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
              
              <Card className="bg-card/40 border-border/50 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Shipping Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <IconInput icon={User} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <IconInput icon={Truck} name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                    <IconInput icon={Truck} name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                  </div>
                  <IconInput icon={Truck} name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleChange} required />
                </CardContent>
              </Card>

              <Card className="bg-card/40 border-border/50 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <IconInput icon={CreditCard} name="cardNumber" placeholder="Card Number" value={formData.cardNumber} onChange={handleChange} required />
                  <div className="grid grid-cols-2 gap-4">
                    <IconInput icon={CreditCard} name="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={handleChange} required />
                    <IconInput icon={CreditCard} name="cvv" type="password" placeholder="CVV" value={formData.cvv} onChange={handleChange} required />
                  </div>
                </CardContent>
              </Card>

            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="bg-card/40 border-border/50 shadow-lg shadow-primary/5 sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
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
                  type="submit" 
                  form="checkout-form"
                  className="w-full animated-gradient text-white h-12 mt-6 shadow-lg"
                  disabled={loading || items.length === 0}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : `Pay $${getTotal().toFixed(2)}`}
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
