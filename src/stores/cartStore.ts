import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT, PRICE_MULTIPLIER } from '@constants/student';
import { Product } from '@services/productApi';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  unitPriceVnd: number;
}

interface CartState {
  items: CartItem[];
  shippingFee: number | null;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  changeQty: (productId: number, delta: number) => void;
  clearCart: () => void;
  setShippingFee: (fee: number | null) => void;
  getTotalQuantity: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingFee: null,

      addItem: (product: Product) => {
        const unitPriceVnd = Math.round(product.price * PRICE_MULTIPLIER);
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === product.id);
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += 1;
            return { items: updated };
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                product,
                quantity: 1,
                unitPriceVnd,
              },
            ],
          };
        });
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
      },

      changeQty: (productId: number, delta: number) => {
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (item.id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);
          return { items: updated };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setShippingFee: (fee: number | null) => {
        set({ shippingFee: fee });
      },

      getTotalQuantity: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.unitPriceVnd * item.quantity, 0);
      },
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCartStore;
