import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import perfilImage from '../assets/img/perfil.png';
import gastosImage from '../assets/img/gastos.png';
import tareasImage from '../assets/img/tareas.png';
import Perfil from '../components/Perfil.jsx';
import { openModal, closeModal } from '../flux/modalActions';

// Componente funcional para la vista del usuario Inquilino
const HomeInquilino = () => {
  // Hooks y redux
  const { user, modalIsOpen } = useSelector((state) => state);
  const username = user.nombre; //Modificado de username a nombre para que traiga el dato desde la api
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openModalAndRedirect = (path) => {
    // Abre el modal antes de la navegación
    dispatch(openModal());
    navigate(path);
  };

  // Función para abrir el modal de perfil
  const handleOpenPerfilModal = () => {
    openModalAndRedirect('/perfil');
  };

    // Definir handleCloseModal
    const handleCloseModal = () => {
      dispatch(closeModal());
      // Lógica adicional si es necesario
    };
  
    // Cerrar el modal en la primera renderización
    useEffect(() => {
      dispatch(closeModal());
    }, [dispatch]);

  // Estructura JSX para la vista del usuario Administrador
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

export default HomeInquilino;




