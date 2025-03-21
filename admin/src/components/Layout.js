import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FiHome, 
  FiMenu, 
  FiCoffee, 
  FiGrid, 
  FiSettings, 
  FiX,
  FiLogOut
} from 'react-icons/fi';

const Layout = ({ children }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Categories', href: '/categories', icon: FiGrid },
    { name: 'Menu Items', href: '/items', icon: FiCoffee },
    { name: 'Settings', href: '/settings', icon: FiSettings, disabled: true }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: 'var(--gray-50)'}}>
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--gray-800)',
            opacity: 0.75,
            zIndex: 20
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '16rem',
        backgroundColor: 'white',
        zIndex: 30,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 300ms ease-in-out',
        display: 'block'
      }}>
        <div className="flex items-center justify-between p-4" style={{borderBottom: '1px solid var(--gray-200)'}}>
          <span style={{fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-color)'}}>Cafe Admin</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{padding: '0.5rem', borderRadius: '0.375rem', color: 'var(--gray-400)'}}
          >
            <FiX style={{height: '1.5rem', width: '1.5rem'}} />
          </button>
        </div>
        <nav style={{marginTop: '1rem', padding: '0 0.5rem'}}>
          {navigation.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderRadius: '0.375rem',
                  backgroundColor: active ? 'var(--primary-color)' : 'transparent',
                  color: active ? 'white' : 'var(--gray-600)',
                  opacity: item.disabled ? 0.5 : 1,
                  cursor: item.disabled ? 'default' : 'pointer',
                  marginBottom: '0.25rem',
                  textDecoration: 'none'
                }}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                <Icon 
                  style={{
                    marginRight: '0.75rem',
                    height: '1.25rem',
                    width: '1.25rem',
                    color: active ? 'white' : 'var(--gray-400)'
                  }} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Static sidebar for desktop */}
      <div className="sidebar-desktop">
        <div className="sidebar-container">
          <div className="sidebar-header">
            <span className="logo">Cafe Admin</span>
          </div>
          <div className="sidebar-content">
            <nav className="sidebar-nav">
              {navigation.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.disabled ? '#' : item.href}
                    className={`nav-item ${active ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: 500, 
                      borderRadius: '0.375rem',
                      backgroundColor: active ? 'var(--primary-color)' : 'transparent',
                      color: active ? 'white' : 'var(--gray-600)',
                      opacity: item.disabled ? 0.5 : 1,
                      cursor: item.disabled ? 'default' : 'pointer',
                      marginBottom: '0.25rem',
                      textDecoration: 'none'
                    }}
                  >
                    <Icon 
                      style={{
                        marginRight: '0.75rem',
                        height: '1.25rem',
                        width: '1.25rem',
                        color: active ? 'white' : 'var(--gray-400)'
                      }} 
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="sidebar-footer">
              <button className="logout-button">
                <FiLogOut style={{marginRight: '0.75rem', height: '1.25rem', width: '1.25rem', color: 'var(--gray-400)'}} />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile top nav */}
      <div className="mobile-nav">
        <div className="mobile-nav-container">
          <div className="mobile-nav-button-container">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <FiMenu style={{height: '1.5rem', width: '1.5rem'}} />
            </button>
            <span className="mobile-logo">Cafe Admin</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <main className="main-container">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;