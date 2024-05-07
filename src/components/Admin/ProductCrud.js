// src/components/Admin/ProductCrud.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';

const ProductCrud = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('products').onSnapshot(snapshot => {
            const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
        });

        return () => unsubscribe();
    }, []);
    return (
        <div>
            {products.map(product => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    {/* Mostrar y editar detalles del producto aquí */}
                </div>
            ))}
        </div>
    );
};

export default ProductCrud;
