import React from 'react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">About Our App</h1>
      <p className="text-lg mb-8">This is a simple React application showcasing routing and basic components.</p>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link>
          </li>
          <li>
            <Link to="/login" className="text-blue-500 hover:text-blue-700">Login</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
