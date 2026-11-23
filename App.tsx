import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Design from './pages/Design';
import DesignNormal from './pages/DesignNormal';
import Calculator from './pages/Calculator';
import ProCalculator from './pages/ProCalculator';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import Knowledge from './pages/Knowledge';
import ArticleDetail from './pages/ArticleDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/design" element={<Design />} />
            <Route path="/design/normal" element={<DesignNormal />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/pro-calculator" element={<ProCalculator />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/knowledge/:slug" element={<ArticleDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}