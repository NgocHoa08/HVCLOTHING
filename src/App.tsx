import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { AdminRoute } from './components/AdminRoute';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastContainer } from './components/Toast';
import { BackToTop } from './components/BackToTop';
import { ScrollToTop } from './components/ScrollToTop';
import { FirebaseStatusNotice } from './components/FirebaseStatusNotice';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { Account } from './pages/Account';
import { Admin } from './pages/Admin';

export const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <ProductProvider>
            <div className="flex flex-col min-h-screen bg-white text-[#111111] antialiased">
          {/* Header */}
          <Header />
          <FirebaseStatusNotice />

          {/* Main Content Viewport */}
          <main className="flex-1">
            <Routes>
              {/* 43. ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:category" element={<Shop />} />
              <Route path="/collection/:slug" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/search" element={<Shop />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Overlays & Drawers */}
          <CartDrawer />
          <SearchOverlay />
          <QuickViewModal />
          <ToastContainer />
          <BackToTop />
        </div>
          </ProductProvider>
        </AuthProvider>
      </Router>
    </CartProvider>
  );
};

export default App;
