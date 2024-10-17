import { create } from 'zustand';
import axios from 'axios';
import { useProductStore } from './productStore';

interface TransactionItem {
  name: string;
  price: number;
  quantity: number;
}

interface Transaction {
  _id: string;
  user?: string;
  crewMember: string;
  amount: number;
  items: TransactionItem[];
  createdAt: string;
  eventId: string;
}

interface TransactionState {
  currentTransaction: Transaction | null;
  createTransaction: (eventId: string, items: Record<string, number>, crewMemberId: string) => Promise<Transaction>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  currentTransaction: null,
  createTransaction: async (eventId: string, items: Record<string, number>, crewMemberId: string) => {
    const { products } = useProductStore.getState();

    const transactionItems = products
      .filter(product => items[product._id] > 0)
      .map(product => ({
        name: product.name,
        price: product.price,
        quantity: items[product._id],
      }));

    const amount = transactionItems.reduce((total, item) => total + item.price * item.quantity, 0);

    try {
      const response = await axios.post('/api/transactions', {
        crewMember: crewMemberId,
        amount,
        items: transactionItems,
        eventId,
      });

      const transaction: Transaction = response.data;
      set({ currentTransaction: transaction });
      return transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },
}));
