import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const Jobs = lazy(() => import('./pages/Jobs'));
const Profile = lazy(() => import('./pages/Profile'));
const DashboardCRM = lazy(() => import('./pages/DashboardCRM'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Blog = lazy(() => import('./pages/Blog'));
const Events = lazy(() => import('./pages/Events'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const Talent = lazy(() => import('./pages/Talent'));
const Insights = lazy(() => import('./pages/Insights'));
const Strategy = lazy(() => import('./pages/Strategy'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const SystemIntelligence = lazy(() => import('./pages/SystemIntelligence'));
const SupplyChainAnalytics = lazy(() => import('./pages/SupplyChainAnalytics'));
const ApplicationTracker = lazy(() => import('./pages/ApplicationTracker'));
const EmployerPricing = lazy(() => import('./pages/EmployerPricing'));
const StudentUpgrade = lazy(() => import('./pages/StudentUpgrade'));
const ReferralDashboard = lazy(() => import('./pages/ReferralDashboard'));
const SecurityCenter = lazy(() => import('./pages/SecurityCenter'));
const RoleGate = lazy(() => import('./components/RoleGate'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const StudentLayout = lazy(() => import('./components/StudentLayout'));
const EmployerOnboarding = lazy(() => import('./components/EmployerOnboarding'));

function PortalRedirect() {
  const storedUser = localStorage.getItem('authUser');

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);
    if (user?.role === 'admin' || user?.role === 'employer' || user?.role === 'recruiter') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/student/jobs" replace />;
  } catch {
    localStorage.removeItem('authUser');
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
}

/* Employer onboarding wrapper — shows the 3-step wizard on first login */
function AdminOnboardingGate({ children }) {
  const [showOnboarding, setShowOnboarding] = React.useState(() => {
    const user = JSON.parse(localStorage.getItem('authUser') || '{}');
    return user?.role === 'employer' && !localStorage.getItem('onboarding_done');
  });
  return (
    <>
      {children}
      {showOnboarding && (
        <EmployerOnboarding
          onComplete={() => {
            localStorage.setItem('onboarding_done', '1');
            setShowOnboarding(false);
          }}
          onDismiss={() => setShowOnboarding(false)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portal" element={<PortalRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user/:id" element={<PublicProfile />} />

          <Route element={<RoleGate allowedRoles={['admin', 'employer', 'recruiter']} />}>
            <Route path="/admin" element={<AdminOnboardingGate><AdminLayout /></AdminOnboardingGate>}>
              <Route path="dashboard" element={<DashboardCRM />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:slug" element={<ProductDetails />} />
              <Route path="talent" element={<Talent />} />
              <Route path="billing" element={<EmployerPricing />} />
              <Route path="strategy" element={<Strategy />} />
              <Route path="insights" element={<Insights />} />
              <Route path="system-intelligence" element={<SystemIntelligence />} />
              <Route path="supply-chain-analytics" element={<SupplyChainAnalytics />} />
              <Route path="security" element={<SecurityCenter />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>

          <Route element={<RoleGate allowedRoles={['student', 'candidate']} />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route path="jobs" element={<Jobs />} />
              <Route path="profile" element={<Profile />} />
              <Route path="applications" element={<ApplicationTracker />} />
              <Route path="pro" element={<StudentUpgrade />} />
              <Route path="referral" element={<ReferralDashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:slug" element={<ProductDetails />} />
              <Route path="security" element={<SecurityCenter />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:id" element={<Blog />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<Events />} />
              <Route index element={<Navigate to="jobs" replace />} />
            </Route>
          </Route>

          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/crm" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/talent" element={<Navigate to="/admin/talent" replace />} />
          <Route path="/jobs" element={<Navigate to="/student/jobs" replace />} />
          <Route path="/profile" element={<Navigate to="/student/profile" replace />} />
          <Route path="/blog" element={<Navigate to="/student/blog" replace />} />
          <Route path="/blog/:id" element={<Navigate to="/student/blog/:id" replace />} />
          <Route path="/events" element={<Navigate to="/student/events" replace />} />
          <Route path="/events/:id" element={<Navigate to="/student/events/:id" replace />} />
          <Route path="/products" element={<Navigate to="/student/products" replace />} />
          <Route path="/products/:slug" element={<Navigate to="/student/products" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;