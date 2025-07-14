import { getProductById } from '../../../lib/db';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }) {
  const { id } = await params;
  
  // Fetch product data on the server
  const product = await getProductById(id);
  
  if (!product) {
    notFound();
  }

  return <ProductDetailClient initialProduct={product} />;
}
