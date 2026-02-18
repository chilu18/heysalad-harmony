import React, { createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth as useAuthContext } from './contexts/AuthContext';
import { Role } from './types';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import LandingPage from './pages/LandingPageSimple';
import AuthCallback from './components/AuthCallback';
import DemoPage from './pages/DemoPage';
import HRManagerDashboard from './pages/hr-manager/HRManagerDashboard';
import OperationsManagerDashboard from './pages/operations-manager/OperationsManagerDashboard';
import WarehouseStaffDashboard from './pages/warehouse-staff/WarehouseStaffDashboard';
import Timesheets from './pages/shared/Timesheets';
import Payslips from './pages/shared/Payslips';
import Benefits from './pages/shared/Benefits';
import Wellbeing from './pages/shared/Wellbeing';
import Settings from './pages/shared/Settings';
import Training from './pages/shared/Training';
import Voice from './pages/shared/Voice';
import MyDocuments from './pages/warehouse-staff/MyDocuments';
import MySchedule from './pages/warehouse-staff/MySchedule';
import Packages from './pages/hr-manager/Packages';
import Employees from './pages/hr-manager/Employees';
import HRApprovals from './pages/hr-manager/Approvals';
import HRFinance from './pages/hr-manager/Finance';
import Legal from './pages/hr-manager/Legal';
import Documents from './pages/hr-manager/Documents';
import IT from './pages/hr-manager/IT';
import HRRecruitment from './pages/hr-manager/Recruitment';
import TeamOverview from './pages/operations-manager/TeamOverview';
import SafetyCompliance from './pages/operations-manager/SafetyCompliance';
import Locations from './pages/operations-manager/Locations';
import OpsApprovals from './pages/operations-manager/Approvals';
import Procurement from './pages/operations-manager/Procurement';
import OpsFinance from './pages/operations-manager/Finance';
import OpsRecruitment from './pages/operations-manager/Recruitment';

interface AppAuthContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
}

const AppAuthContext = createContext<AppAuthContextType>({
  currentRole: 'HR Manager',
  setCurrentRole: () => {},
});

export const useAppAuth = () => useContext(AppAuthContext);

// Export useAuth for backward compatibility
export const useAuth = () => {
  const { user } = useAuthContext();
  const { currentRole, setCurrentRole } = useAppAuth();
  
  return {
    currentUser: user ? {
      id: user.id,
      email: user.email || '',
      name: user.email || user.phone || 'User',
      roles: ['HR Manager', 'Operations Manager', 'Warehouse Staff'] as Role[],
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    } : null,
    currentRole,
    setCurrentRole,
  };
};

function AppContent() {
  const { user, isLoading } = useAuthContext();
  const [currentRole, setCurrentRole] = React.useState<Role>('HR Manager');

  const DashboardContent = () => {
    if (currentRole === 'HR Manager') {
      return <HRManagerDashboard />;
    }

    if (currentRole === 'Operations Manager') {
      return <OperationsManagerDashboard />;
    }

    return <WarehouseStaffDashboard />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading Harmony...</p>
        </div>
      </div>
    );
  }

  return (
    <AppAuthContext.Provider value={{ currentRole, setCurrentRole }}>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <LandingPage />}
        />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/demo" element={<DemoPage />} />

        {user ? (
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardContent />} />

            {/* Shared pages */}
            <Route path="/timesheets" element={<Timesheets />} />
            <Route path="/payslips" element={<Payslips />} />
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/wellbeing" element={<Wellbeing />} />
            <Route path="/training" element={<Training />} />
            <Route path="/voice" element={<Voice />} />
            <Route path="/settings" element={<Settings />} />

            {/* Warehouse Staff */}
            <Route path="/my-documents" element={<MyDocuments />} />
            <Route path="/my-schedule" element={<MySchedule />} />

            {/* HR Manager */}
            <Route path="/packages" element={<Packages />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/it" element={<IT />} />
            <Route
              path="/recruitment"
              element={currentRole === 'HR Manager' ? <HRRecruitment /> : <OpsRecruitment />}
            />

            {/* Operations Manager */}
            <Route path="/team" element={<TeamOverview />} />
            <Route path="/safety" element={<SafetyCompliance />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/procurement" element={<Procurement />} />

            {/* Shared routes with role-specific content */}
            <Route
              path="/finance"
              element={currentRole === 'HR Manager' ? <HRFinance /> : <OpsFinance />}
            />
            <Route
              path="/approvals"
              element={currentRole === 'HR Manager' ? <HRApprovals /> : <OpsApprovals />}
            />

            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </AppAuthContext.Provider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
