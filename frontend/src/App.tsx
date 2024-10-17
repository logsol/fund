import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuthStore } from './store/authStore';

import { Landing } from './components/pages/Landing';
import { Dashboard } from './components/pages/member/Dashboard';
import { Crewboard } from './components/pages/crew/Crewboard';
import { Login } from './components/pages/Login';
import { Scan } from './components/pages/member/Scan';
import { PosTerminal } from './components/pages/crew/PosTerminal';
import { QrPay } from './components/pages/crew/QrPay';
import { PayLink } from './components/pages/member/PayLink';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : element;
};

const CrewRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, isCrewMember } = useAuthStore();
  return isAuthenticated && isCrewMember() ? element : <Navigate to="/dashboard" replace />;
};

const App: React.FC = () => {
  const { isAuthenticated, user, getCurrentUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      getCurrentUser();
    }
  }, [isAuthenticated, user, getCurrentUser]);

  const DashboardComponent = user?.isCrew ? Crewboard : Dashboard;

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PublicRoute element={<Landing />} />} />
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardComponent />} />} />
          <Route path="/scan" element={<ProtectedRoute element={<Scan />} />} />
          <Route path="/pay/:transactionId" element={<ProtectedRoute element={<PayLink />} />} />
          <Route path="/crewboard" element={<CrewRoute element={<Crewboard />} />} />
          <Route path="/pos-terminal/:id" element={<CrewRoute element={<PosTerminal />} />} />
          <Route path="/qr-pay" element={<CrewRoute element={<QrPay />} />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
