import React from "react";
import { AppBar, Toolbar, Typography, Button, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext"; // Ajusta la ruta de importación según tu estructura

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'rgba(155, 103, 60, 0.4)', // Color café semitransparente
    boxShadow: 'none', // Elimina la sombra para un efecto más limpio
  },
  linkButton: {
    color: '#000000', // Letras blancas para mejor contraste
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: '#FFFFFF' // Efecto suave al pasar el mouse
    },
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, color:'#000000', fontWeight: 'bolder' }}>
          Tienda En Línea
        </Typography>
        <Button className={classes.linkButton} component={Link} to="/">
          Inicio
        </Button>
        {user ? (
          <>
            <Button className={classes.linkButton} component={Link} to="/user">
              {user.displayName || "Perfil"}
            </Button>
            <Button className={classes.linkButton} component={Link} to="/productos">
              Productos
            </Button>
            <Button className={classes.linkButton} component={Link} to="/cart">
              Carrito
            </Button>
            <Button className={classes.linkButton} component={Link} to="/historial">
              Historial de compras
            </Button>
            {user.rol === "administrador" && (
              <>
                <Button className={classes.linkButton} component={Link} to="/admin/products">
                  Administrar Productos
                </Button>
              </>
            )}
            <Button className={classes.linkButton} onClick={handleLogout} component={Link} to="/">
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <>
            <Button className={classes.linkButton} component={Link} to="/login">
              Iniciar Sesión
            </Button>
            <Button className={classes.linkButton} component={Link} to="/register">
              Registrar
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
