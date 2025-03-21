import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchStats, apiLoadingState } from '../lib/api';
import Card from '../components/Card';
import { FiCoffee, FiGrid, FiPlusCircle, FiTrendingUp, FiTag, FiLoader } from 'react-icons/fi';

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

  return (
    <div>
      <Head>
        <title>Dashboard - Cafe Admin</title>
      </Head>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="flex flex-col">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-blue-50 text-blue-700">
              <FiGrid className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Categories</h3>
              <div className="mt-1 flex items-baseline">
                {loading ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalCategories}</p>
                    <p className="ml-2 text-sm text-gray-600">
                      ({stats.activeCategories} active)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 self-end">
            <Link 
              href="/categories"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all categories →
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-green-50 text-green-700">
              <FiCoffee className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Menu Items</h3>
              <div className="mt-1 flex items-baseline">
                {loading ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalItems}</p>
                    <p className="ml-2 text-sm text-gray-600">
                      ({stats.activeItems} active)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 self-end">
            <Link 
              href="/items"
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              View all items →
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-purple-50 text-purple-700">
              <FiTag className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">New Items</h3>
              <div className="mt-1 flex items-baseline">
                {loading ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-semibold text-gray-900">{stats.newItems}</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 self-end">
            <Link 
              href="/items/new"
              className="text-sm font-medium text-purple-600 hover:text-purple-500"
            >
              Add new item →
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Quick Actions">
          <div className="space-y-4">
            <Link 
              href="/categories/new"
              className="flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <FiPlusCircle className="h-5 w-5 text-blue-500 mr-3" />
              <span>Add New Category</span>
            </Link>
            <Link 
              href="/items/new"
              className="flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <FiPlusCircle className="h-5 w-5 text-green-500 mr-3" />
              <span>Add New Menu Item</span>
            </Link>
          </div>
        </Card>

        <Card title="System Status">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">API Server</span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Database Connection</span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Limited
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Admin Dashboard</span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="pt-3 text-xs text-gray-500">
              <p>Note: Limited database functionality means the system is operating with fallback mechanisms enabled.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}