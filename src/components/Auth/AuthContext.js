import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config'; // Asegúrate de que la ruta es correcta

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(userAuth => {
            if (userAuth) {
                // Carga los datos adicionales del usuario desde Firestore
                const userRef = db.collection('usuarios').doc(userAuth.uid);
                userRef.get().then(doc => {
                    if (doc.exists) {
                        setUser({ uid: userAuth.uid, email: userAuth.email, ...doc.data() });
                    } else {
                        // Si no hay datos adicionales, establece solo la info de autenticación
                        setUser({ uid: userAuth.uid, email: userAuth.email });
                    }
                });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            // Esto se maneja en el onAuthStateChanged, no es necesario aquí
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        await auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
