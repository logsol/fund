import React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our App</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link to="/about" className="text-blue-500 hover:text-blue-700">About</Link>
          </li>
          <li>
            <Link to="/login" className="text-blue-500 hover:text-blue-700">Login</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
