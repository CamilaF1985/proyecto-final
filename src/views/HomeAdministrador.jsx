import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserByRut } from '../flux/userActions';
import { openModal, closeModal } from '../flux/modalActions';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import logo from '../assets/img/logo.png';
import fondo2 from '../assets/img/fondo2.png';
import perfilImage from '../assets/img/perfil.png';
import gastosImage from '../assets/img/gastos.png';
import tareasImage from '../assets/img/tareas.png';
import configuracionImage from '../assets/img/configuracion.png';
import Perfil from '../components/Perfil.jsx';
import TareasPendientes from '../components/TareasPendientes.jsx';
import GastosPendientes from '../components/GastosPendientes.jsx';
import CronometroSesion from '../components/CronometroSesion.jsx';
import MaquinaEscribirAdmin from '../assets/js/maquinaEscribirAdmin.js';
import selectors from '../flux/selectors';

const HomeAdministrador = () => {
  const user = useSelector(selectors.selectUser);
  const modalIsOpen = useSelector(selectors.selectModalIsOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const username = user.nombre;

  useEffect(() => {
    dispatch(getUserByRut());
  }, [dispatch]);

  useEffect(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const openModalAndRedirect = (path) => {
    dispatch(openModal());
    navigate(path);
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  useEffect(() => {
    dispatch(closeModal());
  }, [dispatch]);

  return (
    <div className="contenedor-principal">
      <div className="contenedor mt-4 p-3" style={{ position: 'relative' }}>
        <div
          className="imagen-fondo-desaturada"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `linear-gradient(rgba(100,0,200,0.5), rgba(100,0,200,0.5)), url(${fondo2})`,
            filter: 'opacity(0.2)',
            zIndex: -1,
          }}
        ></div>
        <CronometroSesion />
        <div className="row">
          <div className="col-12 col-md-4 d-flex flex-column align-items-center">
            <img src={logo} alt="Logo" className="contenedor-logo-administrador img-fluid img-logo-administrador" />
            <div className="d-md-flex align-items-center ms-2">
              <p className="bienvenido-texto">Hola, {username}</p>
            </div>
            <div className="row mb-4 ms-2">
              <MaquinaEscribirAdmin />
            </div>
          </div>

          <div className="col-12 col-md-8 text-center fila-imagen-personalizada d-flex flex-wrap">
            <div className="col-6 col-md-6 mb-3" style={{ cursor: 'pointer' }}>
              <div className="contenedor-imagen contenedor-imagen-debajo contenedor-imagen-primera" onClick={() => openModalAndRedirect('/perfil')}>
                <img src={perfilImage} alt="Mi perfil" className="img-fluid" />
              </div>
              <p className="texto-debajo-imagen">Mi perfil</p>
            </div>
            <div className="col-6 col-md-4 mb-md-3">
              <div className="contenedor-imagen contenedor-imagen-debajo" onClick={() => openModalAndRedirect('/gastos-pendientes')}>
                <img src={gastosImage} alt="Cuentas pendientes" className="img-fluid" />
              </div>
              <p className="texto-debajo-imagen">Cuentas pendientes</p>
            </div>
            <div className="col-6 col-md-6 mb-3">
              <div className="contenedor-imagen contenedor-imagen-debajo" onClick={() => openModalAndRedirect('/tareas-pendientes')}>
                <img src={tareasImage} alt="Tareas pendientes" className="img-fluid" />
              </div>
              <p className="texto-debajo-imagen">Tareas pendientes</p>
            </div>
            <div className="col-6 col-md-4 mb-3" style={{ cursor: 'pointer' }}>
              <div className="contenedor-imagen contenedor-imagen-debajo" onClick={() => navigate('/administrar-panel')}>
                <img src={configuracionImage} alt="Administración" className="img-fluid icono-administracion" />
                <p className="texto-debajo-imagen">Administración</p>
              </div>
            </div>
          </div>
        </div>

        {ReactDOM.createPortal(
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={handleCloseModal}
            contentLabel={
              location.pathname === '/perfil' ? 'PerfilModal' :
                location.pathname === '/tareas-pendientes' ? 'TareasPendientesModal' :
                  location.pathname === '/gastos-pendientes' ? 'GastosPendientesModal' : ''
            }
            className="modal-content"
            overlayClassName="modal-overlay"
          >
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

export default HomeAdministrador;




























