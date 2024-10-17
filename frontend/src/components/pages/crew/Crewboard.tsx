import React, { useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useEventStore, Event } from '../../../store/eventStore';
import { useNavigate } from 'react-router-dom';

export const Crewboard: React.FC = () => {
  const { user } = useAuthStore();
  const { events, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center w-full h-full bg-gray-100 sm:px-8 justify-center pb-[15vh] px-8">
      {user && (
        <div className="text-center">
          <p className="mb-4">
            Hi {user.name}, 
          </p>
        </div>
      )}
      {events.map((event: Event) => (
        <div 
          key={event._id} 
          className="bg-white shadow-md rounded-lg p-6 mb-4 max-w-sm mx-auto cursor-pointer hover:shadow-lg transition-shadow duration-300"
          onClick={() => navigate(`/pos-terminal/${event._id}`)}
        >
          <h2 className="text-xl font-bold mb-2 text-gray-800">{event.name}</h2>
          <p className="text-gray-600 mb-3">{event.description}</p>
          <p className="text-sm text-gray-500">Date: {new Date(event.date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};
