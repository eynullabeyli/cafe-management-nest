import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FiHome, 
  FiMenu, 
  FiCoffee, 
  FiGrid, 
  FiSettings, 
  FiX,
  FiLogOut,
  FiLoader
} from 'react-icons/fi';
import { apiLoadingState } from '../lib/api';

const Layout = ({ children }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnyApiLoading, setIsAnyApiLoading] = useState(false);
  
  // Subscribe to API loading state
  useEffect(() => {
    const unsubscribe = apiLoadingState.subscribe(() => {
      setIsAnyApiLoading(apiLoadingState.isAnyLoading());
    });
    
    return () => unsubscribe();
  }, []);

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

  const NavLink = ({ item }) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    const [isLinkLoading, setIsLinkLoading] = useState(false);
    
    return (
      <Link
        href={item.disabled ? '#' : item.href}
        className={`nav-link ${active ? 'active' : ''} ${item.disabled ? 'disabled' : ''} ${isLinkLoading ? 'loading' : ''}`}
        onClick={(e) => {
          if (item.disabled) {
            e.preventDefault();
          } else {
            // Set loading state and clear it after animation completes
            setIsLinkLoading(true);
            setTimeout(() => setIsLinkLoading(false), 1000);
            
            if (isMobileMenuOpen) {
              setIsMobileMenuOpen(false);
            }
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
          textDecoration: 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {isLinkLoading && !active && (
          <div className="nav-link-loading">
            <FiLoader className="nav-link-spinner" />
          </div>
        )}
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
  };

  return (
    <div className="layout-container">
      {/* Global API loading indicator */}
      {isAnyApiLoading && (
        <div className="global-api-loading">
          <FiLoader className="global-api-spinner" />
        </div>
      )}
      
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <span className="mobile-logo">Cafe Admin</span>
          <button 
            className="mobile-close-button"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FiX style={{height: '1.5rem', width: '1.5rem'}} />
          </button>
        </div>
        <nav className="mobile-nav">
          {navigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
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
              {navigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
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
      <div className="mobile-nav-bar">
        <div className="mobile-nav-container">
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