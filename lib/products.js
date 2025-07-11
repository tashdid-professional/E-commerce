// Demo products data
export const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    originalPrice: 129.99,
    image: "/api/placeholder/300/300",
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    features: ["Wireless Bluetooth 5.0", "30-hour battery life", "Active noise cancellation", "Premium drivers"],
    rating: 4.8,
    reviews: 128,
    inStock: true
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    originalPrice: 249.99,
    image: "/api/placeholder/300/300",
    category: "Electronics",
    description: "Advanced smartwatch with health monitoring, GPS, and smartphone connectivity.",
    features: ["Heart rate monitor", "GPS tracking", "Water resistant", "7-day battery"],
    rating: 4.6,
    reviews: 89,
    inStock: true
  },
  {
    id: 3,
    name: "Laptop Backpack",
    price: 49.99,
    originalPrice: 69.99,
    image: "/api/placeholder/300/300",
    category: "Accessories",
    description: "Durable laptop backpack with multiple compartments and water-resistant material.",
    features: ["Fits 15.6\" laptops", "Water resistant", "Multiple compartments", "Ergonomic design"],
    rating: 4.7,
    reviews: 156,
    inStock: true
  },
  {
    id: 4,
    name: "Gaming Mouse",
    price: 79.99,
    originalPrice: 99.99,
    image: "/api/placeholder/300/300",
    category: "Electronics",
    description: "Professional gaming mouse with customizable RGB lighting and precise tracking.",
    features: ["12000 DPI sensor", "RGB lighting", "Programmable buttons", "Ergonomic grip"],
    rating: 4.9,
    reviews: 203,
    inStock: true
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 39.99,
    originalPrice: 59.99,
    image: "/api/placeholder/300/300",
    category: "Electronics",
    description: "Portable Bluetooth speaker with 360° sound and waterproof design.",
    features: ["360° sound", "Waterproof IPX7", "12-hour battery", "Wireless connectivity"],
    rating: 4.5,
    reviews: 91,
    inStock: true
  },
  {
    id: 6,
    name: "Fitness Tracker",
    price: 69.99,
    originalPrice: 89.99,
    image: "/api/placeholder/300/300",
    category: "Health",
    description: "Advanced fitness tracker with heart rate monitoring and sleep tracking.",
    features: ["Heart rate monitor", "Sleep tracking", "Step counter", "Water resistant"],
    rating: 4.4,
    reviews: 67,
    inStock: true
  },
  {
    id: 7,
    name: "USB-C Hub",
    price: 29.99,
    originalPrice: 39.99,
    image: "/api/placeholder/300/300",
    category: "Accessories",
    description: "Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader.",
    features: ["6-in-1 design", "4K HDMI output", "USB 3.0 ports", "SD card reader"],
    rating: 4.6,
    reviews: 134,
    inStock: true
  },
  {
    id: 8,
    name: "Wireless Charger",
    price: 24.99,
    originalPrice: 34.99,
    image: "/api/placeholder/300/300",
    category: "Electronics",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    features: ["Fast charging", "Qi compatible", "LED indicator", "Safety protection"],
    rating: 4.3,
    reviews: 78,
    inStock: true
  }
];

export const categories = [
  { id: 1, name: "Electronics", count: 5 },
  { id: 2, name: "Accessories", count: 2 },
  { id: 3, name: "Health", count: 1 }
];

export function getProductById(id) {
  return products.find(product => product.id === parseInt(id));
}

export function getProductsByCategory(category) {
  return products.filter(product => product.category === category);
}

export function getFeaturedProducts() {
  return products.slice(0, 4);
}
