'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        if (response.ok) {
          const orderData = await response.json();
          setOrder(orderData);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-4">Thank you for your purchase. Your order has been successfully placed.</p>
        <p className="text-sm text-gray-500">Order ID: #{order.id}</p>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
            <p className="text-gray-600">{order.customer}</p>
            <p className="text-gray-600">{order.email}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
            <p className="text-gray-600">Order Date: {new Date(order.date).toLocaleDateString()}</p>
            <p className="text-gray-600">Status: <span className="capitalize">{order.status}</span></p>
            <p className="text-gray-600">Total: ${order.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Items Ordered</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-600">Price: ${item.price.toFixed(2)} each</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-blue-900 mb-2">What&apos;s Next?</h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• You&apos;ll receive a confirmation email shortly</li>
          <li>• We&apos;ll send you shipping updates as your order progresses</li>
          <li>• Your order will be delivered within 3-5 business days</li>
          <li>• Contact us if you have any questions about your order</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="inline-block bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
