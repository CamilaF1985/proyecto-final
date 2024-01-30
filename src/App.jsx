import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openModal, closeModal, closeModalAndRedirect } from './flux/modalActions';
import Modal from 'react-modal';
import LoginForm from './components/LoginForm.jsx';
import ContactForm from './components/ContactForm.jsx';
import RegistroForm from './components/RegistroForm.jsx';
import logo from './assets/img/logo.png';  
import loginImage from './assets/img/login.png';  
import contactoImage from './assets/img/contacto.png'; 
import registroImage from './assets/img/registro.png';  
import Mapa from './components/Mapa.jsx';  

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
    <div className="contenedor mt-4 mb-4 p-4">
      <div className="row">
        {/* Sección del logo */}
        <div className="col-12 col-md-4 d-flex justify-content-center">
          <img src={logo} alt="Logo" className="contenedor-logo img-fluid img-logo" />
        </div>

        {/* Sección de imágenes y enlaces de acción */}
        <div className="col-12 col-md-8 text-center fila-imagen-personalizada d-flex flex-wrap">
          {/* Iniciar sesión */}
          <div className="col-6 col-md-6 mb-3">
            <div
              className="contenedor-imagen contenedor-imagen-debajo contenedor-imagen-primera"
              onClick={() => openModalAndRedirect('/login')}
              style={{ cursor: 'pointer' }}
            >
              <img src={loginImage} alt="Inicio de sesión" className="img-fluid" />
            </div>
            <p className="texto-debajo-imagen">Iniciar sesión</p>
          </div>

          {/* Contacto */}
          <div className="col-6 col-md-4 mb-md-3">
            <div
              className="contenedor-imagen contenedor-imagen-debajo"
              onClick={() => openModalAndRedirect('/contacto')}
              style={{ cursor: 'pointer' }}
            >
              <img src={contactoImage} alt="Contacto" className="img-fluid" />
            </div>
            <p className="texto-debajo-imagen">Contáctanos</p>
          </div>

          {/* Registro */}
          <div className="col-6 col-md-4 mb-md-3">
            <div
              className="contenedor-imagen contenedor-imagen-debajo"
              onClick={() => openModalAndRedirect('/registro')}
              style={{ cursor: 'pointer' }}
            >
              <img src={registroImage} alt="Registro" className="img-fluid" />
            </div>
            <p className="texto-debajo-imagen">Regístrate</p>
          </div>
        </div>

        {/* Contenedor "Quiénes somos" y "Nuestra Ubicación" */}
        <div className="row justify-content-center ms-1">
          {/* Quiénes somos */}
          <div className="col-xs-12 col-md-4 quienes-somos-contenedor text-justify ms-1 me-1">
            <h2 className="quienes-somos-titulo">Quiénes somos</h2>
            <p className="quienes-somos-parrafo">
              Ofrecemos una aplicación amigable, diseñada para distribuir en forma equitativa,
              gastos y tareas domésticos entre copropietarios.
              No dude en contactarnos si desea probar nuestro producto.
            </p>
          </div>

          {/* Mapa de Google con encabezado */}
          <div className="col-12 col-md-4 google-maps-contenedor text-justify ms-1 me-1">
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






















































