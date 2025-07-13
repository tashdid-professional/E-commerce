'use client';

import { useState, useEffect } from 'react';

export default function ReviewsList({ productId, reviews: initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews || []);

  const refreshReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (response.ok) {
        const updatedReviews = await response.json();
        setReviews(updatedReviews);
      }
    } catch (error) {
      console.error('Error refreshing reviews:', error);
    }
  };

  useEffect(() => {
    if (!initialReviews) {
      refreshReviews();
    }
  }, [productId, initialReviews]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Customer Reviews ({reviews.length})</h3>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-900">{review.user.name}</span>
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
            
            {review.comment && (
              <p className="text-gray-700 mt-2">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
