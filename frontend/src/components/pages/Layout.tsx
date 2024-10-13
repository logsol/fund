import React, { useState, useEffect } from 'react';
import { useAuthStore, AuthState, User } from '../../store/authStore';
import { Link, Outlet } from 'react-router-dom';
import { CircleStackIcon } from '@heroicons/react/24/solid'

const Layout: React.FC = () => {
  const { getCurrentUser } = useAuthStore() as AuthState;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getCurrentUser();
      setUser(fetchedUser);
    };

    fetchUser();
  }, [getCurrentUser]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Fund</Link>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <CircleStackIcon className="h-6 w-6 text-yellow-400 mr-2" />
            <span>{user?.balance}</span>
          </div>
          <span>{user?.name}</span>
        </div>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
