import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { fetchStats, apiLoadingState } from "../lib/api";
import Card from "../components/Card";
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
  Filler,
} from "chart.js";
import { Doughnut, Pie, Bar } from "react-chartjs-2";
import {
  FiCoffee,
  FiGrid,
  FiPlusCircle,
  FiTrendingUp,
  FiTag,
  FiLoader,
  FiActivity,
  FiBarChart2,
  FiLayers,
  FiDatabase,
  FiTarget,
  FiStar,
  FiZap,
  FiShield,
  FiArrowUp,
  FiBox,
  FiLink,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
  FiArrowRight,
} from "react-icons/fi";

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
  Filler,
);

export default function Dashboard() {
  // Key performance indicators stats
  const [stats, setStats] = useState({
    totalCategories: 0,
    activeCategories: 0,
    totalItems: 0,
    activeItems: 0,
    newItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiLoading, setApiLoading] = useState({});
  const [activeKpi, setActiveKpi] = useState("overview");

  // Sample additional metrics for UI demonstration
  const systemHealth = {
    uptime: "99.8%",
    responseTime: "120ms",
    lastDeployment: "1 day ago",
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
          console.warn("Stats data is null or undefined");
          setError("Could not fetch statistics. Please try again later.");
        }
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
        setError(
          "Failed to load statistics. The API server might be unavailable.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  // Calculate percentage values
  const categoryActivePercent =
    stats.totalCategories > 0
      ? Math.round((stats.activeCategories / stats.totalCategories) * 100)
      : 0;

  const itemActivePercent =
    stats.totalItems > 0
      ? Math.round((stats.activeItems / stats.totalItems) * 100)
      : 0;

  const newItemPercent =
    stats.totalItems > 0
      ? Math.round((stats.newItems / stats.totalItems) * 100)
      : 0;

  // Function to display KPI indicator
  const getKpiClass = (value, threshold = 50) => {
    if (value >= threshold) return "text-green-500";
    return "text-yellow-500";
  };

  return (
    <div className="dashboard-container">
      <Head>
        <title>Dashboard - Cafe Admin</title>
      </Head>

      {/* Main Header */}
      <div className="bg-white shadow-sm rounded-xl p-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cafe Dashboard</h1>
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
                {loading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  stats.totalItems
                )}
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
                {loading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  stats.activeItems
                )}
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
                {loading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  stats.totalCategories
                )}
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
                {loading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  stats.newItems
                )}
              </h3>
            </div>
            <div className="rounded-full bg-purple-100 p-2">
              <FiStar className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-gradient-to-r from-gray-50 to-white shadow-sm rounded-xl overflow-hidden mb-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
        <div className="py-4 px-5 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FiZap className="h-5 w-5 text-yellow-500 transition-transform duration-300 group-hover:scale-110" />
            <h3 className="text-base font-semibold text-gray-800 tracking-tight">
              Quick Actions
            </h3>
          </div>

          <div className="flex" style={{ gap: '0.75rem' }}>
            <Link
              href="/categories"
              className="action-button bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              <FiGrid className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
              <span>Categories</span>
            </Link>

            <Link
              href="/items"
              className="action-button bg-green-50 text-green-600 hover:bg-green-100 focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
            >
              <FiCoffee className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              <span>Items</span>
            </Link>

            <Link
              href="/items/new"
              className="action-button bg-purple-50 text-purple-600 hover:bg-purple-100 focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50"
            >
              <FiPlusCircle className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              <span>New Item</span>
            </Link>

            <Link
              href="/categories/new"
              className="action-button bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
            >
              <FiTarget className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              <span>New Category</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Data Visualizations Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
        {/* Menu Items Panel */}
        <div className="bg-white shadow-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Menu Items</h3>
            <Link
              href="/items"
              className="text-blue-600 text-xs font-medium flex items-center"
            >
              View <FiArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          <div className="flex items-center justify-between mb-2 text-xs">
            <div className="text-gray-700">
              <span className="font-semibold">{stats.activeItems}</span> /{" "}
              {stats.totalItems} active
            </div>
            <div className="text-gray-600 font-medium">
              {itemActivePercent}% active
            </div>
          </div>

          <div className="chart-container h-24 w-full">
            {!loading && (
              <Doughnut
                key="items-doughnut-chart"
                data={{
                  labels: ["Active", "Inactive"],
                  datasets: [
                    {
                      data: [
                        stats.activeItems,
                        stats.totalItems - stats.activeItems,
                      ],
                      backgroundColor: ["#4f46e5", "#e5e7eb"],
                      borderColor: ["#4338ca", "#d1d5db"],
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
                      position: "bottom",
                      labels: { boxWidth: 8, padding: 8, font: { size: 9 } },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return context.label + ": " + context.raw;
                        },
                      },
                    },
                  },
                  cutout: "70%",
                }}
              />
            )}
          </div>
        </div>

        {/* Categories Panel */}
        <div className="bg-white shadow-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Categories</h3>
            <Link
              href="/categories"
              className="text-blue-600 text-xs font-medium flex items-center"
            >
              View <FiArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          <div className="flex items-center justify-between mb-2 text-xs">
            <div className="text-gray-700">
              <span className="font-semibold">{stats.activeCategories}</span> /{" "}
              {stats.totalCategories} active
            </div>
            <div className="text-gray-600 font-medium">
              {categoryActivePercent}% active
            </div>
          </div>

          <div className="chart-container h-24 w-full">
            {!loading && (
              <Pie
                key="categories-pie-chart"
                data={{
                  labels: ["Active", "Inactive"],
                  datasets: [
                    {
                      data: [
                        stats.activeCategories,
                        stats.totalCategories - stats.activeCategories,
                      ],
                      backgroundColor: ["#10b981", "#e5e7eb"],
                      borderColor: ["#059669", "#d1d5db"],
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
                      position: "bottom",
                      labels: { boxWidth: 8, padding: 8, font: { size: 9 } },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return context.label + ": " + context.raw;
                        },
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* New Products Panel */}
        <div className="bg-white shadow-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">New Products</h3>
            <div className="text-xs font-medium text-purple-600">
              {newItemPercent}% of total
            </div>
          </div>

          <div className="chart-container h-24 w-full">
            {!loading && (
              <Bar
                key="new-products-bar-chart"
                data={{
                  labels: ["Products"],
                  datasets: [
                    {
                      label: "New",
                      data: [stats.newItems],
                      backgroundColor: "#8b5cf6",
                      borderColor: "#7c3aed",
                      borderWidth: 1,
                    },
                    {
                      label: "Regular",
                      data: [stats.totalItems - stats.newItems],
                      backgroundColor: "#ddd6fe",
                      borderColor: "#c4b5fd",
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
                      position: "bottom",
                      labels: { boxWidth: 8, padding: 8, font: { size: 9 } },
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { display: false },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                        font: { size: 8 },
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* System Status Panel */}
        <div className="bg-white shadow-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">System Status</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
              <div className="mr-2">
                <div className="rounded-full bg-green-500 h-2 w-2"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium text-xs text-gray-800">
                    Admin Panel
                  </span>
                  <span className="text-green-600 text-xs font-medium">
                    Online
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
              <div className="mr-2">
                <div className="rounded-full bg-green-500 h-2 w-2"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium text-xs text-gray-800">
                    API Server
                  </span>
                  <span className="text-green-600 text-xs font-medium">
                    Online
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
              <div className="mr-2">
                <div className="rounded-full bg-yellow-500 h-2 w-2 pulse-animation"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium text-xs text-gray-800">
                    Database
                  </span>
                  <span className="text-yellow-600 text-xs font-medium">
                    Limited
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-2 rounded-lg mt-2">
              <p className="text-xs text-blue-600">
                <FiInfo className="inline-block mr-1 h-3 w-3" /> Using fallback
                database
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
