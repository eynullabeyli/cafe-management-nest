import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchStats, apiLoadingState } from '../lib/api';
import Card from '../components/Card';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title,
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Doughnut, Pie, Bar } from 'react-chartjs-2';
import { 
  FiCoffee, FiGrid, FiPlusCircle, FiTrendingUp, FiTag, 
  FiLoader, FiActivity, FiBarChart2, FiLayers, FiDatabase,
  FiTarget, FiStar, FiZap, FiShield, FiArrowUp, FiBox, FiLink,
  FiCheckCircle, FiAlertTriangle, FiInfo, FiX
} from 'react-icons/fi';

// Register ChartJS components - including BarElement which is required for Bar charts
ChartJS.register(
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title,
  Tooltip, 
  Legend, 
  Filler
);

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

      {/* Main Header */}
      <div className="bg-white shadow-sm rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Cafe Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Overview of your menu system and its performance
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-3">
            <Link href="/items/new" className="btn-primary">
              <FiPlusCircle className="mr-2 h-5 w-5" />
              Add Menu Item
            </Link>
            <Link href="/categories/new" className="btn-secondary">
              <FiGrid className="mr-2 h-5 w-5" />
              Add Category
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="stat-card bg-white shadow-sm rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Items</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {loading ? <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div> : stats.totalItems}
              </h3>
            </div>
            <div className="rounded-full bg-blue-100 p-2">
              <FiCoffee className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="stat-card bg-white shadow-sm rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Items</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {loading ? <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div> : stats.activeItems}
              </h3>
            </div>
            <div className="rounded-full bg-green-100 p-2">
              <FiCheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="stat-card bg-white shadow-sm rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {loading ? <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div> : stats.totalCategories}
              </h3>
            </div>
            <div className="rounded-full bg-indigo-100 p-2">
              <FiLayers className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="stat-card bg-white shadow-sm rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">New Items</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {loading ? <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div> : stats.newItems}
              </h3>
            </div>
            <div className="rounded-full bg-purple-100 p-2">
              <FiStar className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Visualizations Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Menu Items Panel */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white shadow-sm rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Menu Items</h3>
            <Link href="/items" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              View All <FiArrowUp className="ml-1 h-4 w-4 transform rotate-45" />
            </Link>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-700">
              <span className="font-semibold">{stats.activeItems}</span> / {stats.totalItems} active
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {itemActivePercent}% active rate
            </div>
          </div>
          
          <div className="chart-container h-40 w-full">
            {!loading && (
              <Doughnut
                key="items-doughnut-chart"
                data={{
                  labels: ['Active Items', 'Inactive Items'],
                  datasets: [
                    {
                      data: [stats.activeItems, stats.totalItems - stats.activeItems],
                      backgroundColor: ['#4f46e5', '#e5e7eb'],
                      borderColor: ['#4338ca', '#d1d5db'],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: { boxWidth: 12, padding: 15, font: { size: 11 } }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return context.label + ': ' + context.raw + ' items';
                        }
                      }
                    }
                  },
                  cutout: '70%'
                }}
              />
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-indigo-600 mr-2"></span>
              <span className="text-sm text-gray-600">Active rate has increased by 5% this week</span>
            </div>
          </div>
        </div>

        {/* Categories Panel */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white shadow-sm rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
            <Link href="/categories" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              View All <FiArrowUp className="ml-1 h-4 w-4 transform rotate-45" />
            </Link>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-700">
              <span className="font-semibold">{stats.activeCategories}</span> / {stats.totalCategories} active
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {categoryActivePercent}% active rate
            </div>
          </div>
          
          <div className="chart-container h-40 w-full">
            {!loading && (
              <Pie
                key="categories-pie-chart"
                data={{
                  labels: ['Active Categories', 'Inactive Categories'],
                  datasets: [
                    {
                      data: [stats.activeCategories, stats.totalCategories - stats.activeCategories],
                      backgroundColor: ['#10b981', '#e5e7eb'],
                      borderColor: ['#059669', '#d1d5db'],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: { boxWidth: 12, padding: 15, font: { size: 11 } }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return context.label + ': ' + context.raw;
                        }
                      }
                    }
                  }
                }}
              />
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm text-gray-600">All categories are properly configured</span>
            </div>
          </div>
        </div>

        {/* New Products Panel */}
        <div className="col-span-12 lg:col-span-4 bg-white shadow-sm rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">New Products</h3>
            <div className="text-sm font-medium text-purple-600">
              {newItemPercent}% of total
            </div>
          </div>
          
          <div className="chart-container h-40 w-full">
            {!loading && (
              <Bar
                key="new-products-bar-chart"
                data={{
                  labels: ['Products'],
                  datasets: [
                    {
                      label: 'New Items',
                      data: [stats.newItems],
                      backgroundColor: '#8b5cf6',
                      borderColor: '#7c3aed',
                      borderWidth: 1,
                    },
                    {
                      label: 'Regular Items',
                      data: [stats.totalItems - stats.newItems],
                      backgroundColor: '#ddd6fe',
                      borderColor: '#c4b5fd',
                      borderWidth: 1,
                    }
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: { boxWidth: 12, padding: 15, font: { size: 11 } }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-purple-500 mr-2"></span>
              <span className="text-sm text-gray-600">{stats.newItems} new products added recently</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and System Status Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Access Panel */}
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="border-b border-gray-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href="/categories"
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition duration-200"
              >
                <div className="rounded-full bg-blue-100 p-3 mb-3">
                  <FiGrid className="h-6 w-6 text-blue-600" />
                </div>
                <span className="font-medium text-gray-800">Manage Categories</span>
              </Link>
              
              <Link 
                href="/items"
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition duration-200"
              >
                <div className="rounded-full bg-green-100 p-3 mb-3">
                  <FiCoffee className="h-6 w-6 text-green-600" />
                </div>
                <span className="font-medium text-gray-800">Manage Items</span>
              </Link>
              
              <Link 
                href="/items/new"
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition duration-200"
              >
                <div className="rounded-full bg-purple-100 p-3 mb-3">
                  <FiPlusCircle className="h-6 w-6 text-purple-600" />
                </div>
                <span className="font-medium text-gray-800">New Item</span>
              </Link>
              
              <Link 
                href="/categories/new"
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition duration-200"
              >
                <div className="rounded-full bg-indigo-100 p-3 mb-3">
                  <FiTarget className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="font-medium text-gray-800">New Category</span>
              </Link>
            </div>
          </div>
        </div>

        {/* System Status Panel */}
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="border-b border-gray-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-gray-800">System Status</h3>
          </div>
          
          <div className="p-5">
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="mr-4">
                  <div className="rounded-full bg-green-500 h-3 w-3"></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800">Admin Panel</span>
                    <span className="text-green-600 text-sm font-medium">Operational</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    All functions working properly
                  </div>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="mr-4">
                  <div className="rounded-full bg-green-500 h-3 w-3"></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800">API Server</span>
                    <span className="text-green-600 text-sm font-medium">Operational</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    All endpoints responding normally
                  </div>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="mr-4">
                  <div className="rounded-full bg-yellow-500 h-3 w-3 pulse-animation"></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800">Database</span>
                    <span className="text-yellow-600 text-sm font-medium">Limited</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Using fallback mechanisms
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-medium text-sm text-blue-700 mb-1 flex items-center">
                  <FiInfo className="mr-2 h-4 w-4" /> System Information
                </div>
                <p className="text-sm text-blue-600">
                  The system is operating with fallback database functionality. Your changes will be synchronized when database connectivity is fully restored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}