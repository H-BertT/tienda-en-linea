import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { useAuth } from '../Auth/AuthContext'; // Verifica que la ruta de importación sea correcta

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirige al usuario a la página de inicio de sesión después de cerrar sesión
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Tienda En Línea
        </Typography>
        <Button color="inherit" component={Link} to="/">Inicio</Button>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/cart">Carrito</Button>
            {user.permiso === 'administrador' && (
              <>
                <Button color="inherit" component={Link} to="/admin/products">Administrar Productos</Button>
                <Button color="inherit" component={Link} to="/analytics">Análisis</Button>
              </>
            )}
            <Button color="inherit" onClick={handleLogout}>Cerrar Sesión</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Iniciar Sesión</Button>
            <Button color="inherit" component={Link} to="/register">Registrar</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
