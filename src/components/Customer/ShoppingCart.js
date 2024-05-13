import React from 'react';
import { useCart } from './CartContext'; // Asegúrate de que la ruta de importación sea correcta

const ShoppingCart = () => {
    const { state, dispatch } = useCart();
    const { items } = state;

    const increment = (id) => {
        dispatch({ type: 'ADD_ITEM', payload: items[id] });
    };

    const decrement = (id) => {
        if (items[id].cantidad > 1) {
            dispatch({ type: 'REMOVE_ITEM', payload: { id } });
        } else {
            alert("No puedes tener menos de 1 producto en el carrito");
        }
    };

    const removeItem = (id) => {
        dispatch({ type: 'DELETE_ITEM', payload: { id } });
    };

    const totalPrice = Object.values(items).reduce((total, item) => total + item.precio * item.cantidad, 0);

    return (
        <div className="shopping-cart">
            <div className="products">
                {Object.values(items).map(item => (
                    <div key={item.id} className="product">
                        <img src={item.imageUrl} alt={item.nombre} style={{ width: '100px' }} />
                        <div>
                            <h4>{item.nombre}</h4>
                            <button onClick={() => decrement(item.id)}>-</button>
                            <span>{item.cantidad}</span>
                            <button onClick={() => increment(item.id)}>+</button>
                            <button onClick={() => removeItem(item.id)}>Eliminar</button>
                            <p>${item.precio}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="summary">
                <h3>Resumen de compra</h3>
                <p>Producto: ${totalPrice}</p>
                <p>Envío: Gratis</p>
                <p>Total: ${totalPrice}</p>
                <button>Continuar compra</button>
            </div>
        </div>
    );
};

export default ShoppingCart;
