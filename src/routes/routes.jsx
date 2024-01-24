// Importaciones de módulos y componentes
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

// Componente funcional para manejar las rutas de la aplicación
const AppRoutes = () => {
  // Obtiene la función de navegación mediante el hook useNavigate
  const navigate = useNavigate();

  // Efecto que se ejecuta al cargar el componente para gestionar las rutas según el tipo de usuario almacenado
  useEffect(() => {
    // Obtiene el tipo de usuario almacenado en el localStorage
    const storedUserType = localStorage.getItem('userType');

    // Verifica si el tipo de usuario está presente
    if (storedUserType) {
      // Define las rutas permitidas para el usuario administrador
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
        '/perfil'
      ];

      // Define las rutas permitidas para el usuario inquilino
      const allowedPathsForInquilino = [
        '/tareas-pendientes',
        '/gastos-pendientes',
        '/perfil'
      ];

      // Verifica el tipo de usuario y redirige según las rutas permitidas
      if (storedUserType.toLowerCase() === 'administrador') {
        // Permite el acceso a /registro-inquilino para usuarios administradores
        if (allowedPathsForAdministrador.some(path => window.location.pathname.includes(path))) {
          return;
        }
        navigate(`/home-${storedUserType.toLowerCase()}`, { replace: true });
      } else if (storedUserType.toLowerCase() === 'inquilino') {
        // Permite el acceso a /tareas-pendientes y /perfil para usuarios inquilinos
        if (allowedPathsForInquilino.some(path => window.location.pathname.includes(path))) {
          return;
        }
        navigate(`/home-${storedUserType.toLowerCase()}`, { replace: true });
      }
    }
  }, [navigate]);

  // Estructura JSX para definir las rutas de la aplicación
  return (
    <Routes>
      {/* Rutas principales */}
      <Route path="/" element={<App showModal={true} loginModal={true} />} />
      <Route path="/login" element={<App showModal={true} loginModal={true} />} />
      <Route path="/contacto" element={<App showModal={true} contactModal={true} />} />
      <Route path="/registro" element={<RegistroForm />} />

      {/* Rutas para vistas y componentes específicos */}
      <Route path="/home-administrador" element={<HomeAdministrador />} />
      <Route path="/home-inquilino" element={<HomeInquilino />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/administrar-panel" element={<PanelAdministracion />} />
      <Route path="/registro-inquilino" element={<RegistroInquilino />} />
      <Route path="/eliminar-inquilino" element={<EliminarInquilino />} />
      <Route path="/agregar-tarea" element={<AgregarTarea />} />
      <Route path="/eliminar-tarea" element={<EliminarTarea />} />
      <Route path="/tareas-pendientes" element={<TareasPendientes />} />
      <Route path="/agregar-gasto" element={<AgregarGasto />} />
      <Route path="/eliminar-gasto" element={<EliminarGasto />} />
      <Route path="/gastos-pendientes" element={<GastosPendientes />} />

      {/* Ruta para cerrar sesión */}
      <Route path="/logout" element={<Navigate to="/" replace={true} state={{ from: '/' }} />} />

    </Routes>
  );
};

// Exporta el componente AppRoutes para su uso en la aplicación
export default AppRoutes;














































