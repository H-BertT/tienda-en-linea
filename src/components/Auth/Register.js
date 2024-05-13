import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { auth } from '../../firebase/config';


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
    if (formData.contraseña.length < 6) {
      setMessage('La contraseña debe tener 6 caracteres o más');
      setIsError(true);
      return;
    }
    if (formData.contraseña !== formData.confirmarContraseña) {
      setMessage('Las contraseñas no coinciden');
      setIsError(true);
      return;
    }
  
    // Registro en Firebase Authentication sin iniciar sesión automáticamente
    auth.createUserWithEmailAndPassword(formData.correo, formData.contraseña)
      .then((userCredential) => {
        // Usuario registrado en Authentication, ahora registrarlo en Firestore
        const user = userCredential.user;
        db.collection('usuarios').doc(user.uid).set({
          nombre: formData.nombre,
          apellido: formData.apellido,
          correo: formData.correo,
          rol: 'cliente'
        }).then(() => {
          // Desloguear al usuario inmediatamente después del registro
          auth.signOut().then(() => {
            setMessage('Usuario registrado exitosamente. Por favor, inicie sesión.');
            setIsError(false);
            setFormData({
              nombre: '',
              apellido: '',
              correo: '',
              contraseña: '',
              confirmarContraseña: ''
            });
          }).catch((error) => {
            setMessage('Error al cerrar sesión después del registro: ' + error.message);
            setIsError(true);
          });
        }).catch(error => {
          setMessage('Error al registrar usuario en Firestore: ' + error.message);
          setIsError(true);
        });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setMessage('Este correo electrónico ya está registrado');
          setIsError(true);
        } else {
          setMessage('Error al registrar usuario en Authentication: ' + error.message);
          setIsError(true);
        }
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
