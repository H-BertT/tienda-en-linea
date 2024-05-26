import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase/config';

const PurchaseHistory = () => {
    const [purchases, setPurchases] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPurchases = async () => {
            const user = auth.currentUser;
            if (!user) {
                setError("Usuario no autenticado. Por favor, inicia sesión.");
                setLoading(false);
                return;
            }
            
            setLoading(true);
            try {
                const snapshot = await db.collection('ventas')
                                         .where('clienteId', '==', user.uid)
                                         .orderBy('fecha', 'desc')
                                         .get();
                const purchasesData = await Promise.all(snapshot.docs.map(async doc => {
                    const productData = await db.collection('productos').doc(doc.data().productoId).get();
                    return {
                        id: doc.id,
                        ...doc.data(),
                        fecha: doc.data().fecha.toDate ? new Date(doc.data().fecha.toDate()).toLocaleDateString() : new Date(doc.data().fecha).toLocaleDateString(),
                        imageUrl: productData.data().imageUrl,
                        nombreProducto: productData.data().nombre,
                        puntos: doc.data().puntos
                    };
                }));

                setPurchases(purchasesData);

                

                const total = purchasesData.reduce((sum, purchase) => sum + purchase.puntos, 0);
                setTotalPoints(total);
            
            
            } catch (error) {
                console.error("Error al obtener las compras del usuario:", error);
                setError(`Error al cargar las compras: ${error.message || 'Desconocido'}`);
            }
            setLoading(false);
        };

        fetchPurchases();
    }, []);

    if (loading) {
        return <div className="text-center"><span className="spinner-border text-primary"></span> Cargando historial de compras...</div>;
    }

    if (error) {
        return <div className="container mt-4">
            <h2>Historial de Compras</h2>
            <p className="text-danger">{error}</p>
        </div>;
    }

    return (
        <div className="container mt-4">
            <h2>Historial de Compras</h2>
            {purchases.length > 0 ? (
                <ul className="list-group">
                    {purchases.map((purchase) => (
                        <li key={purchase.id} className="list-group-item">
                            <div className="row align-items-center">
                                <div className="col-4">
                                    <img src={purchase.imageUrl} alt={purchase.nombreProducto} style={{ width: "100px" }} />
                                </div>
                                <div className="col-8">
                                    <h5>{purchase.nombreProducto}</h5>
                                    <p>Cantidad: {purchase.cantidad}</p>
                                    <p>Total pagado: ${purchase.precioTotal}</p>
                                    <p>Fecha de compra: {purchase.fecha}</p>
                                    <p>Puntos ganados: {purchase.puntos}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : <p>No se encontraron compras.</p>}
            <div className="mt-4">
                <h4>Puntos Totales Acumulados: {totalPoints}</h4>
            </div>
        </div>
    );
};

export default PurchaseHistory;
