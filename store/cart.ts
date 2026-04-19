// store/cart.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === newItem.id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            )
          });
        } else {
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Селектори
export const useTotalItems = () => {
  return useCartStore((state) => 
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
};

export const useTotalPrice = () => {
  return useCartStore((state) => 
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
};