import React from 'react';
import { useAuthStore } from '../../store/authStore';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to Your Dashboard</h1>
      {user && (
        <div className="text-lg mb-4">
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Balance: ${user.balance}</p>
        </div>
      )}
    </div>
  );
};