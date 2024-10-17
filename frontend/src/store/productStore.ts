import { create } from 'zustand';

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface ProductState {
  products: Product[];
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  fetchProducts: async () => {
    // Fetch products from API and set them
    const response = await fetch('/api/products');
    const products = await response.json();
    set({ products });
  },
}));
