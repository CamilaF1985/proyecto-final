import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RegistroInquilino from '../components/RegistroInquilino.jsx';
import EliminarInquilino from '../components/EliminarInquilino.jsx';
import AgregarTarea from '../components/AgregarTarea.jsx';
import EliminarTarea from '../components/EliminarTarea.jsx';
import AgregarGasto from '../components/AgregarGasto.jsx';
import EliminarGasto from '../components/EliminarGasto.jsx';
import { setModalState, openModal } from '../flux/modalActions';
import { useNavigate } from 'react-router-dom';
import configuracionIcon from '../assets/img/configuracion.png';
import gastosIcon from '../assets/img/administracion-gastos.png';
import tareasIcon from '../assets/img/administracion-tareas.png';
import perfilImage from '../assets/img/perfil.png';

// Componente funcional para la vista del panel de administración
const PanelAdministracion = () => {
  // Hooks y redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { modalIsOpen } = useSelector((state) => state);

  // Función para abrir el modal y navegar a la ruta de RegistroInquilino
  const handleOpenRegistroInquilinoModal = () => {
    dispatch(openModal());
    navigate('/registro-inquilino');
  };

  // Función para abrir el modal y navegar a la ruta de EliminarInquilino
  const handleOpenEliminarInquilinoModal = () => {
    dispatch(openModal());
    navigate('/eliminar-inquilino');
  };

  // Función para abrir el modal y navegar a la ruta de AgregarTarea
  const handleOpenAgregarTareaModal = () => {
    dispatch(openModal());
    navigate('/agregar-tarea');
  };

  // Función para abrir el modal y navegar a la ruta de EliminarTarea
  const handleOpenEliminarTareaModal = () => {
    dispatch(openModal());
    navigate('/eliminar-tarea');
  };

  // Función para abrir el modal y navegar a la ruta de AgregarGasto
  const handleOpenAgregarGastoModal = () => {
    dispatch(openModal());
    navigate('/agregar-gasto');
  };

  // Función para abrir el modal y navegar a la ruta de EliminarGasto
  const handleOpenEliminarGastoModal = () => {
    dispatch(openModal());
    navigate('/eliminar-gasto');
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    dispatch(setModalState(false));
  };

  // Función para volver al Home del inquilino
  const handleVolverAlHome = () => {
    navigate('/home-inquilino');
  };

  // Función para determinar qué componente de modal Inquilino renderizar según la ruta actual
  const renderInquilinoModal = () => {
    const currentPath = window.location.pathname;

    if (currentPath === '/registro-inquilino') {
      return <RegistroInquilino isOpen={modalIsOpen} onRequestClose={handleCloseModal} RegistroInquilinoModal={true} />;
    } else if (currentPath === '/eliminar-inquilino') {
      return <EliminarInquilino isOpen={modalIsOpen} onRequestClose={handleCloseModal} EliminarInquilinoModal={true} />;
    } else {
      return null;
    }
  };

  // Función para determinar qué componente de modal Tarea renderizar según la ruta actual
  const renderTareaModal = () => {
    const currentPath = window.location.pathname;

    if (currentPath === '/agregar-tarea') {
      return <AgregarTarea isOpen={modalIsOpen} onRequestClose={handleCloseModal} AgregarTareaModal={true} />;
    } else if (currentPath === '/eliminar-tarea') {
      return <EliminarTarea isOpen={modalIsOpen} onRequestClose={handleCloseModal} EliminarTareaModal={true} />;
    } else {
      return null;
    }
  };

  // Función para determinar qué componente de modal Gasto renderizar según la ruta actual
  const renderGastoModal = () => {
    const currentPath = window.location.pathname;

    if (currentPath === '/agregar-gasto') {
      return <AgregarGasto isOpen={modalIsOpen} onRequestClose={handleCloseModal} AgregarGastoModal={true} />;
    } else if (currentPath === '/eliminar-gasto') {
      return <EliminarGasto isOpen={modalIsOpen} onRequestClose={handleCloseModal} EliminarGastoModal={true} />;
    } else {
      return null;
    }
  };


  // Estructura JSX para la vista del panel de administración
  return (
    <div className="contenedor mt-4 mb-4 p-4">
      <div className="row">
        {/* Sección del icono de configuración */}
        <div className="col-12 col-md-4 d-flex flex-column align-items-center">
          <img src={configuracionIcon} alt="Panel de configuración" className="contenedor-logo img-fluid img-logo" />
          <div className="d-md-flex flex-column align-items-center ms-md-3">
            <p className="bienvenido-texto">Panel de configuración</p>
          </div>
        </div>

        {/* Sección de iconos y acciones de administración */}
        <div className="col-12 col-md-8 text-center fila-imagen-personalizada d-flex flex-wrap">
          {/* Icono "Administrar gastos" */}
          <div className="col-6 col-md-4 mb-md-3" style={{ cursor: 'pointer' }}>
            <div className="contenedor-imagen contenedor-imagen-debajo">
              <img src={gastosIcon} alt="Administrar gastos" className="img-fluid" />
            </div>
            <p className="texto-debajo-imagen">Administrar gastos</p>
            <p className="texto-debajo-imagen-sub" onClick={handleOpenAgregarGastoModal} style={{ cursor: 'pointer' }}>
              Agregar factura</p>
            <p className="texto-debajo-imagen-sub" onClick={handleOpenEliminarGastoModal} style={{ cursor: 'pointer' }}>
              Eliminar factura</p>
          </div>

          {/* Icono "Administrar tareas" */}
          <div className="col-6 col-md-4 mb-md-3" style={{ cursor: 'pointer' }}>
            <div className="contenedor-imagen contenedor-imagen-debajo">
              <img src={tareasIcon} alt="Administrar tareas" className="img-fluid" />
            </div>
            <p className="texto-debajo-imagen">Administrar tareas</p>
            <p className="texto-debajo-imagen-sub" onClick={handleOpenAgregarTareaModal} style={{ cursor: 'pointer' }}>
              Agregar tarea</p>
            <p className="texto-debajo-imagen-sub" onClick={handleOpenEliminarTareaModal} style={{ cursor: 'pointer' }}>
              Eliminar tarea</p>
          </div>

          {/* Texto "Administrar Inquilinos" */}
          <div className="col-6 col-md-4 mb-md-3">
            <div className="contenedor-imagen contenedor-imagen-debajo">
              <img src={perfilImage} alt="Administrar Inquilinos" className="img-fluid" />
            </div>
            <p className="texto-debajo-imagen">Administrar Inquilinos</p>
            <p className="texto-debajo-imagen-sub" onClick={handleOpenRegistroInquilinoModal} style={{ cursor: 'pointer' }}>
              Agregar Inquilino
            </p>
            <p className="texto-debajo-imagen-sub" onClick={handleOpenEliminarInquilinoModal} style={{ cursor: 'pointer' }}>
              Eliminar Inquilino</p>
          </div>
        </div>
      </div>

      {/* Botón "Volver al Home" */}
      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-primary" onClick={handleVolverAlHome}>
          Volver al Home
        </button>
      </div>

      {/* Renderizar el componente de modal según la ruta */}
      {renderInquilinoModal()}
      {renderTareaModal()}
      {renderGastoModal()}
    </div>
  );
};

// Exportar el componente PanelAdministracion
export default PanelAdministracion;

