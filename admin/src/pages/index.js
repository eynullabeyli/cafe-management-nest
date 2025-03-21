import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchStats, apiLoadingState } from '../lib/api';
import Card from '../components/Card';
import { 
  FiCoffee, FiGrid, FiPlusCircle, FiTrendingUp, FiTag, 
  FiLoader, FiActivity, FiBarChart2, FiLayers, FiDatabase,
  FiTarget, FiStar, FiZap, FiShield, FiArrowUp, FiBox, FiLink
} from 'react-icons/fi';

export default function Dashboard() {
  // Key performance indicators stats
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
  const [activeKpi, setActiveKpi] = useState('overview');

  // Sample additional metrics for UI demonstration
  const systemHealth = {
    uptime: '99.8%',
    responseTime: '120ms',
    lastDeployment: '1 day ago'
  };

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
    
  // Function to display KPI indicator
  const getKpiClass = (value, threshold = 50) => {
    if (value >= threshold) return 'text-green-500';
    return 'text-yellow-500';
  };

  return (
    <div className="dashboard-container">
      <Head>
        <title>Dashboard - Cafe Admin</title>
      </Head>

      {/* Hero Section with Glass Morphism */}
      <div className="dashboard-hero bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-8 relative overflow-hidden">
        <div className="dashboard-hero-glass p-8 backdrop-blur-lg bg-white/20 text-white relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome to Cafe Dashboard</h1>
              <p className="text-indigo-100 max-w-2xl">
                Manage your menu items, categories, and monitor real-time statistics to optimize your digital menu.
              </p>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-3">
              <Link href="/items/new" className="fancy-button fancy-button-glass">
                <FiZap className="mr-2 h-5 w-5" />
                New Item
              </Link>
              <Link href="/categories/new" className="fancy-button fancy-button-white">
                <FiTarget className="mr-2 h-5 w-5" />
                New Category
              </Link>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-400/30 backdrop-blur-sm border border-red-300 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiShield className="h-5 w-5 text-red-100" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-white">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* KPI Selectors */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveKpi('overview')} 
              className={`transition-all px-4 py-2 rounded-full text-sm font-medium 
                ${activeKpi === 'overview' 
                  ? 'bg-white text-indigo-600 shadow-md' 
                  : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              <FiBarChart2 className="inline mr-2 h-4 w-4" />
              Overview
            </button>
            <button 
              onClick={() => setActiveKpi('items')} 
              className={`transition-all px-4 py-2 rounded-full text-sm font-medium 
                ${activeKpi === 'items' 
                  ? 'bg-white text-indigo-600 shadow-md' 
                  : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              <FiCoffee className="inline mr-2 h-4 w-4" />
              Menu Items
            </button>
            <button 
              onClick={() => setActiveKpi('categories')} 
              className={`transition-all px-4 py-2 rounded-full text-sm font-medium 
                ${activeKpi === 'categories' 
                  ? 'bg-white text-indigo-600 shadow-md' 
                  : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              <FiGrid className="inline mr-2 h-4 w-4" />
              Categories
            </button>
            <button 
              onClick={() => setActiveKpi('system')} 
              className={`transition-all px-4 py-2 rounded-full text-sm font-medium 
                ${activeKpi === 'system' 
                  ? 'bg-white text-indigo-600 shadow-md' 
                  : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              <FiActivity className="inline mr-2 h-4 w-4" />
              System
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Stats Cards with 3D Effect and Animated Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stats-card bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Menu Items</h3>
            <div className="p-3 bg-blue-400/30 rounded-full">
              <FiCoffee className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-4xl font-bold text-white">
                {loading ? (
                  <div className="h-10 w-20 bg-blue-400/30 animate-pulse rounded"></div>
                ) : (
                  stats.totalItems
                )}
              </div>
              <div className="mt-1 text-sm text-blue-100 flex items-center">
                <FiArrowUp className="mr-1 h-3 w-3" /> 
                <span>{itemActivePercent}% active</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-200">
                {stats.activeItems}
              </div>
              <div className="mt-1 text-xs text-blue-100">
                Active
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-blue-400/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${itemActivePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stats-card bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Categories</h3>
            <div className="p-3 bg-green-400/30 rounded-full">
              <FiLayers className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-4xl font-bold text-white">
                {loading ? (
                  <div className="h-10 w-20 bg-green-400/30 animate-pulse rounded"></div>
                ) : (
                  stats.totalCategories
                )}
              </div>
              <div className="mt-1 text-sm text-green-100 flex items-center">
                <FiArrowUp className="mr-1 h-3 w-3" /> 
                <span>{categoryActivePercent}% active</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-green-200">
                {stats.activeCategories}
              </div>
              <div className="mt-1 text-xs text-green-100">
                Active
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-green-400/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${categoryActivePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stats-card bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">New Products</h3>
            <div className="p-3 bg-purple-400/30 rounded-full">
              <FiStar className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-4xl font-bold text-white">
                {loading ? (
                  <div className="h-10 w-20 bg-purple-400/30 animate-pulse rounded"></div>
                ) : (
                  stats.newItems
                )}
              </div>
              <div className="mt-1 text-sm text-purple-100 flex items-center">
                <FiArrowUp className="mr-1 h-3 w-3" /> 
                <span>{newItemPercent}% of total</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-200">
                {stats.totalItems}
              </div>
              <div className="mt-1 text-xs text-purple-100">
                Total items
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-purple-400/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${newItemPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="feature-card bg-white rounded-xl p-1 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <FiZap className="mr-2 h-5 w-5" /> Quick Actions
            </h3>
          </div>
          
          <div className="p-5 space-y-3">
            <Link 
              href="/categories"
              className="flex items-center p-4 text-gray-700 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors duration-200 transform hover:scale-[1.02]"
            >
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white mr-4 shadow-md">
                <FiGrid className="h-6 w-6" />
              </div>
              <div>
                <span className="text-lg font-medium block">Categories</span>
                <span className="text-gray-500 text-sm">Organize your menu structure</span>
              </div>
              <FiArrowUp className="ml-auto transform rotate-45 text-blue-500 h-5 w-5" />
            </Link>
            
            <Link 
              href="/items"
              className="flex items-center p-4 text-gray-700 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors duration-200 transform hover:scale-[1.02]"
            >
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white mr-4 shadow-md">
                <FiCoffee className="h-6 w-6" />
              </div>
              <div>
                <span className="text-lg font-medium block">Menu Items</span>
                <span className="text-gray-500 text-sm">Manage your menu offerings</span>
              </div>
              <FiArrowUp className="ml-auto transform rotate-45 text-green-500 h-5 w-5" />
            </Link>
            
            <Link 
              href="/items/new"
              className="flex items-center p-4 text-gray-700 bg-gray-50 hover:bg-purple-50 rounded-lg transition-colors duration-200 transform hover:scale-[1.02]"
            >
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white mr-4 shadow-md">
                <FiPlusCircle className="h-6 w-6" />
              </div>
              <div>
                <span className="text-lg font-medium block">Add New Item</span>
                <span className="text-gray-500 text-sm">Create new menu products</span>
              </div>
              <FiArrowUp className="ml-auto transform rotate-45 text-purple-500 h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="feature-card bg-white rounded-xl p-1 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <FiActivity className="mr-2 h-5 w-5" /> System Status
            </h3>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mr-4">
                <FiActivity className="h-6 w-6" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">API Server</span>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center">
                    <span className="mr-1 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    Online
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Response time: {systemHealth.responseTime}
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg mr-4">
                <FiDatabase className="h-6 w-6" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">Database</span>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center">
                    <span className="mr-1 inline-block w-2 h-2 bg-yellow-500 rounded-full pulse-animation"></span>
                    Limited
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Using fallback mechanisms
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mr-4">
                <FiLink className="h-6 w-6" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">Uptime</span>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {systemHealth.uptime}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Last deployment: {systemHealth.lastDeployment}
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg text-xs text-indigo-700 shadow-inner">
              <div className="flex items-center">
                <FiShield className="mr-2 h-4 w-4" />
                <p className="font-medium">Note:</p>
              </div>
              <p className="mt-1 ml-6">
                Limited database functionality means the system is operating with fallback 
                mechanisms. Some features may use local storage or cached data. All changes 
                will be synchronized when connectivity is restored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}