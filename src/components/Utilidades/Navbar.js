import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext"; // Ajusta la ruta de importación según tu estructura

const Navbar = () => {
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
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Tienda En Línea
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Inicio
        </Button>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/user">
              {user.displayName || "Perfil"}
            </Button>
            <Button color="inherit" component={Link} to="/productos">
              Productos
            </Button>
            <Button color="inherit" component={Link} to="/cart">
              Carrito
            </Button>
            {user.rol === "administrador" && (
              <>
                <Button color="inherit" component={Link} to="/admin/products">
                  Administrar Productos
                </Button>
                <Button color="inherit" component={Link} to="/analytics">
                  Análisis
                </Button>
              </>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Iniciar Sesión
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Registrar
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
