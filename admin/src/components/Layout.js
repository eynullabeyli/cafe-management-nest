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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-75 z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white z-30 shadow-xl transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}>
        <div className="flex items-center justify-between px-4 py-6 border-b">
          <span className="text-lg font-semibold text-primary">Cafe Admin</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-4 px-2 space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-md
                  ${active ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}
                  ${item.disabled ? 'opacity-50 cursor-default' : ''}
                `}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                <Icon 
                  className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-400'}`} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white shadow-lg">
          <div className="flex items-center h-16 px-6 border-b">
            <span className="text-lg font-bold text-primary">Cafe Admin</span>
          </div>
          <div className="flex-1 flex flex-col mt-6 px-3 overflow-y-auto">
            <nav className="flex-1 space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.disabled ? '#' : item.href}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-md
                      ${active ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}
                      ${item.disabled ? 'opacity-50 cursor-default' : ''}
                    `}
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Icon 
                      className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-400'}`} 
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-6 pb-6 border-t">
              <button
                className="mt-6 flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 w-full"
              >
                <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile top nav */}
      <div className="md:hidden bg-white border-b shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <span className="ml-3 text-lg font-semibold text-primary">Cafe Admin</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;