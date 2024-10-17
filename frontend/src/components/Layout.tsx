import React, { useEffect } from 'react';
import { useAuthStore, AuthState } from '../store/authStore';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { CircleStackIcon } from '@heroicons/react/24/solid'

const Layout: React.FC = () => {
  const { isAuthenticated, user, getCurrentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !user) {
      getCurrentUser();
    }
  }, [isAuthenticated, user, getCurrentUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-[100vh]">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Fund</Link>
        {isAuthenticated && user ? (
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <CircleStackIcon className="h-6 w-6 text-yellow-400 mr-2" />
              <span>{user.balance}</span>
            </div>
            <span>{user.name}</span>
            <button onClick={handleLogout} className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">Login</Link>
        )}
      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
