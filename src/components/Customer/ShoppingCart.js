// src/components/Customer/ShoppingCart.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import React, { useContext, useState, useEffect } from 'react';
import { db } from '../../firebase/config';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const cartRef = db.collection('carts').doc('userCartId'); // Asumiendo que cada usuario tiene un 'cartId'
        cartRef.onSnapshot(doc => {
            setCartItems(doc.data().items);
        });
    }, []);

    const handleRemoveItem = async (id) => {
        // Lógica para eliminar un item del carrito
        const cartRef = db.collection('carts').doc('userCartId');
        await cartRef.update({
            items: firebase.firestore.FieldValue.arrayRemove({ id: id })
        });
    };

    return (
        <div>
            <h2>Carrito de Compras</h2>
            {cartItems.map(item => (
                <div key={item.id}>
                    <h4>{item.name}</h4>
                    <p>Cantidad: {item.quantity}</p>
                    <button onClick={() => handleRemoveItem(item.id)}>Eliminar</button>
                </div>
            ))}
            {/* Aquí puedes agregar más controles como actualizar cantidades */}
        </div>
    );
};

export default ShoppingCart;
