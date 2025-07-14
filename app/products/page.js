import { Suspense } from 'react';
import ProductsContent from './ProductsContent';
import { getProducts, getCategories } from '../../lib/db';

function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    </div>
  );
}

export default async function ProductsPage({ searchParams }) {
  // Fetch data on server side
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent 
        initialProducts={products} 
        initialCategories={categories}
        searchParams={searchParams}
      />
    </Suspense>
  );
}