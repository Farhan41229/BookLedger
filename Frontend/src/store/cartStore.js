import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (book) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item._id === book._id);

        if (existingItem) {
          if (existingItem.quantity >= book.stockQuantity) return; // Prevent overselling
          set({
            items: currentItems.map((item) =>
              item._id === book._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { ...book, quantity: 1 }] });
        }
      },

      removeItem: (bookId) => {
        set({ items: get().items.filter((item) => item._id !== bookId) });
      },

      updateQuantity: (bookId, quantity) => {
        if (quantity < 1) return;
        const currentItems = get().items;
        const item = currentItems.find((i) => i._id === bookId);
        if (item && quantity > item.stockQuantity) return; // Stock check

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
    }),
    {
      name: 'pos-cart-storage', // Keep cart items even if page refreshes
    }
  )
);

export default useCartStore;