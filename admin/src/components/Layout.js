import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiLayers, FiMenu, FiShoppingBag } from 'react-icons/fi';

const Layout = ({ children }) => {
  const router = useRouter();
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <FiHome size={20} /> },
    { name: 'Categories', path: '/categories', icon: <FiLayers size={20} /> },
    { name: 'Items', path: '/items', icon: <FiShoppingBag size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center space-x-2">
          <FiMenu size={24} className="text-primary" />
          <h1 className="text-xl font-bold">Cafe Admin</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className="mb-1 px-2">
                <Link href={item.path}>
                  <a
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                      router.pathname === item.path
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">© 2025 Cafe Management</p>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-card border-b border-gray-200 md:hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiMenu size={24} className="text-primary" />
              <h1 className="text-xl font-bold">Cafe Admin</h1>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;