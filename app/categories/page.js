import Link from 'next/link';
import { getCategories, getProductsByCategory } from '../../lib/db';

export default async function CategoriesPage() {
  const categories = await getCategories();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h1>
        <p className="text-gray-600">Browse our products by category to find exactly what you're looking for.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => {
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.name}`}
              className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src="/api/placeholder/400/200"
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">
                  {category.count} {category.count === 1 ? 'product' : 'products'} available
                </p>
                <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                  <span className="text-sm font-medium">Shop Now</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Popular Categories Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={`popular-${category.id}`}
              href={`/products?category=${category.name}`}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg text-center hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              <h3 className="font-semibold">{category.name}</h3>
              <p className="text-sm opacity-90">{category.count} items</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
