import React from 'react';
import { useCart } from './CartContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ShoppingCart = () => {
    const { state } = useCart();
    const { items, customer } = state;

    const totalPrice = Object.values(items).reduce((total, item) => total + item.precio * item.cantidad, 0);

    const generatePDF = () => {
        const input = document.getElementById('pdf-content');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "px",
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0);
                pdf.save("compra.pdf");
            });
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Carrito de Compras</h2>
            <div className="row">
                <div className="col-12">
                    <div className="card mb-3">
                        <div className="card-header">Detalles del Cliente</div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">Nombre: {customer.name}</li>
                            <li className="list-group-item">Correo: {customer.email}</li>
                            <li className="list-group-item">Dirección: {customer.address}</li>
                            <li className="list-group-item">Teléfono: {customer.phone}</li>
                            <li className="list-group-item">Fecha: {new Date().toLocaleDateString()}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="pdf-content" className="row">
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
                                                <span className="badge bg-secondary rounded-pill">Cantidad: {item.cantidad}</span>
                                                <span className="badge bg-secondary rounded-pill">Precio: ${item.precio}</span>
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
                        </ul>
                    </div>
                </div>
            </div>
            <button className="btn btn-success" onClick={generatePDF}>Descargar PDF</button>
        </div>
    );
};

export default ShoppingCart;
