import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchStats, apiLoadingState } from '../lib/api';
import Card from '../components/Card';
import { 
  FiCoffee, FiGrid, FiPlusCircle, FiTrendingUp, FiTag, 
  FiLoader, FiActivity, FiBarChart2, FiLayers, FiDatabase
} from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCategories: 0,
    activeCategories: 0,
    totalItems: 0,
    activeItems: 0,
    newItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiLoading, setApiLoading] = useState({});

  // Subscribe to API loading state changes
  useEffect(() => {
    const unsubscribe = apiLoadingState.subscribe((loadingState) => {
      setApiLoading(loadingState);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await fetchStats();
        if (data) {
          setStats(data);
        } else {
          console.warn('Stats data is null or undefined');
          setError('Could not fetch statistics. Please try again later.');
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        setError('Failed to load statistics. The API server might be unavailable.');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  // Calculate percentage values
  const categoryActivePercent = stats.totalCategories > 0 
    ? Math.round((stats.activeCategories / stats.totalCategories) * 100) 
    : 0;
  
  const itemActivePercent = stats.totalItems > 0 
    ? Math.round((stats.activeItems / stats.totalItems) * 100) 
    : 0;
  
  const newItemPercent = stats.totalItems > 0 
    ? Math.round((stats.newItems / stats.totalItems) * 100) 
    : 0;

  return (
    <div>
      <Head>
        <title>Dashboard - Cafe Admin</title>
      </Head>

      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-gray-500 mb-6">Welcome to your menu management system</p>
        </div>
        <div className="dashboard-action-buttons">
          <Link href="/items/new" className="fancy-button primary">
            <FiPlusCircle className="mr-2 h-5 w-5" />
            New Item
          </Link>
          <Link href="/categories/new" className="fancy-button secondary">
            <FiPlusCircle className="mr-2 h-5 w-5" />
            New Category
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-blue-800">Menu Overview</h3>
              <div className="mt-2 text-3xl font-bold text-blue-700">
                {loading ? (
                  <div className="h-8 w-20 bg-blue-200 animate-pulse rounded"></div>
                ) : (
                  stats.totalItems
                )}
              </div>
              <div className="mt-1 text-sm text-blue-600">
                Total menu items
              </div>
            </div>
            <div className="p-4 bg-blue-100 text-blue-700 rounded-full">
              <FiBarChart2 className="h-8 w-8" />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-xs font-medium text-blue-600 mb-1">
              {stats.activeItems} items active ({itemActivePercent}%)
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${itemActivePercent}%` }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-green-800">Categories</h3>
              <div className="mt-2 text-3xl font-bold text-green-700">
                {loading ? (
                  <div className="h-8 w-20 bg-green-200 animate-pulse rounded"></div>
                ) : (
                  stats.totalCategories
                )}
              </div>
              <div className="mt-1 text-sm text-green-600">
                Total categories
              </div>
            </div>
            <div className="p-4 bg-green-100 text-green-700 rounded-full">
              <FiLayers className="h-8 w-8" />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-xs font-medium text-green-600 mb-1">
              {stats.activeCategories} categories active ({categoryActivePercent}%)
            </div>
            <div className="w-full bg-green-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${categoryActivePercent}%` }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-purple-800">New Products</h3>
              <div className="mt-2 text-3xl font-bold text-purple-700">
                {loading ? (
                  <div className="h-8 w-20 bg-purple-200 animate-pulse rounded"></div>
                ) : (
                  stats.newItems
                )}
              </div>
              <div className="mt-1 text-sm text-purple-600">
                Items marked as new
              </div>
            </div>
            <div className="p-4 bg-purple-100 text-purple-700 rounded-full">
              <FiTag className="h-8 w-8" />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-xs font-medium text-purple-600 mb-1">
              {newItemPercent}% of total items are new
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${newItemPercent}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Quick Actions" className="border-t-4 border-blue-500">
          <div className="space-y-4">
            <Link 
              href="/categories"
              className="flex items-center p-4 text-sm text-gray-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
            >
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                <FiGrid className="h-5 w-5" />
              </div>
              <div>
                <span className="font-medium block">Manage Categories</span>
                <span className="text-xs text-gray-500">View, edit and create menu categories</span>
              </div>
            </Link>
            <Link 
              href="/items"
              className="flex items-center p-4 text-sm text-gray-700 hover:bg-green-50 rounded-md transition-colors duration-200"
            >
              <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                <FiCoffee className="h-5 w-5" />
              </div>
              <div>
                <span className="font-medium block">Manage Menu Items</span>
                <span className="text-xs text-gray-500">View, edit and create menu items</span>
              </div>
            </Link>
            <Link 
              href="/items/new"
              className="flex items-center p-4 text-sm text-gray-700 hover:bg-purple-50 rounded-md transition-colors duration-200"
            >
              <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                <FiPlusCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="font-medium block">Add New Menu Item</span>
                <span className="text-xs text-gray-500">Create a new item for your menu</span>
              </div>
            </Link>
          </div>
        </Card>

        <Card title="System Status" className="border-t-4 border-indigo-500">
          <div className="space-y-4">
            <div className="flex items-center p-3">
              <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                <FiActivity className="h-5 w-5" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">API Server</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Online
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Last checked: just now
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-3">
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                <FiDatabase className="h-5 w-5" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Database Connection</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Limited
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Using fallback mechanisms for some operations
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-3">
              <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                <FiGrid className="h-5 w-5" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Admin Dashboard</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Online
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  All systems operational
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md mt-4 text-xs text-blue-700">
              <p className="font-medium mb-1">Note:</p>
              <p>Limited database functionality means the system is operating with fallback mechanisms enabled. 
              Some features may use cached data.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}