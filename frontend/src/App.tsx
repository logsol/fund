import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuthStore, AuthState } from './store/authStore';

import { Landing } from './components/pages/Landing';
import { Dashboard } from './components/pages/Dashboard';
import { Login } from './components/pages/Login';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {

  const { isLoggedIn } = useAuthStore() as AuthState;
  return isLoggedIn() ? element : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isLoggedIn } = useAuthStore() as AuthState;
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : element;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PublicRoute element={<Landing />} />} />
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
