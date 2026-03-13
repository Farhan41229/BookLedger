import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      setIsOpen: (isOpen) => set({ isOpen }),

      addItem: (book, quantityToAdd = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item._id === book._id);

        if (existingItem) {
          const newQty = existingItem.quantity + quantityToAdd;
          if (newQty > book.stockQuantity) {
            toast.error(`Only ${book.stockQuantity} items in stock`);
            return;
          }
          set({
            items: currentItems.map((item) =>
              item._id === book._id
                ? { ...item, quantity: newQty }
                : item
            ),
            isOpen: true,
          });
          toast.success('Cart updated');
        } else {
          if (quantityToAdd > book.stockQuantity) {
            toast.error(`Only ${book.stockQuantity} items in stock`);
            return;
          }
          set({ 
            items: [...currentItems, { ...book, quantity: quantityToAdd }], 
            isOpen: true 
          });
          toast.success('Added to cart');
        }
      },

      removeItem: (bookId) => {
        set({ items: get().items.filter((item) => item._id !== bookId) });
        toast.success('Item removed from cart');
      },

      updateQuantity: (bookId, quantity) => {
        if (quantity < 1) return;
        const currentItems = get().items;
        const item = currentItems.find((i) => i._id === bookId);
        if (item && quantity > item.stockQuantity) {
          toast.error(`Only ${item.stockQuantity} items in stock`);
          return;
        }

        set({
          items: currentItems.map((item) =>
            item._id === bookId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'pos-cart-storage',
    }
  )
);

export default useCartStore;