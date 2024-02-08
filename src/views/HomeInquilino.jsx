import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import { getUserByRut } from '../flux/userActions';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import fondo4 from '../assets/img/fondo4.png';
import perfilImage from '../assets/img/perfil.png';
import gastosImage from '../assets/img/gastos.png';
import tareasImage from '../assets/img/tareas.png';
import Perfil from '../components/Perfil.jsx';
import { openModal, closeModal } from '../flux/modalActions';
import TareasPendientes from '../components/TareasPendientes.jsx';
import GastosPendientes from '../components/GastosPendientes.jsx';
import CronometroSesion from '../components/CronometroSesion.jsx';
import MaquinaEscribirInquilino from '../assets/js/maquinaEscribirInquilino.js';

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

  // Obtener datos del usuario por su Rut al cargar el componente
  useEffect(() => {
    dispatch(getUserByRut());
  }, [dispatch]);

  // Función para abrir el modal y redirigir a una ruta específica
  const openModalAndRedirect = (path) => {
    dispatch(openModal()); // Despachar la acción para abrir el modal
    navigate(path); // Navegar a la ruta especificada
  };

  // Función para abrir el modal del perfil
  const handleOpenPerfilModal = () => {
    openModalAndRedirect('/perfil');
  };

  // Función para abrir el modal de tareas
  const handleOpenTareasModal = () => {
    openModalAndRedirect('/tareas-pendientes');
  };

  // Función para abrir el modal de gastos
  const handleOpenGastosModal = () => {
    openModalAndRedirect('/gastos-pendientes');
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
    <div className="contenedor-principal">
      <div className="contenedor mt-4 mb-4 p-4" style={{ position: 'relative' }}>
        {/* Pseudoelemento para desaturar la imagen de fondo */}
        <div
          className="imagen-fondo-desaturada"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `linear-gradient(rgba(200, 200, 0, 0.5), rgba(150, 150, 150, 0.5)), url(${fondo4})`,
            filter: 'opacity(0.3)',
            zIndex: -1,
          }}
        ></div>
        {/* Componente CronometroSesion */}
        <CronometroSesion />
        <div className="row">
          {/* Sección del logo y nombre de usuario */}
          <div className="col-12 col-md-4 d-flex flex-column align-items-center">
            <img src={logo} alt="Logo" className="contenedor-administrador img-fluid img-logo-administrador" />
            <div className="d-md-flex align-items-center">
              <p className="bienvenido-texto-inquilino">Bienvenido, {username}</p>
            </div>
            <div className="row mb-4 ms-2">
              <MaquinaEscribirInquilino />
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
              <div className="contenedor-imagen contenedor-imagen-debajo" onClick={handleOpenGastosModal}>
                <img src={gastosImage} alt="Cuentas pendientes" className="img-fluid" />
              </div>
              <p className="texto-debajo-imagen">Cuentas pendientes</p>
            </div>

            {/* Icono "Tareas pendientes" */}
            <div className="col-6 col-md-6 mb-3">
              <div className="contenedor-imagen contenedor-imagen-debajo" onClick={handleOpenTareasModal}>
                <img src={tareasImage} alt="Tareas pendientes" className="img-fluid" />
              </div>
              <p className="texto-debajo-imagen">Tareas pendientes</p>
            </div>
          </div>
        </div>

        {/* Modal de perfil, tareas pendientes o gastos pendientes */}
        {ReactDOM.createPortal(
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={handleCloseModal}
            contentLabel={
              location.pathname === '/perfil' ? 'Perfil Modal' :
                location.pathname === '/tareas-pendientes' ? 'Tareas Pendientes Modal' :
                  location.pathname === '/gastos-pendientes' ? 'Gastos Pendientes Modal' : ''
            }
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            {/* Contenido del modal (Perfil, TareasPendientes o GastosPendientes) */}
            {location.pathname === '/perfil' ? (
              <Perfil />
            ) : location.pathname === '/tareas-pendientes' ? (
              <TareasPendientes />
            ) : location.pathname === '/gastos-pendientes' ? (
              <GastosPendientes />
            ) : null}
          </Modal>,
          document.body
        )}
      </div>
    </div>
  );
};

export default HomeInquilino;






