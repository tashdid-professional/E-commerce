'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const auth = useAuth();
  
  // Defensive check for auth context
  if (!auth) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-600">Loading authentication...</p>
      </div>
    );
  }

  const { user } = auth;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: parseInt(productId),
          rating,
          comment: comment.trim()
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Review submitted successfully! It will be visible after admin approval.');
        setRating(0);
        setComment('');
        if (onReviewSubmitted) onReviewSubmitted();
      } else {
        alert(result.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-600">Please log in to write a review.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-2xl ${
                  (hoveredRating || rating) >= star
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comment (optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share your thoughts about this product..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || rating === 0}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
