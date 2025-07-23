import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BrandingProvider } from './components/BrandingProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AffiliateForm from './components/AffiliateForm';
import Analytics from './components/Analytics';
import AdminPanel from './components/AdminPanel';
import AllUsers from './components/AllUsers';
import LandingPage from './components/LandingPage';
import LandingPageEditor from './components/LandingPageEditor';
import ReferralTracking from './components/ReferralTracking';
import FormsList from './components/FormsList';
import FormBuilder from './components/FormBuilder';
import StaffManagement from './components/StaffManagement';
import BrandingSettings from './components/BrandingSettings';
import FormSubmissions from './components/FormSubmissions';
import PermissionsManagement from './components/PermissionsManagement';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrandingProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/referral/:affiliateId" element={<AffiliateForm />} />
              
              {/* User Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute permission="analytics:read">
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/referrals"
                element={
                  <ProtectedRoute>
                    <ReferralTracking />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute permission="analytics:read">
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute permission="users:read">
                    <AllUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/staff"
                element={
                  <ProtectedRoute permission="users:write">
                    <StaffManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/forms"
                element={
                  <ProtectedRoute permission="forms:read">
                    <FormsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/forms/create"
                element={
                  <ProtectedRoute permission="forms:write">
                    <FormBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/forms/edit/:formId"
                element={
                  <ProtectedRoute permission="forms:write">
                    <FormBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/landing-editor"
                element={
                  <ProtectedRoute permission="settings:write">
                    <LandingPageEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/branding"
                element={
                  <ProtectedRoute permission="settings:write">
                    <BrandingSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/submissions"
                element={
                  <ProtectedRoute permission="forms:read">
                    <FormSubmissions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/permissions"
                element={
                  <ProtectedRoute permission="users:write">
                    <PermissionsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/referrals"
                element={
                  <ProtectedRoute permission="analytics:read">
                    <ReferralTracking />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </BrandingProvider>
    </AuthProvider>
  );
}

export default App;