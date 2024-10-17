import React from 'react';
import { Link } from 'react-router-dom';

export const Landing: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full h-full bg-gray-100 sm:px-8 justify-center pb-[15vh] px-8">
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
      Here, friends can micro-fund exciting local events and enjoy exclusive benefits like reduced entrance fees and drink prices. Join us in supporting and celebrating our vibrant community while saving on your favorite experiences.
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