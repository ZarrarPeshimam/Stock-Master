import { useState } from 'react';
import './index.css';

import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './components/DashboardPage';
import ProductsPage from './components/ProductsPage';
import WarehousesPage from './components/WarehousesPage';
import OperationsPage from './components/OperationsPage';
import AnalyticsPage from './components/AnalyticsPage';
import MLInsightsPage from './components/MLInsightsPage';

function App() {
  const [authPage, setAuthPage] = useState('login');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    setAuthPage('app');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setCurrentPage('dashboard');
    setAuthPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'products':
        return <ProductsPage />;
      case 'warehouses':
        return <WarehousesPage />;
      case 'receipts':
        return <OperationsPage type="receipts" />;
      case 'deliveries':
        return <OperationsPage type="deliveries" />;
      case 'transfers':
        return <OperationsPage type="transfers" />;
      case 'adjustments':
        return <OperationsPage type="adjustments" />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'ml':
        return <MLInsightsPage />;
      default:
        return <DashboardPage />;
    }
  };

  // ---- AUTH PAGES ----
  if (authPage === 'login') {
    return <LoginPage onLogin={handleLogin} onNavigate={setAuthPage} />;
  }

  if (authPage === 'signup') {
    return <SignupPage onNavigate={setAuthPage} />;
  }

  // ---- MAIN APP ----
  return (
    <div className="min-h-screen flex bg-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <div className="flex flex-col w-full">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          onLogout={handleLogout}
        />

        <main className="p-6">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;
