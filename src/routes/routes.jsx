import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { isTokenExpired, handleLogout } from '../services/tokenService';
import App from '../App.jsx';
import HomeAdministrador from '../views/HomeAdministrador.jsx';
import HomeInquilino from '../views/HomeInquilino.jsx';
import Perfil from '../components/Perfil.jsx';
import PanelAdministracion from '../views/PanelAdministracion.jsx';
import RegistroInquilino from '../components/RegistroInquilino.jsx';
import RegistroForm from '../components/RegistroForm.jsx';
import EliminarInquilino from '../components/EliminarInquilino.jsx';
import AgregarTarea from '../components/AgregarTarea.jsx';
import EliminarTarea from '../components/EliminarTarea.jsx';
import TareasPendientes from '../components/TareasPendientes.jsx';
import AgregarGasto from '../components/AgregarGasto.jsx';
import EliminarGasto from '../components/EliminarGasto.jsx';
import GastosPendientes from '../components/GastosPendientes.jsx';
import EditarDireccion from '../components/EditarDireccion.jsx';
import EditarPassword from '../components/EditarPassword.jsx';

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    const existingToken = sessionStorage.getItem('miToken');

    if (storedUserType && existingToken && window.location.pathname !== '/login') {
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
        '/tareas-pendientes',
        '/gastos-pendientes',
        '/perfil',
        '/editar-password'
      ];

      if (storedUserType.toLowerCase() === 'administrador') {
        if (allowedPathsForAdministrador.some(path => window.location.pathname.includes(path))) {
          checkTokenExpiration(); // Verifica el token antes de cargar la página protegida
          return;
        }
        navigate(`/home-${storedUserType.toLowerCase()}`, { replace: true });
      } else if (storedUserType.toLowerCase() === 'inquilino') {
        if (allowedPathsForInquilino.some(path => window.location.pathname.includes(path))) {
          checkTokenExpiration(); // Verifica el token antes de cargar la página protegida
          return;
        }
        navigate(`/home-${storedUserType.toLowerCase()}`, { replace: true });
      }
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
        path="/home-inquilino"
        element={<HomeInquilino onEnter={checkTokenExpiration} />}
      />
      <Route path="/perfil" element={<Perfil onEnter={checkTokenExpiration} />} />
      <Route path="/administrar-panel" element={<PanelAdministracion onEnter={checkTokenExpiration} />} />
      <Route path="/registro-inquilino" element={<RegistroInquilino onEnter={checkTokenExpiration} />} />
      <Route path="/eliminar-inquilino" element={<EliminarInquilino onEnter={checkTokenExpiration} />} />
      <Route path="/agregar-tarea" element={<AgregarTarea onEnter={checkTokenExpiration} />} />
      <Route path="/eliminar-tarea" element={<EliminarTarea onEnter={checkTokenExpiration} />} />
      <Route path="/tareas-pendientes" element={<TareasPendientes onEnter={checkTokenExpiration} />} />
      <Route path="/agregar-gasto" element={<AgregarGasto onEnter={checkTokenExpiration} />} />
      <Route path="/eliminar-gasto" element={<EliminarGasto onEnter={checkTokenExpiration} />} />
      <Route path="/editar-direccion" element={<EditarDireccion onEnter={checkTokenExpiration} />} />
      <Route path="/editar-password" element={<EditarPassword onEnter={checkTokenExpiration} />} />
      <Route path="/gastos-pendientes" element={<GastosPendientes onEnter={checkTokenExpiration} />} />

      {/* Ruta para cerrar sesión */}
      <Route path="/logout" element={<Navigate to="/" replace={true} state={{ from: '/' }} />} />
    </Routes>
  );
};

export default AppRoutes;















































