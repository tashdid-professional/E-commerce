import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '../../../lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const products = await getProducts();
    const response = NextResponse.json(products);
    
    // Add caching headers
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const productData = await request.json();
    console.log('Received product data:', productData);
    const product = await createProduct(productData);
    
    // Revalidate pages that show products
    revalidatePath('/');
    revalidatePath('/products');
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
