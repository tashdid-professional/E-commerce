'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
  };

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative group">
        {/* Main Image */}
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-48 object-cover transition-opacity duration-300"
        />
        
        {/* Hover Image (second image if available) */}
        {product.images && product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} - alternate view`}
            width={300}
            height={300}
            className="absolute inset-0 w-full h-48 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        )}
        
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold z-10">
            -{discount}%
          </span>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{product.category}</span>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L0 6.91l6.564-.955L10 0l2.436 5.955L20 6.91l-5.245 4.635L15.878 18z"/>
            </svg>
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {product.reviews} reviews
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Link 
            href={`/products/${product.id}`}
            className="flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-center hover:bg-gray-200 transition-colors"
          >
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
