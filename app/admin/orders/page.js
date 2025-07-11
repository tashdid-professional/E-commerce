'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setOrders(orders.filter(order => order.id !== orderId));
        }
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-8">Orders</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-8">Orders ({orders.length})</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-8 bg-white rounded shadow">
          <p className="text-gray-600 mb-4">No orders found</p>
          <Link
            href="/admin"
            className="inline-block text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded shadow overflow-x-auto mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Order #</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Items</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-3">#{order.id}</td>
                    <td className="p-3">{order.customer}</td>
                    <td className="p-3">{order.email}</td>
                    <td className="p-3">{order.items.length} items</td>
                    <td className="p-3">${order.total.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/admin" className="inline-block text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </>
      )}
    </div>
  );
}
