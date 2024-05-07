import React, { useState } from 'react';
import { db } from '../../firebase/config';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido || !formData.correo || !formData.contraseña || !formData.confirmarContraseña) {
      setMessage('Todos los campos son obligatorios');
      setIsError(true);
      return;
    }
    if (formData.contraseña !== formData.confirmarContraseña) {
      setMessage('Las contraseñas no coinciden');
      setIsError(true);
      return;
    }

    const docRef = db.collection('usuarios').doc(formData.correo);

    docRef.get().then(doc => {
      if (doc.exists) {
        setMessage('Este correo electrónico ya está registrado.');
        setIsError(true);
      } else {
        docRef.set({
          nombre: formData.nombre,
          apellido: formData.apellido,
          correo: formData.correo,
          contraseña: formData.contraseña,
          permiso: 'cliente'  // Se añade el campo permiso con valor "cliente"
        }).then(() => {
          setMessage('Usuario registrado exitosamente');
          setIsError(false);
          setFormData({
            nombre: '',
            apellido: '',
            correo: '',
            contraseña: '',
            confirmarContraseña: ''
          });
        }).catch(error => {
          setMessage('Error al registrar usuario: ' + error.message);
          setIsError(true);
        });
      }
    }).catch(error => {
      setMessage('Error al verificar el correo electrónico: ' + error.message);
      setIsError(true);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      {message && <div className={isError ? "alert alert-danger" : "alert alert-success"}>
        {message}
      </div>}
      <div className="form-group">
        <label>Nombre:</label>
        <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Apellido:</label>
        <input type="text" className="form-control" name="apellido" value={formData.apellido} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Correo Electrónico:</label>
        <input type="email" className="form-control" name="correo" value={formData.correo} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Contraseña:</label>
        <input type="password" className="form-control" name="contraseña" value={formData.contraseña} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Confirmar Contraseña:</label>
        <input type="password" className="form-control" name="confirmarContraseña" value={formData.confirmarContraseña} onChange={handleChange} />
      </div>
      <button type="submit" className="btn btn-primary">Registrarse</button>
    </form>
  );
}

export default RegisterForm;
