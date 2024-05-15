import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/Customer/CartContext'; // Importa el CartProvider

import Navbar from './components/Utilidades/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import HomePage from './components/views/Principal/HomePage';
import ShoppingCart from './components/Customer/ShoppingCart';
import ProductCrud from './components/views/Admin/ProductCrud';
import TopProductsChart from './components/Analytics/TopProductsChart';
import ProductList from './components/Utilidades/ProductList';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';
import HistorialCompra from './components/views/HistorialCompra';

function App() {
  return (
    <Router>
      <CartProvider> {/* Envuelve todos los componentes con el CartProvider */}
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<UserProfile />} />
            <Route path="/cart" element={<ProtectedRoute><ShoppingCart /></ProtectedRoute>} />
            <Route path="/historial" element={<ProtectedRoute><HistorialCompra /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute permission="administrador"><ProductCrud /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute permission="administrador"><TopProductsChart /></ProtectedRoute>} />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
