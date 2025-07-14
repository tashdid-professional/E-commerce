import { NextResponse } from 'next/server';
import { getCategories, createCategory } from '../../../lib/db';

export async function GET() {
  try {
    const categories = await getCategories();
    const response = NextResponse.json(categories);
    
    // Add longer caching for categories since they change less frequently
    response.headers.set('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const categoryData = await request.json();
    const category = await createCategory(categoryData);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
