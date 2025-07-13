'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminReviews() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/auth');
        return;
      }
      fetchReviews();
    }
  }, [user, authLoading, router]);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error('Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    setActionLoading(reviewId);
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          action: 'approve'
        }),
      });

      if (response.ok) {
        // Update the review in the local state
        setReviews(reviews.map(review => 
          review.id === reviewId 
            ? { ...review, approved: true }
            : review
        ));
      } else {
        alert('Failed to approve review');
      }
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Error approving review');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setActionLoading(reviewId);
    try {
      const response = await fetch(`/api/admin/reviews?reviewId=${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the review from the local state
        setReviews(reviews.filter(review => review.id !== reviewId));
      } else {
        alert('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    } finally {
      setActionLoading(null);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const pendingReviews = reviews.filter(review => !review.approved);
  const approvedReviews = reviews.filter(review => review.approved);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Review Management</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Reviews</h3>
          <p className="text-3xl font-bold text-blue-600">{reviews.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Approval</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingReviews.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Approved</h3>
          <p className="text-3xl font-bold text-green-600">{approvedReviews.length}</p>
        </div>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pending Reviews ({pendingReviews.length})
          </h2>
          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <div key={review.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      By: {review.user.name} ({review.user.email})
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderStars(review.rating)}
                  </div>
                </div>

                {review.comment && (
                  <div className="mb-4">
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(review.id)}
                    disabled={actionLoading === review.id}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {actionLoading === review.id ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={actionLoading === review.id}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {actionLoading === review.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Reviews */}
      {approvedReviews.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Approved Reviews ({approvedReviews.length})
          </h2>
          <div className="space-y-4">
            {approvedReviews.map((review) => (
              <div key={review.id} className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      By: {review.user.name} ({review.user.email})
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-green-600 font-medium">Approved</span>
                  </div>
                </div>

                {review.comment && (
                  <div className="mb-4">
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={actionLoading === review.id}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {actionLoading === review.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No reviews yet.</p>
        </div>
      )}
    </div>
  );
}
