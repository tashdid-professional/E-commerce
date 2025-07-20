import Image from "next/image";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import HeroCarousel from "../components/HeroCarousel";
import { getFeaturedProducts } from "../lib/db";

// Enable ISR - revalidate every 300 seconds (5 minutes)
export const revalidate = 300;

export default async function Home() {
  let featuredProducts = [];
  let dbError = false;
  
  try {
    featuredProducts = await getFeaturedProducts();
  } catch (error) {
    console.error('Database connection error:', error);
    dbError = true;
    // Fallback sample products for demo purposes when DB is unavailable
    featuredProducts = [
      {
        id: 1,
        name: "Premium Smartphone",
        price: 699.99,
        image: "/api/placeholder/300/300",
        category: "Electronics",
        rating: 4.5,
        reviews: 128
      },
      {
        id: 2,
        name: "Gaming Laptop",
        price: 1299.99,
        image: "/api/placeholder/300/300",
        category: "Computers",
        rating: 4.8,
        reviews: 89
      },
      {
        id: 3,
        name: "Wireless Headphones",
        price: 199.99,
        image: "/api/placeholder/300/300",
        category: "Audio",
        rating: 4.3,
        reviews: 256
      },
      {
        id: 4,
        name: "Smart Watch",
        price: 299.99,
        image: "/api/placeholder/300/300",
        category: "Wearables",
        rating: 4.6,
        reviews: 174
      }
    ];
  }

  return (
    <div>
      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">30-day money back guarantee</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 010 19.5 9.75 9.75 0 010-19.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Check out our most popular items
            </p>
            {dbError && (
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Database temporarily unavailable - showing demo products
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our newsletter for the latest deals and product updates
          </p>
          <div className="max-w-md mx-auto flex text-white border-white border  overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg "
            />
            <button className="bg-blue-600 px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
