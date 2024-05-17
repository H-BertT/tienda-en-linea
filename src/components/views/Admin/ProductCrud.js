import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase/config';

const ProductCrud = () => {
    const [productos, setProductos] = useState([]);
    const [productForm, setProductForm] = useState({
        nombre: '',
        descripcion: '',
        cantidad: '',
        precio: '',
        talla: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState('');

    useEffect(() => {
        const unsubscribe = db.collection('productos').onSnapshot(snapshot => {
            const productosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProductos(productosData);
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            try {
                await db.collection('productos').doc(editId).update({
                    ...productForm
                });
                setIsEditing(false);
                setEditId('');
            } catch (error) {
                console.error('Error actualizando producto: ', error);
            }
        } else {
            try {
                await db.collection('productos').add({
                    ...productForm
                });
            } catch (error) {
                console.error('Error agregando producto: ', error);
            }
        }
        setProductForm({ nombre: '', descripcion: '', cantidad: '', precio: '', talla: '' }); // Reset form after submission
    };

    const handleDelete = async (id) => {
        try {
            // Eliminar el producto
            await db.collection('productos').doc(id).delete();
            // Eliminar todas las ventas asociadas
            const salesSnapshot = await db.collection('ventas').where('productoId', '==', id).get();
            salesSnapshot.forEach(async (doc) => {
                await db.collection('ventas').doc(doc.id).delete();
            });
        } catch (error) {
            console.error('Error eliminando producto y ventas asociadas: ', error);
        }
    };

    const handleImageUpload = async (e, productId) => {
        const file = e.target.files[0];
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`imagenes/${productId}`);
        await fileRef.put(file);
        const fileUrl = await fileRef.getDownloadURL();
        await db.collection('productos').doc(productId).update({
            imageUrl: fileUrl
        });
    };

    return (
        <div className="container mt-5">
            <h2>Agregar/Actualizar Producto</h2>
            <form onSubmit={handleSubmit} className="mb-3">
                <div className="form-group">
                    <label>Nombre del producto:</label>
                    <input type="text" className="form-control" name="nombre" value={productForm.nombre} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Descripción del producto:</label>
                    <textarea className="form-control" name="descripcion" value={productForm.descripcion} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Cantidad de unidades del producto:</label>
                    <input type="number" className="form-control" name="cantidad" value={productForm.cantidad} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Precio del producto:</label>
                    <input type="number" className="form-control" name="precio" value={productForm.precio} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Talla:</label>
                    <select className="form-control" name="talla" value={productForm.talla} onChange={handleChange}>
                        <option value="Extra chica">Extra chica</option>
                        <option value="Chica">Chica</option>
                        <option value="Mediana">Mediana</option>
                        <option value="Grande">Grande</option>
                        <option value="Extra Grande">Extra Grande</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Agregar/Actualizar Producto</button>
            </form>
    
            <h3>Lista de Productos</h3>
            {productos.map(producto => (
                <div key={producto.id} className="card mb-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <div className="contenedorHorizontal" style={{ display: 'flex', flexDirection: 'row', width: '100%', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <div style={{ padding: '12px', width: '30%', height: '300px', overflow: 'hidden' }}>
                        <img src={producto.imageUrl || 'path/to/default/image'} alt={producto.nombre} style={{ borderRadius: '12px', width: '100%', height: '100%', objectFit: 'fill' }} />
                        </div>
                        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h4 className="card-title">{producto.nombre}</h4>
                                <p className="card-text">{producto.descripcion}</p>
                                <p className="card-text">Cantidad: {producto.cantidad}</p>
                                <p className="card-text">Precio: ${producto.precio}</p>
                                <p className="card-text">Talla: {producto.talla}</p>
                            </div>
                        </div>
                    </div>
                    <div style={{margin: '12px 0px 12px', display: 'flex', justifyContent: 'space-around', width: '100%'}}>
                        <button onClick={() => {
                            setIsEditing(true);
                            setEditId(producto.id);
                            setProductForm({ ...producto });
                        }} className="btn btn-info">Modificar</button>
                        <button onClick={() => handleDelete(producto.id)} className="btn btn-danger">Eliminar</button>
    
                        <label className="btn btn-secondary">
                            Subir Imagen<input type="file" hidden onChange={(e) => handleImageUpload(e, producto.id)} />
                        </label>
                    </div>
                </div>
            ))}
        </div>
    );
    
};

export default ProductCrud;
