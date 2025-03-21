import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Card from '../components/Card';
import Alert from '../components/Alert';
import { fetchCategories, fetchItems } from '../lib/api';
import { FiBox, FiLayers, FiShoppingBag, FiPlus } from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    items: 0,
    activeItems: 0,
    newItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        
        // Fetch categories and items
        const [categories, items] = await Promise.all([
          fetchCategories(),
          fetchItems()
        ]);
        
        // Calculate statistics
        const activeItems = items.filter(item => item.isActive).length;
        const newItems = items.filter(item => item.isNew).length;
        
        setStats({
          categories: categories.length,
          items: items.length,
          activeItems,
          newItems,
        });
        
        setError(null);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        setError('Failed to load dashboard statistics. Please try again later.');
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
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your menu management</p>
      </div>
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-primary">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <FiLayers className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? '...' : stats.categories}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="border-l-4 border-secondary">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 mr-4">
              <FiShoppingBag className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? '...' : stats.items}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="border-l-4 border-success">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <FiBox className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Items</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? '...' : stats.activeItems}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="border-l-4 border-warning">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <FiBox className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">New Items</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? '...' : stats.newItems}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Quick Actions">
          <div className="space-y-3">
            <Link href="/categories/new">
              <a className="flex items-center p-3 bg-blue-50 text-primary rounded-md hover:bg-blue-100 transition-colors">
                <FiPlus className="mr-2" /> Add New Category
              </a>
            </Link>
            <Link href="/items/new">
              <a className="flex items-center p-3 bg-orange-50 text-secondary rounded-md hover:bg-orange-100 transition-colors">
                <FiPlus className="mr-2" /> Add New Item
              </a>
            </Link>
          </div>
        </Card>
        
        <Card title="Overview">
          <p className="text-gray-700">
            Welcome to your cafe menu management dashboard. From here you can manage your menu categories and items.
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Active Items:</span>
              <span className="font-medium">
                {loading ? '...' : `${stats.activeItems} of ${stats.items}`}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-success" 
                style={{ 
                  width: `${loading ? 0 : (stats.items > 0 ? (stats.activeItems / stats.items) * 100 : 0)}%` 
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}