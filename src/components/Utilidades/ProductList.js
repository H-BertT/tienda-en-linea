import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { useCart } from '../Customer/CartContext'; // Verifica la ruta de importación

const ProductList = () => {
    const [productos, setProductos] = useState([]);
    const { state: cartState, dispatch } = useCart();

    useEffect(() => {
        const unsubscribe = db.collection('productos').onSnapshot(snapshot => {
            const fetchedProductos = snapshot.docs.map(doc => ({
                id: doc.id,
                nombre: doc.data().nombre,
                descripcion: doc.data().descripcion,
                cantidad: doc.data().cantidad,
                precio: doc.data().precio,
                talla: doc.data().talla,
                imageUrl: doc.data().imageUrl
            }));
            
            // Ajustar cantidades basado en el carrito
            const productosData = fetchedProductos.map(producto => {
                const cartItem = cartState.items[producto.id];
                return {
                    ...producto,
                    cantidad: cartItem ? producto.cantidad - cartItem.cantidad : producto.cantidad
                };
            });

            console.log('Productos cargados:', productosData);
            setProductos(productosData);
        });

        return () => unsubscribe();
    }, [cartState.items]); // Dependencia actualizada para recalcular cuando cambia el carrito

    const handleAddToCart = (producto) => {
        if (producto.cantidad > 0) {
            dispatch({ type: 'ADD_ITEM', payload: {...producto, cantidad: 1} }); // Añade solo un producto al carrito
            // Actualiza la cantidad disponible del producto en la lista
            setProductos(productos.map(p => {
                if (p.id === producto.id) {
                    return { ...p, cantidad: p.cantidad - 1 };
                }
                return p;
            }));
        } else {
            alert("No hay más stock disponible para este producto.");
        }
    };
    

    return (
        <div className="container mt-5">
            <h2>Lista de Productos</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {productos.length > 0 ? (
                    productos.map(producto => (
                        <div key={producto.id} className="card" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: '20px' }}>
                            <img src={producto.imageUrl || 'path/to/default/image'} alt={producto.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                            <h4 style={{ marginTop: '10px' }}>{producto.nombre}</h4>
                            <p>{producto.descripcion}</p>
                            <p>Cantidad disponible: {producto.cantidad}</p>
                            <p>Precio: ${producto.precio}</p>
                            <p>Talla: {producto.talla}</p>
                            <button onClick={() => handleAddToCart(producto)} disabled={producto.cantidad === 0} style={{ marginTop: '10px', width: '100%', padding: '10px', backgroundColor: producto.cantidad === 0 ? '#cccccc' : 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: producto.cantidad === 0 ? 'not-allowed' : 'pointer' }}>
                                Agregar al carrito
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No hay productos registrados.</p>
                )}
            </div>
        </div>
    );
};

export default ProductList;
