import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { CircleStackIcon } from '@heroicons/react/24/outline';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-100 sm:px-8">
      {user && (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Hi {user.name}, 
          </h1>
          <p className="text-lg">
            your current credit balance is <CircleStackIcon className="inline h-4 w-4 mb-1" /> {user.balance}
          </p>
        </div>
      )}
    </div>
  );
};
