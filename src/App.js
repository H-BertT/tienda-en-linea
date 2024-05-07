import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProductList from './components/Shared/ProductList';
import ShoppingCart from './components/Customer/ShoppingCart';
import ProductCrud from './components/Admin/ProductCrud';
import TopProductsChart from './components/Analytics/TopProductsChart';
import HomePage from './components/Principal/HomePage';
import { useAuth } from './components/Auth/AuthContext'; // Ajusta esta ruta según tu estructura de carpetas

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={user ? <Navigate replace to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate replace to="/" /> : <Register />} />
          <Route path="/cart" element={user ? <ShoppingCart /> : <Navigate replace to="/login" />} />
          <Route path="/admin/products" element={user && user.permiso === 'administrador' ? <ProductCrud /> : <Navigate replace to="/" />} />
          <Route path="/analytics" element={user && user.permiso === 'administrador' ? <TopProductsChart /> : <Navigate replace to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
