import React from 'react';
import { useCart } from './CartContext';
import { db, auth, FieldValue } from '../../firebase/config'; // Asegúrate de que 'FieldValue' esté exportado desde tu configuración de Firebase si es necesario

const ShoppingCart = () => {
    const { state, dispatch } = useCart();
    const { items } = state;

    const incrementQuantity = (id) => {
        dispatch({ type: 'ADD_ITEM', payload: items[id] });
    };

    const decrementQuantity = (id) => {
        if (items[id].cantidad > 1) {
            dispatch({ type: 'REMOVE_ITEM', payload: { id } });
        }
    };

    const removeItem = (id) => {
        dispatch({ type: 'DELETE_ITEM', payload: { id } });
    };
    const handleCompletePurchase = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("No hay un usuario autenticado.");
            return;
        }
    
        const batch = db.batch();
    
        for (const item of Object.values(items)) {
            const productRef = db.collection('productos').doc(item.id);
    
            try {
                const doc = await productRef.get();
                if (!doc.exists) {
                    console.error("Producto no encontrado en la base de datos");
                    continue;
                }
                const data = doc.data();
                if (data.cantidad < item.cantidad) {
                    console.error("No hay suficiente stock para el producto:", item.id);
                    continue;
                }
    
                const newQuantity = data.cantidad - item.cantidad; // Calcula la nueva cantidad restante
                batch.update(productRef, { cantidad: newQuantity }); // Actualiza directamente con la nueva cantidad
    
                const saleRef = db.collection('ventas').doc();
                batch.set(saleRef, {
                    clienteId: user.uid,
                    productoId: item.id,
                    cantidad: item.cantidad,
                    precioTotal: item.precio * item.cantidad,
                    fecha: new Date()
                });
            } catch (error) {
                console.error("Error al acceder al producto:", item.id, error);
                continue;
            }
        }
    
        try {
            await batch.commit();
            dispatch({ type: 'CLEAR_CART' }); // Limpia el carrito tras la compra
            alert("Compra realizada con éxito!");
        } catch (error) {
            console.error("Error completing purchase: ", error);
            alert("Ocurrió un error al completar la compra.");
        }
    };
    

    const totalPrice = Object.values(items).reduce((total, item) => total + item.precio * item.cantidad, 0);


    return (
        <div className="container mt-4">
            <h2 className="mb-4">Carrito de Compras</h2>
            <div className="row">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Productos</div>
                        <ul className="list-group list-group-flush">
                            {Object.values(items).map((item) => (
                                <li key={item.id} className="list-group-item">
                                    <div className="row align-items-center">
                                        <div className="col-4">
                                            <img src={item.imageUrl} alt={item.nombre} className="img-fluid" />
                                        </div>
                                        <div className="col-8">
                                            <h5>{item.nombre}</h5>
                                            <p>{item.descripcion}</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <button onClick={() => decrementQuantity(item.id)} className="btn btn-secondary btn-sm">-</button>
                                                    <span className="mx-2">{item.cantidad}</span>
                                                    <button onClick={() => incrementQuantity(item.id)} className="btn btn-secondary btn-sm">+</button>
                                                </div>
                                                <span className="badge bg-secondary rounded-pill">${item.precio}</span>
                                                <button onClick={() => removeItem(item.id)} className="btn btn-danger btn-sm">Eliminar</button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">Resumen de la compra</div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <p>Total: ${totalPrice.toFixed(2)}</p>
                            </li>
                            <li className="list-group-item">
                                <button  onClick={handleCompletePurchase} className="btn btn-success w-100">Finalizar compra</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;
