import { useState } from 'react';
import Toast from './components/Toast';
import StudentManagement from './pages/StudentManagement';
import './index.css';

/**
 * App.jsx - Root component
 * - Quản lý sidebar navigation
 * - Quản lý toast notifications toàn cục
 * - Render trang StudentManagement
 */

const NAV_ITEMS = [
  {
    id: 'students',
    label: 'Quản lý sinh viên',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

function App() {
  const [activePage, setActivePage] = useState('students');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Sidebar overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Thanh điều hướng">
        <div className="sidebar-logo">
          <h1>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5"
              style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }}>
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            Student Manager
          </h1>
          <span>Hệ thống quản lý sinh viên</span>
        </div>

        <nav className="sidebar-nav" aria-label="Menu chính">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => { setActivePage(item.id); closeSidebar(); }}
              aria-current={activePage === item.id ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>IT209 – Kiểm tra Session 12</p>
          <p style={{ marginTop: 4, opacity: 0.7 }}>
            API: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {/* Page Header */}
        <header className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Hamburger (mobile) */}
            <button
              className="hamburger"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Mở menu điều hướng"
              aria-expanded={sidebarOpen}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h2>Quản lý sinh viên</h2>
          </div>

          {/* API status indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--success)',
              display: 'inline-block',
              boxShadow: '0 0 0 2px var(--success-light)',
            }} />
            Backend: {import.meta.env.VITE_API_BASE_URL || 'localhost:8080'}
          </div>
        </header>

        {/* Page Body */}
        <div className="page-body">
          {activePage === 'students' && (
            <StudentManagement addToast={addToast} />
          )}
        </div>
      </main>

      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
