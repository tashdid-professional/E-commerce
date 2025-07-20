'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      title: "Latest Tech Collection",
      subtitle: "Discover Innovation",
      description: "Experience cutting-edge technology with our premium collection of smartphones, laptops, and accessories.",
      buttonText: "Explore Now",
      buttonLink: "/products",
      background: "from-blue-600 via-purple-600 to-indigo-700",
      image: "/api/placeholder/600/400",
      badge: "New Arrivals"
    },
    {
      id: 2,
      title: "Gaming Revolution",
      subtitle: "Level Up Your Game",
      description: "Immerse yourself in the ultimate gaming experience with high-performance gear and accessories.",
      buttonText: "Shop Gaming",
      buttonLink: "/products?category=gaming",
      background: "from-red-500 via-orange-500 to-yellow-500",
      image: "/api/placeholder/600/400",
      badge: "Best Sellers"
    },
    {
      id: 3,
      title: "Smart Home Solutions",
      subtitle: "Future is Here",
      description: "Transform your living space with intelligent devices that make life easier and more efficient.",
      buttonText: "Discover Smart",
      buttonLink: "/products?category=smart-home",
      background: "from-green-500 via-teal-500 to-blue-500",
      image: "/api/placeholder/600/400",
      badge: "Trending"
    },
    {
      id: 4,
      title: "Exclusive Deals",
      subtitle: "Limited Time Offers",
      description: "Don't miss out on incredible savings with our special promotions and exclusive member discounts.",
      buttonText: "View Deals",
      buttonLink: "/products?sale=true",
      background: "from-purple-600 via-pink-600 to-red-600",
      image: "/api/placeholder/600/400",
      badge: "Up to 50% Off"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div 
      className="relative h-[90vh] min-h-[500px] max-h-[900px] overflow-hidden "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0 scale-100' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-x-full scale-95' 
                  : 'opacity-0 translate-x-full scale-95'
            }`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.background}`}>
              {/* Animated Overlay Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
              </div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                
                {/* Text Content */}
                <div className={`text-white transform transition-all duration-1000 delay-300 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                  {/* Badge */}
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-bounce">
                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                    {slide.badge}
                  </div>

                  {/* Subtitle */}
                  <p className="text-lg md:text-xl font-medium text-white/90 mb-4">
                    {slide.subtitle}
                  </p>

                  {/* Main Title */}
                  <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                    <span className="block">{slide.title.split(' ').slice(0, -1).join(' ')}</span>
                    <span className="block bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                      {slide.title.split(' ').slice(-1)}
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-lg md:text-xl text-white/80 mb-8 max-w-md leading-relaxed">
                    {slide.description}
                  </p>

                  {/* CTA Button */}
                  <Link
                    href={slide.buttonLink}
                    className="group inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    {slide.buttonText}
                    <svg 
                      className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>

                {/* Image Content */}
                <div className={`relative transform transition-all duration-1000 delay-500 ${
                  index === currentSlide ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-8 opacity-0 scale-95'
                }`}>
                  <div className="relative">
                    {/* Floating Animation Container */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl transform rotate-3 animate-pulse"></div>
                    <div className="relative bg-white/20 backdrop-blur-sm rounded-3xl p-8 transform hover:scale-105 transition-transform duration-700">
                      {/* Placeholder for product image */}
                      <div className="w-full h-64 md:h-80 bg-white/30 rounded-2xl flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-16 h-16 mx-auto mb-4 bg-white/30 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium">Featured Product</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 group lg:block hidden"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 group lg:block hidden"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default HeroCarousel;
