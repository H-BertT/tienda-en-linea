// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext'; // Ajusta la ruta de importación según tu estructura

const ProtectedRoute = ({ children, permission }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Usuario no autenticado, redireccionar a la página de login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permission && user.rol !== permission) {
    // Usuario no tiene el permiso necesario, redireccionar a una página de error o de inicio
    return <Navigate to="/" />; 
  }

  return children; // Si pasa las verificaciones, renderizar los children pasados al componente
};

export default ProtectedRoute;
