import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import useCartStore from '@/store/cartStore';

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotal } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Your Cart</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <ShoppingBag className="h-12 w-12 opacity-20" />
                  <p>Your cart is empty</p>
                  <Button variant="outline" onClick={() => { setIsOpen(false); navigate('/catalog'); }}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item._id} className="flex gap-4 glass-card p-3">
                    <div className="h-20 w-16 bg-muted rounded-md overflow-hidden shrink-0">
                      {item.coverImage ? (
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary uppercase text-xs font-bold text-center p-1">
                          {item.title.substring(0, 10)}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1 -mr-1 -mt-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-background border rounded-md px-1 py-0.5">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-1 hover:text-primary disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 hover:text-primary disabled:opacity-50"
                            disabled={item.quantity >= item.stockQuantity}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-semibold text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t bg-card/50 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-muted-foreground">Subtotal</span>
                  <span className="font-bold text-lg">${getTotal().toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Shipping and taxes calculated at checkout.
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full animated-gradient text-white h-12 shadow-lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
