import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { db } from '../../../firebase/config';
import { useAuth } from '../../Auth/AuthContext'; // Ajusta esta ruta según sea necesario
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);


function HomePage() {
  const [productos, setProductos] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const { user } = useAuth(); 

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
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
  
    cargarProductos().then(() => {
      if (productos.length > 0) {
        fetchTopProductos(); // Llama a fetchTopProductos solo si hay productos cargados
      }
    });
  }, [productos.length]); // Agrega productos.length como dependencia
  
  const fetchTopProductos = async () => {
    if (productos.length === 0) return; // Verifica si hay productos cargados
  
    const ventasSnapshot = await db.collection('ventas')
                                   .orderBy('cantidad', 'desc')
                                   .limit(3)
                                   .get();
    const topProd = ventasSnapshot.docs.map(doc => {
      const data = doc.data();
      const producto = productos.find(p => p.id === data.productoId);
      return {
        nombre: producto ? producto.nombre : 'Cargando producto...',
        cantidad: data.cantidad
      };
    });
    setTopProductos(topProd);
  };
  

  const data = {
    labels: topProductos.map(p => p.nombre),
    datasets: [
      {
        data: topProductos.map(p => p.cantidad),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  const options = {
    plugins: {
      tooltip: {
        enabled: false // Desactiva los tooltips
      },
      legend: {
        display: true // Si deseas mostrar la leyenda
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      arc: {
        hoverBorderColor: 'rgba(0,0,0,0)', // Desactiva el cambio de color al pasar el ratón sobre los segmentos
        hoverBorderWidth: 0,
        borderWidth: 0
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenido a Nuestra Tienda en Línea</h1>
      <p>Explora nuestros productos y encuentra lo que necesitas a precios increíbles.</p>
      <div>
        <Link to="/productos" style={{ margin: '10px', fontSize: '18px', textDecoration: 'none', color: 'blue' }}>
          Ver Productos
        </Link>
        {!user && (
          <Link to="/register" style={{ margin: '10px', fontSize: '18px', textDecoration: 'none', color: 'green' }}>
            Regístrate Ahora
          </Link>
        )}
      </div>
      <br></br>
      <br></br>
      <div style={{ width: '400px', height: '400px', margin: '0 auto' }}>
        <h3>Top 3 Productos Más Vendidos</h3>
        <Pie data={data} options={options} />
      </div>
      <br></br>
      <br></br>
      <br></br>
      {productos.length > 0 && (
        <div style={{ margin: '20px' }}>
          <Slider {...settings}>
          {productos.map(producto => (
            <div key={producto.id} style={{padding: '10px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <img src={producto.imageUrl || 'path/to/default/image'} alt={producto.nombre} style={{ width: '95%', height: '250px', borderRadius: '12px' }} />
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
