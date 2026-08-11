import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useHealth } from '../context/HealthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Pill,
  Calendar,
  ShieldAlert,
  BarChart3,
  User,
  Settings as SettingsIcon,
  Bot,
  Activity,
  Menu,
  X,
  LogOut,
  Search,
  Sun,
  Moon
} from 'lucide-react';
import './layouts.css';

export const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, state, toggleTheme } = useHealth();
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');

  // Guard: If not authenticated, immediately redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const isDarkMode = state.userSettings?.theme === 'dark';

  const menuItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/app/members', label: 'Family Members', icon: <Users size={20} /> },
    { path: '/app/records', label: 'Health Vault', icon: <FileText size={20} /> },
    { path: '/app/medicine', label: 'Medicines', icon: <Pill size={20} /> },
    { path: '/app/emergency', label: 'Emergency SOS', icon: <ShieldAlert size={20} /> },
    { path: '/app/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { path: '/app/metrics', label: 'Vitals & Metrics', icon: <Activity size={20} /> },
    { path: '/app/ai', label: 'AI Assistant', icon: <Bot size={20} /> },
    { path: '/app/profile', label: 'My Profile', icon: <User size={20} /> },
    { path: '/app/settings', label: 'Settings', icon: <SettingsIcon size={20} /> }
  ];

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login', { replace: true });
  };

  // Live Search Filtering Logic
  const getSearchResults = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results = [];

    // 1. Match Navigation Pages
    menuItems.forEach(item => {
      if (item.label.toLowerCase().includes(q)) {
        results.push({
          title: item.label,
          type: 'App Navigation Page',
          icon: '🔗',
          path: item.path
        });
      }
    });

    // 2. Match Family Members
    (state.familyMembers || []).forEach(mem => {
      const name = mem.name || '';
      if (name.toLowerCase().includes(q)) {
        results.push({
          title: name,
          type: `Family Member (${mem.relationship || 'Member'})`,
          icon: '👤',
          path: '/app/members'
        });
      }
    });

    // 3. Match Medicines
    (state.medicines || []).forEach(med => {
      const name = med.medicineName || med.name || '';
      if (name.toLowerCase().includes(q)) {
        results.push({
          title: name,
          type: `Medicine Inventory (${med.strength || med.dosage || 'Prescription'})`,
          icon: '💊',
          path: '/app/medicine'
        });
      }
    });

    // 4. Match Health Records
    (state.records || []).forEach(rec => {
      const title = rec.title || rec.fileName || '';
      if (title.toLowerCase().includes(q)) {
        results.push({
          title: title,
          type: `Health Vault Record (${rec.category || 'Document'})`,
          icon: '📄',
          path: '/app/records'
        });
      }
    });

    return results.slice(0, 8);
  };

  const searchResults = getSearchResults();

  return (
    <div className="layout-root">
      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Navigation">
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" onClick={() => navigate('/app/dashboard')}>
          <div className="logo-badge">🏥</div>
          <div className="logo-text">
            <h2>CareCircle</h2>
            <span className="logo-sub">Smart Family Health</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/app/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile" onClick={() => navigate('/app/profile')}>
            <span className="avatar-icon">{user?.photo || '👨‍💼'}</span>
            <div className="user-info">
              <p className="user-name">{user?.name || 'User'}</p>
              <p className="user-role">{user?.role || 'Administrator'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="layout-main-wrapper">
        <header className="top-header">
          <div className="search-bar-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search records, members, medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchResults.length > 0) {
                  navigate(searchResults[0].path);
                  setSearchQuery('');
                }
              }}
              className="top-search-input"
            />

            {searchQuery.trim() && (
              <div className="top-search-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="search-result-item"
                      onClick={() => {
                        navigate(item.path);
                        setSearchQuery('');
                      }}
                    >
                      <span className="search-result-icon">{item.icon}</span>
                      <div className="search-result-text">
                        <p className="search-result-title">{item.title}</p>
                        <span className="search-result-type">{item.type}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-no-results">No matching records, members, or medicines found</div>
                )}
              </div>
            )}
          </div>

          <div className="header-actions">
            {/* Header Dark Mode Toggle Button */}
            <button
              className="header-icon-btn theme-toggle-btn"
              onClick={toggleTheme}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#38bdf8" />}
            </button>

            <button
              className="header-icon-btn emergency-quick-btn"
              onClick={() => navigate('/app/emergency')}
              title="Emergency SOS"
            >
              <ShieldAlert size={20} color="#ef4444" />
            </button>

            <div className="header-user-avatar" onClick={() => navigate('/app/profile')}>
              <span>{user?.photo || '👨‍💼'}</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};