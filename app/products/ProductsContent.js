'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';

export default function ProductsContent({ 
  initialProducts = [], 
  initialCategories = [], 
  searchParams 
}) {
  const categoryParam = searchParams?.category;
  
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false); // No initial loading since we have server data
  const [searching, setSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const handleSearch = async () => {
        try {
          setSearching(true);
          const params = new URLSearchParams();
          if (searchTerm) params.append('q', searchTerm);
          if (selectedCategory !== 'All') params.append('category', selectedCategory);
          if (priceRange.min) params.append('minPrice', priceRange.min);
          if (priceRange.max) params.append('maxPrice', priceRange.max);
          params.append('sortBy', sortBy === 'name' ? 'name' : 'price');
          params.append('sortOrder', sortBy === 'price-high' ? 'desc' : 'asc');

          const response = await fetch(`/api/products/search?${params}`);
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error('Error searching products:', error);
        } finally {
          setSearching(false);
        }
      };

      // Only search if there are active filters, otherwise use initial server data
      if (searchTerm || selectedCategory !== 'All' || priceRange.min || priceRange.max) {
        handleSearch();
      } else {
        // Reset to initial server data when no filters
        setProducts(initialProducts);
        setSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory, priceRange.min, priceRange.max, sortBy, initialProducts]);

  // No need to fetch categories since we have them from server
  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  // const fetchCategories = async () => {
  //   try {
  //     const response = await fetch('/api/categories');
  //     const data = await response.json();
  //     setCategories(data);
  //   } catch (error) {
  //     console.error('Error fetching categories:', error);
  //   }
  // };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange({ min: '', max: '' });
    setSortBy('name');
    setProducts(initialProducts); // Reset to server data immediately
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== 'All') count++;
    if (priceRange.min || priceRange.max) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
        <p className="text-gray-600">Discover our amazing collection of products</p>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left"
        >
          <span className="font-medium">
            Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </span>
          <svg
            className={`w-5 h-5 transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          {products.length === 0 && !searching ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found.</p>
              <button
                onClick={resetFilters}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Clear filters to see all products
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {products.length} product{products.length !== 1 ? 's' : ''} found
                </span>
                {searching && (
                  <span className="text-sm text-blue-600 flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                    Searching...
                  </span>
                )}
              </div>
              <div className={`grid grid-cols-2 lg:grid-cols-3 lg:gap-6 gap-3 ${searching ? 'opacity-70 transition-opacity' : ''}`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
