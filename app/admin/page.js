'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalReviews: 0,
    pendingReviews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!isAdmin()) {
      router.push('/');
      return;
    }

    fetchStats();
  }, [user, router, isAdmin]);

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes, ordersRes, usersRes, reviewsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/orders'),
        fetch('/api/users'),
        fetch('/api/admin/reviews')
      ]);

      const [products, categories, orders, users, reviews] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        ordersRes.json(),
        usersRes.json(),
        reviewsRes.json()
      ]);

      const pendingReviews = reviews.filter(review => !review.approved);

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalReviews: reviews.length,
        pendingReviews: pendingReviews.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isAdmin()) {
    return (
      <div className="max-w-md mx-auto mt-24 bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Access Denied</h1>
        <p className="text-center text-gray-600 mb-4">
          You need admin privileges to access this page.
        </p>
        <Link
          href="/"
          className="block w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 text-center"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">
            {loading ? '...' : stats.totalProducts}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Categories</h3>
          <p className="text-3xl font-bold text-green-600">
            {loading ? '...' : stats.totalCategories}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {loading ? '...' : stats.totalOrders}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-purple-600">
            {loading ? '...' : stats.totalUsers}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Reviews</h3>
          <p className="text-3xl font-bold text-orange-600">
            {loading ? '...' : stats.totalReviews}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Reviews</h3>
          <p className="text-3xl font-bold text-red-600">
            {loading ? '...' : stats.pendingReviews}
          </p>
        </div>
      </div>

      {/* Management Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/products" className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg text-center shadow transition-colors">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
          <p className="text-gray-600">Add, edit, or remove products</p>
        </Link>

        <Link href="/admin/categories" className="bg-green-50 hover:bg-green-100 p-6 rounded-lg text-center shadow transition-colors">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Manage Categories</h2>
          <p className="text-gray-600">Add, edit, or remove categories</p>
        </Link>

        <Link href="/admin/orders" className="bg-yellow-50 hover:bg-yellow-100 p-6 rounded-lg text-center shadow transition-colors">
          <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">View Orders</h2>
          <p className="text-gray-600">See and manage customer orders</p>
        </Link>

        <Link href="/admin/reviews" className="bg-orange-50 hover:bg-orange-100 p-6 rounded-lg text-center shadow transition-colors">
          <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Manage Reviews</h2>
          <p className="text-gray-600">Approve and manage customer reviews</p>
        </Link>

        <Link href="/admin/users" className="bg-purple-50 hover:bg-purple-100 p-6 rounded-lg text-center shadow transition-colors">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p className="text-gray-600">View and manage user accounts</p>
        </Link>
      </div>
    </div>
  );
}
