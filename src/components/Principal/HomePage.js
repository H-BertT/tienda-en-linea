import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenido a Nuestra Tienda en Línea</h1>
      <p>Explora nuestros productos y encuentra lo que necesitas a precios increíbles.</p>
      <div>
        <Link to="/products" style={{ margin: '10px', fontSize: '18px', textDecoration: 'none', color: 'blue' }}>
          Ver Productos
        </Link>
        <Link to="/register" style={{ margin: '10px', fontSize: '18px', textDecoration: 'none', color: 'green' }}>
          Regístrate Ahora
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
