import React, { useState, useEffect } from 'react';
import { useAuthStore, AuthState, User } from '../store/authStore';
import { Link, Outlet } from 'react-router-dom';
import { CircleStackIcon } from '@heroicons/react/24/solid'

const Layout: React.FC = () => {
  const { isLoggedIn, getCurrentUser, logout } = useAuthStore() as AuthState;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getCurrentUser();
      setUser(fetchedUser);
    };

    fetchUser();
  }, [getCurrentUser]);

  return (
    <div className="flex flex-col h-[100vh]">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Fund</Link>
        {isLoggedIn() && (
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <CircleStackIcon className="h-6 w-6 text-yellow-400 mr-2" />
              <span>{user?.balance}</span>
            </div>
            <span>{user?.name}</span>
            <button onClick={logout} className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300">Logout</button>
          </div>
        )}
      </header>
      <main className="flex-1 flex overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
