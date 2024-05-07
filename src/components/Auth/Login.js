import React, { useState } from 'react';
import { db } from '../../firebase/config';

const LoginForm = () => {
  const [loginData, setLoginData] = useState({
    correo: '',
    contraseña: ''
  });
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const docRef = db.collection('usuarios').doc(loginData.correo);
    docRef.get().then(doc => {
      if (!doc.exists) {
        setMessage('No existe un usuario con ese correo electrónico.');
        setIsError(true);
      } else {
        const userData = doc.data();
        if (userData.contraseña === loginData.contraseña) {
          setUser({ ...userData, id: doc.id }); // Almacenar los datos del usuario y su ID
          setMessage('Inicio de sesión exitoso.');
          setIsError(false);
          // Aquí podrías redirigir al usuario según su permiso
          if (userData.permiso === 'administrador') {
            // Redirigir a la página del administrador
          } else {
            // Redirigir a la página del cliente
          }
        } else {
          setMessage('Contraseña incorrecta.');
          setIsError(true);
        }
      }
    }).catch(error => {
      setMessage('Error al iniciar sesión: ' + error.message);
      setIsError(true);
    });
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
}

export default LoginForm;
