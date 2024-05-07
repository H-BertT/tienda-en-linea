// src/components/Customer/GeneratePDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

const MyDocument = ({ cartItems, total }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Ticket de Compra</Text>
                {cartItems.map(item => (
                    <Text key={item.id}>{item.name} - Cantidad: {item.quantity} - Precio: {item.price}</Text>
                ))}
                <Text>Total: {total}</Text>
            </View>
        </Page>
    </Document>
);

const GeneratePDF = ({ cartItems }) => {
    const total = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

    return (
        <div>
            <PDFDownloadLink document={<MyDocument cartItems={cartItems} total={total} />} fileName="ticket-de-compra.pdf">
                {({ blob, url, loading, error }) => (loading ? 'Cargando documento...' : 'Descargar Ticket')}
            </PDFDownloadLink>
        </div>
    );
};

export default GeneratePDF;
