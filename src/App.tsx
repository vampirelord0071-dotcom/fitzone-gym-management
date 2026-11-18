import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GymProvider } from './context/GymContext';

// Public Layout & Pages
import { PublicLayout } from './components/public/PublicLayout';
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Plans } from './pages/public/Plans';
import { Contact } from './pages/public/Contact';

// Admin Auth & Layout
import { Login } from './pages/admin/Login';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';

// Admin Pages
import { Dashboard } from './pages/admin/Dashboard';
import { Members } from './pages/admin/Members';
import { AddMember } from './pages/admin/AddMember';
import { MemberProfile } from './pages/admin/MemberProfile';
import { PlansAdmin } from './pages/admin/PlansAdmin';
import { Payments } from './pages/admin/Payments';
import { Dues } from './pages/admin/Dues';
import { Reports } from './pages/admin/Reports';
import { Settings } from './pages/admin/Settings';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GymProvider>
          <Routes>
            {/* PUBLIC WEBSITE ROUTES */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="plans" element={<Plans />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* OWNER LOGIN ROUTE */}
            <Route path="/admin/login" element={<Login />} />

            {/* PROTECTED OWNER & STAFF ADMIN ROUTES */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="members" element={<Members />} />
                <Route path="members/new" element={<AddMember />} />
                <Route path="members/:id" element={<MemberProfile />} />
                <Route path="plans" element={<PlansAdmin />} />
                <Route path="payments" element={<Payments />} />
                <Route path="dues" element={<Dues />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* CATCH-ALL REDIRECT */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </GymProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
