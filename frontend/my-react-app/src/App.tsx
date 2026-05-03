import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ManageBuses from './pages/ManageBuses';
import ManageRoutes from './pages/ManageRoutes';
import AllBookings from './pages/AllBookings';
import AdminRegister from './pages/AdminRegister';
import AdminLogin from './pages/AdminLogin';
import './App.css';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <Link to="/" className="logo">BusBook</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <Link to="/my-bookings">My Bookings</Link>
            <button onClick={logout}>Logout ({user.name})</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/register-secret-access" element={<AdminRegister />} />
          <Route path="/admin/login-secret-access" element={<AdminLogin />} />
          
          {/* User Routes */}
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/buses" element={
            <ProtectedRoute role="admin">
              <ManageBuses />
            </ProtectedRoute>
          } />
          <Route path="/admin/routes" element={
            <ProtectedRoute role="admin">
              <ManageRoutes />
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute role="admin">
              <AllBookings />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
