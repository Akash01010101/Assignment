import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import PageContainer from './components/layout/PageContainer';
import LandingPage from './pages/LandingPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminEventSeatsPage from './pages/admin/AdminEventSeatsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminRoute from './components/auth/AdminRoute';
import BusinessAccountPage from './pages/BusinessAccountPage';

import AdminBusinessAccountsPage from './pages/admin/AdminBusinessAccountsPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('eventBooking_auth');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PageContainer><LoginPage /></PageContainer>} />
            <Route path="/register" element={<PageContainer><RegisterPage /></PageContainer>} />
            <Route path="/business-account" element={<PageContainer><BusinessAccountPage /></PageContainer>} />

            {/* Protected */}
            <Route path="/events" element={<ProtectedRoute><PageContainer><EventsPage /></PageContainer></ProtectedRoute>} />
            <Route path="/events/:id" element={<ProtectedRoute><PageContainer><EventDetailPage /></PageContainer></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><PageContainer><MyBookingsPage /></PageContainer></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><PageContainer><AdminDashboardPage /></PageContainer></AdminRoute>} />
            <Route path="/admin/events" element={<AdminRoute><PageContainer><AdminEventsPage /></PageContainer></AdminRoute>} />
            <Route path="/admin/events/:id/seats" element={<AdminRoute><PageContainer><AdminEventSeatsPage /></PageContainer></AdminRoute>} />
            <Route path="/admin/bookings" element={<AdminRoute><PageContainer><AdminBookingsPage /></PageContainer></AdminRoute>} />
            <Route path="/admin/businesses" element={<AdminRoute><PageContainer><AdminBusinessAccountsPage /></PageContainer></AdminRoute>} />
          </Routes>
        </AnimatePresence>
      </Router>
    </AuthProvider>
  );
}

export default App;
