import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { path } = await request.json();
    
    // Revalidate the homepage when products are updated
    revalidatePath('/');
    
    // Also revalidate products pages
    revalidatePath('/products');
    
    // If a specific path is provided, revalidate it too
    if (path) {
      revalidatePath(path);
    }

    return NextResponse.json({ 
      revalidated: true, 
      message: 'Cache revalidated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate cache' }, 
      { status: 500 }
    );
  }
}
