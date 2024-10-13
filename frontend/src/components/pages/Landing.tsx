import React from 'react';
import { Link } from 'react-router-dom';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our App</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        This is a secure platform for managing and transferring funds. 
        Join us to experience seamless financial transactions and robust account management.
      </p>
      <nav>
        <Link 
          to="/login" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Login to Your Account
        </Link>
      </nav>
    </div>
  );
};
