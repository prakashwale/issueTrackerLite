import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import AddIssuePage from './components/AddIssuePage';
import ViewIssuesPage from './components/ViewIssuesPage';
import IssueDetailsPage from './components/IssueDetailsPage';
import DashboardPage from './components/DashboardPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Logout from './components/Logout';
import RecreationZone from './components/RecreationZone';
import PrivateRoute from './components/PrivateRoute';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

const Layout = () => {
  const location = useLocation();
  const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="app-container">
      <motion.nav 
        className="navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="nav-content">
          <motion.div 
            className="nav-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              IssueTracker Pro
            </Link>
          </motion.div>
          
          {/* Hamburger Menu Button */}
          <button 
            className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link to="/add-issue" className={`nav-link ${location.pathname === '/add-issue' ? 'active' : ''}`} onClick={closeMenu}>
                    Add Issue
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link to="/issues" className={`nav-link ${location.pathname === '/issues' ? 'active' : ''}`} onClick={closeMenu}>
                    View Issues
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={closeMenu}>
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link to="/recreation" className={`nav-link ${location.pathname === '/recreation' ? 'active' : ''}`} onClick={closeMenu}>
                    Recreation
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Logout />
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`} onClick={closeMenu}>
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link to="/signup" className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`} onClick={closeMenu}>
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <button className="mobile-nav-close" onClick={closeMenu}>
            ×
          </button>
        </div>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/add-issue" className={`nav-link ${location.pathname === '/add-issue' ? 'active' : ''}`} onClick={closeMenu}>
                Add Issue
              </Link>
              <Link to="/issues" className={`nav-link ${location.pathname === '/issues' ? 'active' : ''}`} onClick={closeMenu}>
                View Issues
              </Link>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={closeMenu}>
                Dashboard
              </Link>
              <Link to="/recreation" className={`nav-link ${location.pathname === '/recreation' ? 'active' : ''}`} onClick={closeMenu}>
                Recreation
              </Link>
              <Logout />
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`} onClick={closeMenu}>
                Login
              </Link>
              <Link to="/signup" className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`} onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Menu Overlay */}
      <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={location.pathname}
          className="content-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="add-issue" element={
            <PrivateRoute>
              <AddIssuePage />
            </PrivateRoute>
          } />
          <Route path="issues" element={
            <PrivateRoute>
              <ViewIssuesPage />
            </PrivateRoute>
          } />
          <Route path="issue/:id" element={
            <PrivateRoute>
              <IssueDetailsPage />
            </PrivateRoute>
          } />
          <Route path="dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
          <Route path="recreation" element={
            <PrivateRoute>
              <RecreationZone />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;