import React, { useEffect }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { openModal, closeModal } from '../flux/modalActions';
import selectors from '../flux/selectors';
import fondo3 from '../assets/img/fondo3.png';
import perfilImage from '../assets/img/perfil.png';
import configuracionIcon from '../assets/img/configuracion.png';
import gastosIcon from '../assets/img/administracion-gastos.png';
import tareasIcon from '../assets/img/administracion-tareas.png';
import direccionIcon from '../assets/img/direccion.png';
import RegistroInquilino from '../components/RegistroInquilino.jsx';
import EliminarInquilino from '../components/EliminarInquilino.jsx';
import AgregarTarea from '../components/AgregarTarea.jsx';
import EliminarTarea from '../components/EliminarTarea.jsx';
import AgregarGasto from '../components/AgregarGasto.jsx';
import EliminarGasto from '../components/EliminarGasto.jsx';
import CronometroSesion from '../components/CronometroSesion.jsx';
import MaquinaEscribirPanelAdmin from '../assets/js/maquinaEscribirPanelAdmin.js';

const PanelAdministracion = () => {
  const modalIsOpen = useSelector(selectors.selectModalIsOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const openModalAndRedirect = (path) => {
    dispatch(openModal());
    navigate(path);
  };

  useEffect(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const handleVolverAlHome = () => {
    navigate('/home-inquilino');
  };

  const handleEditarDireccionClick = () => {
    navigate('/editar-direccion');
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

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
            backgroundImage: `linear-gradient(rgba(0, 200, 100, 0.5), rgba(0, 200, 100, 0.5)), url(${fondo3})`,
            filter: 'opacity(0.2)',
            zIndex: -1,
          }}
        ></div>
        <CronometroSesion />
        <div className="row">
          <div className="col-12 col-md-4 d-flex flex-column align-items-center">
            <img src={configuracionIcon} alt="Panel de configuración" className="contenedor-administracion img-fluid img-configuracion" />
            <div className="d-md-flex flex-column align-items-center">
              <p className="bienvenido-texto-administracion mt-1 mb-4">Panel de configuración</p>
            </div>
            <MaquinaEscribirPanelAdmin />
          </div>

          <div className="col-12 col-md-8 text-center fila-imagen-personalizada d-flex flex-wrap">
            <div className="col-6 col-md-4 mb-md-3 mt-1" style={{ cursor: 'pointer' }}>
              <div className="contenedor-imagen contenedor-imagen-debajo" onClick={() => openModalAndRedirect('/agregar-gasto')}>
                <img src={gastosIcon} alt="Administrar gastos" className="img-fluid gastos-icon" />
              </div>
              <p className="texto-debajo-imagen">Administrar gastos</p>
              <p className="texto-debajo-imagen-sub" onClick={() => openModalAndRedirect('/agregar-gasto')} style={{ cursor: 'pointer' }}><strong>Agregar factura</strong></p>
              <p className="texto-debajo-imagen-sub" onClick={() => openModalAndRedirect('/eliminar-gasto')} style={{ cursor: 'pointer' }}><strong> Eliminar factura</strong></p>
            </div>

            <div className="col-6 col-md-4" style={{ cursor: 'pointer' }}>
              <div className="contenedor-imagen contenedor-imagen-debajo" onClick={() => openModalAndRedirect('/agregar-tarea')}>
                <img src={tareasIcon} alt="Administrar tareas" className="img-fluid administracion" />
              </div>
              <p className="texto-debajo-imagen">Administrar tareas</p>
              <p className="texto-debajo-imagen-sub" onClick={() => openModalAndRedirect('/agregar-tarea')} style={{ cursor: 'pointer' }}><strong>Agregar tarea</strong></p>
              <p className="texto-debajo-imagen-sub" onClick={() => openModalAndRedirect('/eliminar-tarea')} style={{ cursor: 'pointer' }}><strong>Eliminar tarea</strong></p>
            </div>

            <div className="col-6 col-md-4 mb-md-3">
              <div className="contenedor-imagen contenedor-imagen-debajo" onClick={() => openModalAndRedirect('/registro-inquilino')}>
                <img src={perfilImage} alt="Administrar Inquilinos" className="img-fluid" />
              </div>
              <p className="texto-debajo-imagen">Administrar Inquilinos</p>
              <p className="texto-debajo-imagen-sub" onClick={() => openModalAndRedirect('/registro-inquilino')} style={{ cursor: 'pointer' }}><strong>Agregar Inquilino</strong></p>
              <p className="texto-debajo-imagen-sub" onClick={() => openModalAndRedirect('/eliminar-inquilino')} style={{ cursor: 'pointer' }}><strong>Eliminar Inquilino</strong></p>
            </div>

            <div className="col-6 col-md-4 mb-md-3" style={{ cursor: 'pointer' }} onClick={handleEditarDireccionClick}>
              <div className="contenedor-imagen contenedor-imagen-debajo">
                <img src={direccionIcon} alt="Editar dirección" className="img-fluid img-editar-direccion" />
              </div>
              <p className="texto-debajo-imagen">Editar dirección</p>
            </div>
          </div>
        </div>

        {/* Botón para volver al Home del inquilino */}
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-primary" onClick={handleVolverAlHome}>
            Volver al Home
          </button>
        </div>
        {/* Renderizar los modales según la ruta actual */}
        {ReactDOM.createPortal(
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={handleCloseModal}
            contentLabel={
              location.pathname === '/registro-inquilino' ? 'RegistroInquilinoModal' :
                location.pathname === '/eliminar-inquilino' ? 'EliminarInquilinoModal' :
                  location.pathname === '/agregar-tarea' ? 'AgregarTareaModal' :
                    location.pathname === '/eliminar-tarea' ? 'EliminarTareaModal' :
                      location.pathname === '/agregar-gasto' ? 'AgregarGastoModal' :
                        location.pathname === '/eliminar-gasto' ? 'EliminarGastoModal' : ''
            }
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            {location.pathname === '/registro-inquilino' ? (
              <RegistroInquilino isOpen={modalIsOpen} onRequestClose={handleCloseModal} />
            ) : location.pathname === '/eliminar-inquilino' ? (
              <EliminarInquilino isOpen={modalIsOpen} onRequestClose={handleCloseModal} />
            ) : location.pathname === '/agregar-tarea' ? (
              <AgregarTarea isOpen={modalIsOpen} onRequestClose={handleCloseModal} />
            ) : location.pathname === '/eliminar-tarea' ? (
              <EliminarTarea isOpen={modalIsOpen} onRequestClose={handleCloseModal} />
            ) : location.pathname === '/agregar-gasto' ? (
              <AgregarGasto isOpen={modalIsOpen} onRequestClose={handleCloseModal} />
            ) : location.pathname === '/eliminar-gasto' ? (
              <EliminarGasto isOpen={modalIsOpen} onRequestClose={handleCloseModal} />
            ) : null}
          </Modal>,
          document.body
        )}
      </div>
    </div>
  );
};

export default PanelAdministracion;






