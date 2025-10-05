import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Login } from './pages/Auth/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { useAuth } from './hooks/useAuth';
import { logger } from './utils/logger';

// Import actual page components
import { Tasks } from './pages/Tasks/Tasks';
import { Budget } from './pages/Budget/Budget';
import { Script } from './pages/Script/Script';
import { Assets } from './pages/Assets/Assets';
import { VFX } from './pages/VFX/VFX';
import { Reports } from './pages/Reports/Reports';

// Import Production Manager components
import { Scheduling } from './pages/Scheduling/Scheduling';
import { BudgetManagement } from './pages/BudgetManagement/BudgetManagement';
import { CallSheets } from './pages/CallSheets/CallSheets';
import { ExpenseTracking } from './pages/ExpenseTracking/ExpenseTracking';
import { BudgetReports } from './pages/BudgetReports/BudgetReports';
import { PropsMarketplace } from './pages/PropsMarketplace/PropsMarketplace';

// Import Producer Dashboard
import { ProductionManagerDashboard } from './pages/Dashboard/ProductionManagerDashboard';

// Placeholder components for pages that need to be created
const Settings = () => <div className="p-6">Settings Page - Coming Soon</div>;
const Marketplace = () => <div className="p-6">Marketplace - Coming Soon</div>;
const AdminControl = () => <div className="p-6">Admin Control - Coming Soon</div>;

function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    logger.info('Application initialized', 'App', {
      isAuthenticated,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="budget" element={<Budget />} />
        <Route path="script" element={<Script />} />
        <Route path="scheduling" element={<Scheduling />} />
        <Route path="budget-management" element={<BudgetManagement />} />
        <Route path="call-sheets" element={<CallSheets />} />
        <Route path="expense-tracking" element={<ExpenseTracking />} />
        <Route path="budget-reports" element={<BudgetReports />} />
        <Route path="props-marketplace" element={<PropsMarketplace />} />
        <Route path="assets" element={<Assets />} />
        <Route path="vfx" element={<VFX />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="production-manager">
        <Route index element={<ProductionManagerDashboard user={{} as any} tasks={[]} budget={null} script={null} />} />
        <Route path="overview" element={<ProductionManagerDashboard user={{} as any} tasks={[]} budget={null} script={null} />} />
        <Route path="scheduling" element={<Scheduling />} />
        <Route path="budget" element={<BudgetManagement />} />
        <Route path="reports" element={<BudgetReports />} />
        <Route path="call-sheets" element={<CallSheets />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="admin" element={<AdminControl />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}
export default App;
