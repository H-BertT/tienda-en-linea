// src/components/views/Principal/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { db } from '../../../firebase/config';
import { useAuth } from '../../Auth/AuthContext'; // Ajusta esta ruta según sea necesario


function HomePage() {
  const [productos, setProductos] = useState([]);
  const { user } = useAuth(); 

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear"
  };

  useEffect(() => {
    const cargarProductos = async () => {
      const snapshot = await db.collection('productos').get();
      const productosCargados = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProductos(productosCargados);
    };

    cargarProductos();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenido a Nuestra Tienda en Línea</h1>
      <p>Explora nuestros productos y encuentra lo que necesitas a precios increíbles.</p>
      <div>
        <Link to="/productos" style={{ margin: '10px', fontSize: '18px', textDecoration: 'none', color: 'blue' }}>
          Ver Productos
        </Link>
        {!user && ( // Solo muestra el enlace de registro si no hay un usuario autenticado
          <Link to="/register" style={{ margin: '10px', fontSize: '18px', textDecoration: 'none', color: 'green' }}>
            Regístrate Ahora
          </Link>
        )}
      </div>
      {productos.length > 0 && (
        <div style={{ margin: '20px' }}>
          <Slider {...settings}>
          {productos.map(producto => (
          <div key={producto.id} style={{padding: '10px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <img src={producto.imageUrl || 'path/to/default/image'} alt={producto.nombre} style={{ width: '50%', height: '250px', borderRadius: '12px' }} />
            <h3 style={{ marginTop: '10px' }}>{producto.nombre}</h3>
            <p style={{ fontSize: '14px' }}>{producto.descripcion}</p>
          </div>
        ))}
          </Slider>
        </div>
      )}
    </div>
  );
}
export default HomePage;
