import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openModal, closeModal, closeModalAndRedirect } from './flux/modalActions';
import Modal from 'react-modal';
import LoginForm from './components/LoginForm.jsx';
import ContactForm from './components/ContactForm.jsx';
import RegistroForm from './components/RegistroForm.jsx';
import ImageCarousel from './components/ImageCarousel.jsx'; // Importar el componente del carrusel
import logo from './assets/img/logo.png';
import loginImage from './assets/img/login.png';
import contactoImage from './assets/img/contacto.png';
import registroImage from './assets/img/registro.png';
import Mapa from './components/Mapa.jsx';
import MaquinaEscribir from './assets/js/maquinaEscribir.js';

// Componente funcional principal de la aplicación
const App = () => {
  // Hooks y redux
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modalIsOpen = useSelector((state) => state.modalIsOpen);

  // Efecto para cerrar el modal al renderizar el componente
  useEffect(() => {
    dispatch(closeModal());
  }, [dispatch]);

  // Función para abrir el modal y redirigir a una ruta específica
  const openModalAndRedirect = (path) => {
    dispatch(openModal());
    navigate(path);
  };

  // Función para cerrar el modal y redirigir a la página de inicio
  const handleCloseModal = () => {
    dispatch(closeModal());
    dispatch(closeModalAndRedirect('/', navigate));
  };

  // Estructura JSX para la vista principal de la aplicación
  return (
    <div className="contenedor-inicio mt-2 mb-2 p-2">
      <div className="row">
        {/* Sección del logo */}
        <div className="col-12 col-md-6 d-flex justify-content-center">
          <img src={logo} alt="Logo" className="contenedor-logo img-fluid img-logo" />
        </div>

        {/* Sección de imágenes y enlaces de acción */}
        <div className="col-12 col-md-6 text-center fila-imagen-personalizada d-flex flex-wrap">
          {/* Iconos y enlaces */}
          <div className="col xs-6 col-md-4 mb-3">
            <div
              className="contenedor-imagen contenedor-imagen-debajo contenedor-imagen-primera"
              onClick={() => openModalAndRedirect('/login')}
              style={{ cursor: 'pointer' }}
            >
              <img src={loginImage} alt="Inicio de sesión" className="img-fluid" />
            </div>
            <p className="texto-debajo-imagen">Iniciar sesión</p>
          </div>
          <div className="col xs-6 col-md-4 mb-3">
            <div
              className="contenedor-imagen contenedor-imagen-debajo"
              onClick={() => openModalAndRedirect('/contacto')}
              style={{ cursor: 'pointer' }}
            >
              <img src={contactoImage} alt="Contacto" className="img-fluid" />
            </div>
            <p className="texto-debajo-imagen">Contáctanos</p>
          </div>
          <div className="col xs-12 col-md-4 mb-3">
            <div
              className="contenedor-imagen contenedor-imagen-debajo contenedor-registro"
              onClick={() => openModalAndRedirect('/registro')}
              style={{ cursor: 'pointer' }}
            >
              <img src={registroImage} alt="Registro" className="img-fluid" />
            </div>
            <p className="texto-debajo-imagen">Regístrate</p>
          </div>
        </div>

        {/* Carrusel de imágenes */}
        <div className="col xs-12 col-md-12 mb-3 d-flex justify-content-center">
          <ImageCarousel />
        </div>

        {/* Contenedor "Quiénes somos" y "Nuestra Ubicación" */}
        <div className="row justify-content-center ms-1 mb-3">
          {/* Quiénes somos */}
          <div className="col-xs-12 col-md-5 quienes-somos-contenedor text-justify">
            <h2 className="quienes-somos-titulo">Quiénes somos</h2>
            <MaquinaEscribir />
          </div>

          {/* Mapa de Google con encabezado */}
          <div className="col-12 col-md-5 google-maps-contenedor text-justify">
            <h2 className="ubicacion-titulo">Nuestra Ubicación</h2>
            <Mapa />
          </div>
        </div>
      </div>

      {/* Modal utilizando ReactDOM.createPortal */}
      {ReactDOM.createPortal(
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
          contentLabel={location.pathname === '/login' ? 'LoginForm Modal' : 'ContactForm Modal'}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          {/* Contenido del modal (LoginForm, ContactForm, o RegistroForm según la ruta) */}
          {location.pathname === '/login' ? (
            <LoginForm />
          ) : location.pathname === '/contacto' ? (
            <ContactForm />
          ) : location.pathname === '/registro' ? (
            <RegistroForm />
          ) : null}

        </Modal>,
        document.body
      )}
    </div>
  );
};

// Exportar el componente principal de la aplicación
export default App;























































