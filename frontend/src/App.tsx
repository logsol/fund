import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuthStore, AuthState } from './store/authStore';

import { Landing } from './components/pages/Landing';
import { Dashboard } from './components/pages/member/Dashboard';
import { Crewboard } from './components/pages/crew/Crewboard';
import { Login } from './components/pages/Login';
import { Scan } from './components/pages/Scan';
import { PosTerminal } from './components/pages/crew/PosTerminal';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {

  const { isLoggedIn } = useAuthStore() as AuthState;
  return isLoggedIn() ? element : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isLoggedIn } = useAuthStore() as AuthState;
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : element;
};

const CrewRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isLoggedIn, isCrewMember } = useAuthStore();
  return isLoggedIn() && isCrewMember() ? element : <Navigate to="/dashboard" replace />;
};

const App: React.FC = () => {
  const { isLoggedIn, user } = useAuthStore() as AuthState;

  const DashboardComponent = user?.isCrew ? Crewboard : Dashboard;

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PublicRoute element={<Landing />} />} />
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardComponent />} />} />
          <Route path="/scan" element={<ProtectedRoute element={<Scan />} />} />
          <Route path="/crewboard" element={<CrewRoute element={<Crewboard />} />} />
          <Route path="/pos-terminal/:id" element={<CrewRoute element={<PosTerminal />} />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
