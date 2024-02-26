import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { isTokenExpired, handleLogout } from '../services/tokenService';
import App from '../App.jsx';
import HomeAdministrador from '../views/HomeAdministrador.jsx';
import HomeInquilino from '../views/HomeInquilino.jsx';
import PanelAdministracion from '../views/PanelAdministracion.jsx';
import RegistroForm from '../components/RegistroForm.jsx';
import EditarDireccion from '../components/EditarDireccion.jsx';
import EditarPassword from '../components/EditarPassword.jsx';

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificaciones de tipo de usuario y token para las vistas protegidas
    const storedUserType = localStorage.getItem('userType');
    const existingToken = sessionStorage.getItem('miToken');
    const currentPath = window.location.pathname;

    if (storedUserType && existingToken && currentPath !== '/login') {
      const allowedPathsForAdministrador = [
        '/administrar-panel',
        '/registro-inquilino',
        '/eliminar-inquilino',
        '/agregar-tarea',
        '/eliminar-tarea',
        '/tareas-pendientes',
        '/gastos-pendientes',
        '/agregar-gasto',
        '/eliminar-gasto',
        '/editar-direccion',
        '/perfil',
        '/editar-password'
      ];

      const allowedPathsForInquilino = [
        '/tareas-pendientes-inquilino',
        '/gastos-pendientes-inquilino',
        '/perfil-inquilino',
        '/editar-password'
      ];

      if (storedUserType.toLowerCase() === 'administrador') {
        if (!allowedPathsForAdministrador.some(path => currentPath.includes(path))) {
          navigate(`/home-administrador`, { replace: true });
          return;

        } else if (currentPath.includes('/perfil-inquilino')) {
          navigate(`/perfil`, { replace: true });
          return;

        } else if (currentPath.includes('/tareas-pendientes-inquilino')) {
          navigate(`/tareas-pendientes`, { replace: true });
          return;

        } else if (currentPath.includes('/gastos-pendientes-inquilino')) {
          navigate(`/gastos-pendientes`, { replace: true });
          return;

        }
      } else if (storedUserType.toLowerCase() === 'inquilino') {
        if (!allowedPathsForInquilino.some(path => currentPath.includes(path))) {
          navigate(`/home-inquilino`, { replace: true });
          return;

        } else if (currentPath.includes('/home-administrador')) {
          navigate(`/home-inquilino`, { replace: true });
          return;
        }
      }

      // Verifica el token antes de cargar la página protegida
      checkTokenExpiration();
    }
  }, [navigate]);

  // Función para verificar el token al cargar una ruta protegida
  const checkTokenExpiration = () => {
    if (isTokenExpired()) {
      // Token expirado, realiza acciones de cierre de sesión
      handleLogout(navigate);
    }
  };

  // Estructura JSX para definir las rutas de la aplicación
  return (
    <Routes>
      {/* Rutas principales */}
      <Route path="/" element={<App showModal={true} loginModal={true} />} />
      <Route path="/login" element={<App showModal={true} loginModal={true} />} />
      <Route path="/contacto" element={<App showModal={true} contactModal={true} />} />
      <Route path="/registro" element={<RegistroForm />} />

      {/* Rutas para vistas y componentes específicos */}
      <Route
        path="/home-administrador"
        element={<HomeAdministrador onEnter={checkTokenExpiration} />}
      />
      <Route
        path="/perfil"
        element={<HomeAdministrador onEnter={checkTokenExpiration} showModal={true} perfilModal={true} />}
      />
      <Route
        path="/tareas-pendientes"
        element={<HomeAdministrador onEnter={checkTokenExpiration} showModal={true} tareasPendientesModal={true} />}
      />
      <Route
        path="/gastos-pendientes"
        element={<HomeAdministrador onEnter={checkTokenExpiration} showModal={true} gastosPendientesModal={true} />}
      />
      {/* Rutas para vistas y componentes específicos del inquilino */}
      <Route
        path="/home-inquilino"
        element={<HomeInquilino onEnter={checkTokenExpiration} />}
      />
      <Route
        path="/perfil-inquilino"
        element={<HomeInquilino onEnter={checkTokenExpiration} showModal={true} perfilInquilinoModal={true} />}
      />
      <Route
        path="/tareas-pendientes-inquilino"
        element={<HomeInquilino onEnter={checkTokenExpiration} showModal={true} tareasPendientesInquilinoModal={true} />}
      />
      <Route
        path="/gastos-pendientes-inquilino"
        element={<HomeInquilino onEnter={checkTokenExpiration} showModal={true} gastosPendientesInquilinoModal={true} />}
      />
      <Route path="/administrar-panel" element={<PanelAdministracion onEnter={checkTokenExpiration} />} />
      <Route
        path="/registro-inquilino"
        element={<PanelAdministracion onEnter={checkTokenExpiration} showModal={true} registroInquilinoModal={true} />}
      />
      <Route
        path="/eliminar-inquilino"
        element={<PanelAdministracion onEnter={checkTokenExpiration} showModal={true} eliminarInquilinoModal={true} />}
      />
      <Route
        path="/agregar-tarea"
        element={<PanelAdministracion onEnter={checkTokenExpiration} showModal={true} agregarTareaModal={true} />}
      />
      <Route
        path="/eliminar-tarea"
        element={<PanelAdministracion onEnter={checkTokenExpiration} showModal={true} eliminarTareaModal={true} />}
      />
      <Route
        path="/agregar-gasto"
        element={<PanelAdministracion onEnter={checkTokenExpiration} showModal={true} agregarGastoModal={true} />}
      />
      <Route
        path="/eliminar-gasto"
        element={<PanelAdministracion onEnter={checkTokenExpiration} showModal={true} eliminarGastoModal={true} />}
      />
      <Route path="/editar-direccion" element={<EditarDireccion onEnter={checkTokenExpiration} />} />
      <Route path="/editar-password" element={<EditarPassword onEnter={checkTokenExpiration} />} />

      {/* Ruta para cerrar sesión */}
      <Route path="/logout" element={<Navigate to="/" replace={true} state={{ from: '/' }} />} />
    </Routes>
  );
};

export default AppRoutes;

















































