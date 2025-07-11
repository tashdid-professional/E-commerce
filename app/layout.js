import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: "TechStore - Your Tech Shopping Destination",
  description: "Shop the latest technology and gadgets at TechStore. Quality products at affordable prices.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
