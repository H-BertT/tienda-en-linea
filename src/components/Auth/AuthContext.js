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
                        const userData = { uid: userAuth.uid, email: userAuth.email, ...doc.data() };
                        console.log("User data loaded:", userData); // Agrega registros de depuración para verificar la carga correcta de datos
                        setUser(userData);
                    } else {
                        // Si no hay datos adicionales, establece solo la info de autenticación
                        setUser({ uid: userAuth.uid, email: userAuth.email });
                    }
                }).catch(error => {
                    console.error("Error fetching user details:", error);
                    setUser({ uid: userAuth.uid, email: userAuth.email }); // Ajuste por si falla la carga de datos adicionales
                });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            await auth.signInWithEmailAndPassword(email, password);
            // No es necesario manejar nada aquí, ya que onAuthStateChanged se ocupa de actualizar el estado
        } catch (error) {
            console.error("Login error:", error);
            throw error; // Lanza el error para manejarlo más arriba si es necesario
        }
    };

    const logout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Logout error:", error);
            throw error; // Lanza el error para manejarlo más arriba si es necesario
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
