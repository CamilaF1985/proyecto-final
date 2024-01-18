import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import perfilImage from '../assets/img/perfil.png';
import gastosImage from '../assets/img/gastos.png';
import tareasImage from '../assets/img/tareas.png';
import Perfil from '../components/Perfil.jsx';
import { openModal, closeModal } from '../flux/modalActions';

// Importar los selectores desde el archivo selectors.js
import selectors from '../flux/selectors';

const HomeInquilino = () => {
  // Utilizar selectores para obtener datos del estado
  const user = useSelector(selectors.selectUser);
  const modalIsOpen = useSelector(selectors.selectModalIsOpen);
  const username = user.nombre; // Obtener el nombre del usuario desde el estado
  const dispatch = useDispatch(); // Obtener la función de despacho de acciones
  const navigate = useNavigate(); // Obtener la función de navegación
  const location = useLocation(); // Obtener la ubicación actual de la ruta

  // Función para abrir el modal y redirigir a una ruta específica
  const openModalAndRedirect = (path) => {
    dispatch(openModal()); // Despachar la acción para abrir el modal
    navigate(path); // Navegar a la ruta especificada
  };

  // Función para abrir el modal del perfil
  const handleOpenPerfilModal = () => {
    openModalAndRedirect('/perfil');
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    dispatch(closeModal()); // Despachar la acción para cerrar el modal
  };

  // Efecto para cerrar el modal en la primera renderización
  useEffect(() => {
    dispatch(closeModal()); // Despachar la acción para cerrar el modal
  }, [dispatch]);

  // Estructura JSX para la vista del usuario Inquilino
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
        </div>
      </div>

      {/* Modal de perfil utilizando ReactDOM.createPortal */}
      {ReactDOM.createPortal(
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Perfil Modal"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          {/* Contenido del modal de perfil */}
          {location.pathname === '/perfil' ? (
            <Perfil />
          ) : null}
        </Modal>,
        document.body
      )}
    </div>
  );
};

export default HomeInquilino;






