import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserByRut } from '../flux/userActions';
import { openModal, closeModal } from '../flux/modalActions';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import logo from '../assets/img/logo.png';
import perfilImage from '../assets/img/perfil.png';
import gastosImage from '../assets/img/gastos.png';
import tareasImage from '../assets/img/tareas.png';
import configuracionImage from '../assets/img/configuracion.png';
import Perfil from '../components/Perfil.jsx';

// Importar los selectores desde el archivo selectors.js
import {
  selectUser,
  selectModalIsOpen,
} from '../flux/selectors';

const HomeAdministrador = () => {
  // Utilizar los selectores para obtener datos del estado global
  const user = useSelector(selectUser);
  const modalIsOpen = useSelector(selectModalIsOpen);

  // Obtener el despachador y funciones de navegación desde React Redux y React Router
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener datos del usuario por su Rut al cargar el componente
  useEffect(() => {
    dispatch(getUserByRut());
  }, [dispatch]);

  // Extraer el nombre de usuario del estado
  const username = user.nombre;

  // Función para abrir el modal y redirigir a una ruta específica
  const openModalAndRedirect = (path) => {
    dispatch(openModal());
    navigate(path);
  };

  // Función para abrir el modal de perfil
  const handleOpenPerfilModal = () => {
    openModalAndRedirect('/perfil');
  };

  // Función para navegar a la página de administración
  const handleNavigateToAdminPanel = () => {
    navigate('/administrar-panel');
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  // Cerrar el modal en la primera renderización
  useEffect(() => {
    dispatch(closeModal());
  }, [dispatch]);

  // Estructura JSX para la vista del administrador
  return (
    <div className="contenedor mt-4 mb-4 p-4">
      <div className="row">
        {/* Sección del logo y nombre de usuario */}
        <div className="col-12 col-md-4 d-flex flex-column align-items-center">
          <img src={logo} alt="Logo" className="contenedor-logo img-fluid img-logo" />
          <div className="d-md-flex flex-column align-items-center ms-md-3">
            <p className="bienvenido-texto">Bienvenido,</p>
            <div className="nombre-apellido-container">
              <p className="nombre-apellido-texto nombre-texto">{username}</p>
            </div>
          </div>
        </div>

        {/* Sección de iconos y acciones */}
        <div className="col-12 col-md-8 text-center fila-imagen-personalizada d-flex flex-wrap">
          {/* Icono "Mi perfil" */}
          <div className="col-6 col-md-6 mb-3" style={{ cursor: 'pointer' }}>
            <div className="contenedor-imagen contenedor-imagen-debajo contenedor-imagen-primera" onClick={handleOpenPerfilModal}>
              <img src={perfilImage} alt="Mi perfil" className="img-fluid" />
            </div>
            <p className="texto-debajo-imagen">Mi perfil</p>
          </div>

          {/* Icono "Cuentas pendientes" */}
          <div className="col-6 col-md-4 mb-md-3">
            <div className="contenedor-imagen contenedor-imagen-debajo">
              <img src={gastosImage} alt="Cuentas pendientes" className="img-fluid" />
            </div>
            <p className="texto-debajo-imagen">Cuentas pendientes</p>
          </div>

          {/* Icono "Tareas pendientes" */}
          <div className="col-6 col-md-6 mb-3">
            <div className="contenedor-imagen contenedor-imagen-debajo">
              <img src={tareasImage} alt="Tareas pendientes" className="img-fluid" />
            </div>
            <p className="texto-debajo-imagen">Tareas pendientes</p>
          </div>

          {/* Icono "Administración" */}
          <div className="col-6 col-md-4 mb-md-3" onClick={handleNavigateToAdminPanel} style={{ cursor: 'pointer' }}>
            <div className="contenedor-imagen contenedor-imagen-debajo">
              <img src={configuracionImage} alt="Administración" className="img-fluid icono-administracion" />
              <p className="texto-debajo-imagen">Administración</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de perfil */}
      {ReactDOM.createPortal(
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Perfil Modal"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          {/* Contenido del modal (Perfil en lugar de PerfilForm) */}
          {location.pathname === '/perfil' ? (
            <Perfil />
          ) : null}
        </Modal>,
        document.body
      )}
    </div>
  );
};

export default HomeAdministrador;



























