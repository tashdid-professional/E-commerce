import { NextResponse } from 'next/server';
import { createReview, getReviewsByProduct, checkUserCanReview } from '../../../lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const reviews = await getReviewsByProduct(productId);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { productId, rating, comment } = await request.json();

    if (!productId || !rating) {
      return NextResponse.json({ error: 'Product ID and rating are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Check if user can review this product
    const eligibility = await checkUserCanReview(userId, productId);
    if (!eligibility.canReview) {
      return NextResponse.json({ error: eligibility.reason }, { status: 403 });
    }

    const review = await createReview({
      productId: parseInt(productId),
      userId,
      rating: parseInt(rating),
      comment: comment || ''
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
