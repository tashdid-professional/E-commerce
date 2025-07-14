import { NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '../../../../lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const response = NextResponse.json(product);
    
    // Add caching headers for individual products
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const productData = await request.json();
    const product = await updateProduct(id, productData);
    
    // Revalidate pages that show this product
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${id}`);
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteProduct(id);
    
    // Revalidate pages when product is deleted
    revalidatePath('/');
    revalidatePath('/products');
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
