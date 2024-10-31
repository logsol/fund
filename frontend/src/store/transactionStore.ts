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
  status: 'pending' | 'paid' | 'cancelled';
  cancelReason?: string;
}

interface TransactionState {
  currentTransaction: Transaction | null;
  createTransaction: (eventId: string, items: Record<string, number>, crewMemberId: string) => Promise<Transaction>;
  getPaymentUrl: (transactionId: string) => string;
  payTransaction: (transactionId: string, userId: string) => Promise<{ success: boolean; message?: string }>;
  fetchTransaction: (transactionId: string) => Promise<Transaction>;
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
  payTransaction: async (transactionId: string, userId: string) => {
    try {
      const response = await axios.post(`/api/transactions/pay`, {
        transactionId,
        userId,
      });

      if (response.status === 200 && response.data.message === 'success') {
        const updatedTransaction: Transaction = {
          ...useTransactionStore.getState().currentTransaction!,
          status: 'paid'
        };
        set({ currentTransaction: updatedTransaction });
        return { success: true };
      } else {
        return { success: false, message: response.data.message || 'Unknown error' };
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        return { success: false, message: error.response.data.message };
      }
      return { success: false, message: 'An unexpected error occurred' };
    }
  },
  getPaymentUrl: (transactionId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/pay/${transactionId}`;
  },
  fetchTransaction: async (transactionId: string) => {
    try {
      const response = await axios.get(`/api/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }
}));
