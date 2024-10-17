import React from 'react';
import { useAuthStore } from '../../../store/authStore';
import { CircleStackIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col items-center w-full h-full bg-gray-100 sm:px-8 justify-center pb-[15vh] px-8">
      {user && (
        <div className="text-center">
          <p className="mb-4">
            Hi {user.name}, 
          </p>
          <h1 className="text-3xl font-bold text-center">
            Credit: <CircleStackIcon className="inline h-8 w-8 mb-1" /> {user.balance}
          </h1>
          <Link 
            to="/scan" 
            className="mt-8 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-2xl transition duration-300"
          >
            Scan to spend
          </Link>
        </div>
      )}
    </div>
  );
};
