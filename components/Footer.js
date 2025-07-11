export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">TechStore</h3>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for the latest technology and gadgets. Quality products at affordable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="/products" className="text-gray-400 hover:text-white">Products</a></li>
              <li><a href="/categories" className="text-gray-400 hover:text-white">Categories</a></li>
              <li><a href="/cart" className="text-gray-400 hover:text-white">Shopping Cart</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-md font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/products?category=Electronics" className="text-gray-400 hover:text-white">Electronics</a></li>
              <li><a href="/products?category=Accessories" className="text-gray-400 hover:text-white">Accessories</a></li>
              <li><a href="/products?category=Health" className="text-gray-400 hover:text-white">Health</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-md font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: info@techstore.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Tech Street, Digital City</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 TechStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
