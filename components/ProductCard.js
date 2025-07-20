'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import { memo } from 'react';

function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
  };

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative overflow-hidden">
        {/* Main Image */}
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="w-full lg:h-60 h-40 object-cover transition-all duration-500 group-hover:scale-110"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        
        {/* Hover Image (second image if available) */}
          {product.images && product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name} - alternate view`}
              width={300}
              height={300}
              className="absolute inset-0 w-full h-60 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          )}

          {/* Action Icons - Top Right */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 z-20 md:translate-x-8 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-300">
            {/* View Details Icon */}
            <Link 
              href={`/products/${product.id}`}
              className="bg-white bg-opacity-60 backdrop-blur-sm p-2 rounded-full text-black hover:text-white hover:bg-red-500 hover:bg-opacity-100 hover:scale-110 shadow-md transition-all duration-300"
              title="View Details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-eye">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                <circle cx="12" cy="12" r="1"/>
                <path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0"/>
              </svg>
            </Link>

            {/* Add to Cart Icon */}
            <button
              onClick={handleAddToCart}
              className="bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded-full text-black hover:bg-red-500 hover:bg-opacity-100 hover:text-white hover:scale-110 shadow-md transition-all duration-300"
              title="Add to Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
            </button>
          </div>

          {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold z-20 shadow-lg">
            -{discount}%
          </span>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between lg:mb-2 ">
          <span className="lg:text-sm text-xs text-gray-500">{product.category}</span>
          {(product.rating && product.rating > 0) ? (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L0 6.91l6.564-.955L10 0l2.436 5.955L20 6.91l-5.245 4.635L15.878 18z"/>
              </svg>
              <span className="lg:text-sm text-xs text-gray-600 ml-1">{product.rating.toFixed(1)}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500 lg:block hidden">No reviews</span>
          )}
        </div>
        
        <h3 className="lg:text-lg text-sm text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        {/* <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p> */}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="lg:text-2xl text-xs font-semibold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="lg:text-sm text-xs text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500 lg:block hidden">
            {product.reviews} reviews
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
