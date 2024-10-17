import { create } from 'zustand';
import { useProductStore } from './productStore';

interface CartState {
  cart: Record<string, number>;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  getTotalCredits: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: {},
  addToCart: (productId) => set((state) => ({
    cart: { ...state.cart, [productId]: (state.cart[productId] || 0) + 1 }
  })),
  removeFromCart: (productId) => set((state) => ({
    cart: { 
      ...state.cart, 
      [productId]: Math.max((state.cart[productId] || 0) - 1, 0)
    }
  })),
  getTotalCredits: () => {
    const { products } = useProductStore.getState();
    const { cart } = get();
    return products.reduce((total, product) => 
      total + (cart[product._id] || 0) * product.price, 0);
  },
}));
