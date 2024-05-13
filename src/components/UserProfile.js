import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchUserData = () => {
      const user = auth.currentUser;
      if (user) {
        db.collection('usuarios').doc(user.uid).get()
          .then((doc) => {
            if (doc.exists) {
              setFormData(doc.data());
            } else {
              setMessage('No se encontraron datos del usuario.');
              setIsError(true);
            }
          })
          .catch((error) => {
            setMessage('Error al obtener datos del usuario: ' + error.message);
            setIsError(true);
          });
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    db.collection('usuarios').doc(user.uid).set(formData)
      .then(() => {
        setMessage('Datos del usuario actualizados con éxito.');
        setIsError(false);
      })
      .catch((error) => {
        setMessage('Error al actualizar los datos del usuario: ' + error.message);
        setIsError(true);
      });
  };

  return (
    <div className="container mt-5">
      <h2>Perfil del Usuario</h2>
      {message && <div className={isError ? "alert alert-danger" : "alert alert-success"}>
        {message}
      </div>}
      <form onSubmit={handleSubmit}>
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
          <input type="email" className="form-control" name="correo" value={formData.correo} onChange={handleChange} disabled />
        </div>
        <button type="submit" className="btn btn-primary">Actualizar Datos</button>
      </form>
    </div>
  );
}

export default UserProfile;
