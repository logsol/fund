import { create } from 'zustand';
import axios from 'axios';

export interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
}

export interface EventState {
  events: Event[];
  fetchEvents: () => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  fetchEvents: async () => {
    try {
      const response = await axios.get('/api/events');
      set({ events: response.data });
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // You might want to handle this error more gracefully
    }
  },
}));
