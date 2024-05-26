import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { db, auth, FieldValue } from '../../firebase/config'; 

const ShoppingCart = () => {
    const { state, dispatch } = useCart();
    const { items } = state;
    const [userPoints, setUserPoints] = useState(0);
    const [pointsToUse, setPointsToUse] = useState(0);
    const pointsToPesosRate = 2; // 5 puntos = 10 pesos, entonces 1 punto = 2 pesos

    useEffect(() => {
        const fetchUserPoints = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await db.collection('usuarios').doc(user.uid).get();
                if (userDoc.exists) {
                    setUserPoints(userDoc.data().puntos || 0);
                }
            }
        };
        fetchUserPoints();
    }, []);

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
        let totalPointsEarned = 0;

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

                const newQuantity = data.cantidad - item.cantidad;
                batch.update(productRef, { cantidad: newQuantity });

                const saleRef = db.collection('ventas').doc();
                batch.set(saleRef, {
                    clienteId: user.uid,
                    productoId: item.id,
                    cantidad: item.cantidad,
                    precioTotal: item.precio * item.cantidad,
                    fecha: new Date(),
                    puntos: item.cantidad * 5 // Asumiendo que cada producto otorga 5 puntos por unidad
                });
                totalPointsEarned += item.cantidad * 5;
            } catch (error) {
                console.error("Error al acceder al producto:", item.id, error);
                continue;
            }
        }

        try {
            await batch.commit();
            const userRef = db.collection('usuarios').doc(user.uid);
            const pointsToDeduct = Math.min(pointsToUse, userPoints);
            const newPoints = userPoints - pointsToDeduct + totalPointsEarned;

            await userRef.update({
                puntos: newPoints
            });

            dispatch({ type: 'CLEAR_CART' });
            alert("Compra realizada con éxito!");
        } catch (error) {
            console.error("Error completing purchase: ", error);
            alert("Ocurrió un error al completar la compra.");
        }
        window.print();
    };

    const totalPrice = Object.values(items).reduce((total, item) => total + item.precio * item.cantidad, 0);
    const pointsValue = pointsToUse * pointsToPesosRate;
    const discountedTotal = Math.max(0, totalPrice - pointsValue);

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
                                <p>Puntos disponibles: {userPoints} (equivalente a ${userPoints * pointsToPesosRate})</p>
                                <div className="mb-3">
                                    <label htmlFor="pointsToUse" className="form-label">Puntos a usar:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="pointsToUse"
                                        value={pointsToUse}
                                        onChange={(e) => setPointsToUse(Math.min(Math.max(0, parseInt(e.target.value) || 0), userPoints))}
                                    />
                                </div>
                                <p>Valor de puntos utilizados: ${pointsValue.toFixed(2)}</p>
                                <p>Total con descuento: ${discountedTotal.toFixed(2)}</p>
                            </li>
                            <li className="list-group-item">
                                <button onClick={handleCompletePurchase} className="btn btn-success w-100">Finalizar compra</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;