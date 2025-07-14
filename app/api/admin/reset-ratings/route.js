import { NextResponse } from 'next/server';
import { resetAllProductRatings } from '../../../../lib/db.js';

export async function POST() {
  try {
    const result = await resetAllProductRatings();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error resetting ratings:', error);
    return NextResponse.json({ error: 'Failed to reset ratings' }, { status: 500 });
  }
}
