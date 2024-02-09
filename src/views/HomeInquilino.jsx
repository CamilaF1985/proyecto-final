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
import TareasPendientes from '../components/TareasPendientes.jsx';
import GastosPendientes from '../components/GastosPendientes.jsx';
import CronometroSesion from '../components/CronometroSesion.jsx';
import MaquinaEscribirInquilino from '../assets/js/maquinaEscribirInquilino.js';

import { openModal, closeModal } from '../flux/modalActions';
import selectors from '../flux/selectors';

const HomeInquilino = () => {
  const user = useSelector(selectors.selectUser);
  const modalIsOpen = useSelector(selectors.selectModalIsOpen);
  const username = user.nombre;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(getUserByRut());
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
      <div className="contenedor mt-4 mb-4 p-4" style={{ position: 'relative' }}>
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
        <CronometroSesion />
        <div className="row">
          <div className="col-12 col-md-4 d-flex flex-column align-items-center">
            <img src={logo} alt="Logo" className="contenedor-administrador img-fluid img-logo-administrador" />
            <div className="d-md-flex align-items-center">
              <p className="bienvenido-texto-inquilino">Bienvenido, {username}</p>
            </div>
            <div className="row mb-4 ms-2">
              <MaquinaEscribirInquilino />
            </div>
          </div>

          <div className="col-12 col-md-8 text-center fila-imagen-personalizada d-flex flex-wrap">
            <div className="col-6 col-md-6 mb-3" style={{ cursor: 'pointer' }}>
              <div className="contenedor-imagen contenedor-imagen-debajo contenedor-imagen-primera" onClick={() => openModalAndRedirect('/perfil-inquilino')}>
                <img src={perfilImage} alt="Mi perfil" className="img-fluid" />
              </div>
              <p className="texto-debajo-imagen">Mi perfil</p>
            </div>
            <div className="col-6 col-md-4 mb-md-3">
              <div className="contenedor-imagen contenedor-imagen-debajo" onClick={() => openModalAndRedirect('/gastos-pendientes-inquilino')}>
                <img src={gastosImage} alt="Cuentas pendientes" className="img-fluid" />
              </div>
              <p className="texto-debajo-imagen">Cuentas pendientes</p>
            </div>
            <div className="col-6 col-md-6 mb-3">
              <div className="contenedor-imagen contenedor-imagen-debajo" onClick={() => openModalAndRedirect('/tareas-pendientes-inquilino')}>
                <img src={tareasImage} alt="Tareas pendientes" className="img-fluid" />
              </div>
              <p className="texto-debajo-imagen">Tareas pendientes</p>
            </div>
          </div>
        </div>

        {ReactDOM.createPortal(
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={handleCloseModal}
            contentLabel={
              location.pathname === '/perfil-inquilino' ? 'PerfilInquilinoModal' :
                location.pathname === '/tareas-pendientes-inquilino' ? 'TareasPendientesInquilinoModal' :
                  location.pathname === '/gastos-pendientes-inquilino' ? 'GastosPendientesInquilinoModal' : ''
            }
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            {location.pathname === '/perfil-inquilino' ? (
              <Perfil />
            ) : location.pathname === '/tareas-pendientes-inquilino' ? (
              <TareasPendientes />
            ) : location.pathname === '/gastos-pendientes-inquilino' ? (
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







