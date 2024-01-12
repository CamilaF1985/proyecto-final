// LoginForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { loginUser } from '../flux/userActions';
import { closeModal, closeModalAndRedirect } from '../flux/modalActions';
import { useNavigate } from 'react-router-dom'; // Agregar importación
import '../assets/css/App.css';

const LoginForm = () => {
  // Hooks y redux
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Agregar hook de navegación

  // Estado para almacenar los datos del formulario (nombre de usuario y contraseña)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Función para manejar los cambios en los campos de entrada
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Función para manejar el proceso de inicio de sesión
  const handleLogin = (e) => {
    e.preventDefault(); // Evita la recarga de la página por defecto del formulario
    dispatch(loginUser(formData, closeModal, navigate)); // Pasa navigate como argumento
  };

  // Función para cerrar el modal y redirigir al inicio
  const handleCloseModal = () => {
    dispatch(closeModal());
    dispatch(closeModalAndRedirect('/', navigate)); // Redirigir al inicio al cerrar el modal
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={handleCloseModal}
      contentLabel="LoginForm Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      {/* Encabezado del modal con botón para cerrar */}
      <div className="modal-header d-flex justify-content-end mb-2">
        <button className="btn btn-danger" onClick={handleCloseModal}>
          X
        </button>
      </div>

      <div className="modal-body">
        <div className="form-container">
          {/* Título del formulario */}
          <h2 className="form-titulo">Ingresa a tu cuenta</h2>

          {/* Formulario con clases de Bootstrap para la responsividad */}
          <form className="row g-3 needs-validation" noValidate onSubmit={handleLogin}>
            {/* Campo para el nombre de usuario */}
            <div className="col-md-12 mb-3">
              <label htmlFor="username" className="form-label">
                Nombre de usuario:
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Ingresa tu nombre de usuario"
                required
                onChange={handleInputChange}
                autoComplete="current-password"
              />
              {/* Mensaje de retroalimentación en caso de entrada no válida */}
              <div className="invalid-feedback">Por favor, ingresa tu nombre de usuario.</div>
            </div>

            {/* Campo para la contraseña */}
            <div className="col-md-12 mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña:
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Ingresa tu contraseña"
                required
                onChange={handleInputChange}
              />
              {/* Mensaje de retroalimentación en caso de entrada no válida */}
              <div className="invalid-feedback">Por favor, ingresa tu contraseña.</div>
            </div>

            {/* Botón "Ingresar" */}
            <div className="col-md-12 d-flex justify-content-end">
              <button className="btn btn-primary" type="submit">
                Ingresar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default LoginForm;
























