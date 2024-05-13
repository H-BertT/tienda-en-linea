    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '../Auth/AuthContext'; // Asegúrate de que la ruta de importación sea correcta

    const LoginForm = () => {
        const [loginData, setLoginData] = useState({ correo: '', contraseña: '' });
        const { login } = useAuth();
        const [message, setMessage] = useState('');
        const [isError, setIsError] = useState(false);
        const navigate = useNavigate();

        const handleChange = (e) => {
            setLoginData({ ...loginData, [e.target.name]: e.target.value });
        };
        const handleSubmit = async (e) => {
            e.preventDefault();
            const { correo, contraseña } = loginData;
        
            // Verificación de campos vacíos
            if (!correo.trim() || !contraseña.trim()) {
                setMessage('Por favor, ingresa tu correo electrónico y contraseña.');
                setIsError(true);
                return;
            }
        
            try {
                await login(correo, contraseña);
                setMessage('Inicio de sesión exitoso.');
                setIsError(false);
                navigate('/');
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                setIsError(true);
                switch (error.code) {
                    case 'auth/user-not-found':
                        setMessage('No existe un usuario con ese correo electrónico.');
                        break;
                    case 'auth/wrong-password':
                        setMessage('Contraseña incorrecta.');
                        break;
                    case 'auth/invalid-credential':
                        setMessage('Verifica tu contraseña.');
                        break;
                    default:
                        setMessage('Error al iniciar sesión: ' + error.message);
                        break;
                }
            }
        };
        

        return (
            <form onSubmit={handleSubmit} className="container mt-5">
                {message && <div className={isError ? "alert alert-danger" : "alert alert-success"}>
                    {message}
                </div>}
                <div className="form-group">
                    <label>Correo Electrónico:</label>
                    <input type="email" className="form-control" name="correo" value={loginData.correo} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input type="password" className="form-control" name="contraseña" value={loginData.contraseña} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
            </form>
        );
    };

    export default LoginForm;
