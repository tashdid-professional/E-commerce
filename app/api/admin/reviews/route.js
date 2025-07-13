import { NextResponse } from 'next/server';
import { getAllReviews, approveReview, deleteReview } from '../../../../lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');

  if (!token) {
    throw new Error('Authentication required');
  }

  const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
  if (decoded.role !== 'admin') {
    throw new Error('Admin access required');
  }

  return decoded;
}

export async function GET() {
  try {
    await checkAdminAuth();
    const reviews = await getAllReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PATCH(request) {
  try {
    await checkAdminAuth();
    const { reviewId, action } = await request.json();

    if (action === 'approve') {
      const review = await approveReview(reviewId);
      return NextResponse.json(review);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await checkAdminAuth();
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const review = await deleteReview(reviewId);
    return NextResponse.json(review);
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
