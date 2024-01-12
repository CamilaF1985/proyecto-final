import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserData } from '../flux/userActions';
import { closeModal, closeModalAndRedirect } from '../flux/modalActions';
import { useNavigate } from 'react-router-dom';
import '../assets/css/App.css';  

// Componente funcional para el formulario de registro
const RegistroForm = () => {
  // Kooks y redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalIsOpen = useSelector((state) => state.modalIsOpen);

  // Estado local para manejar los datos del formulario
  const [formData, setFormData] = useState({
    rut: '',
    email: '',
    nombre: '',
    contrasena: '',
  });

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Guardar los datos del usuario en el estado global
    const userData = {
      userType: 'Administrador', 
      username: formData.nombre,
      rut: formData.rut,
      email: formData.email,
      contrasena: formData.contrasena,
      nombreUnidad: formData.nombreUnidad,  
    };
    dispatch(saveUserData(userData));

    // Cierra el modal después de enviar la solicitud
    handleCloseModal();
  };

  // Función para cerrar la ventana modal y redirigir
  const handleCloseModal = () => {
    dispatch(closeModal());
    dispatch(closeModalAndRedirect('/', navigate));
  };

  // Estructura JSX del componente del formulario de registro
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleCloseModal}
      contentLabel="RegistroForm Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      {/* Encabezado de la ventana modal */}
      <div className="modal-header d-flex justify-content-end mb-2">
        <button className="btn btn-danger" onClick={handleCloseModal}>
          X
        </button>
      </div>

      {/* Cuerpo de la ventana modal */}
      <div className="modal-body">
        <div className="form-container">
          <h2 className="form-titulo">Registro</h2>
          {/* Formulario de registro */}
          <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
            {/* Campo de RUT */}
            <div className="col-md-12 mb-3">
              <label htmlFor="rut" className="form-label">
                RUT:
              </label>
              <input
                type="text"
                className="form-control"
                id="rut"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                placeholder="Ingresa tu RUT"
                required
              />
              <div className="invalid-feedback">Por favor, ingresa tu RUT.</div>
            </div>

            {/* Campo de Nombre de la Unidad */}
            <div className="col-md-12 mb-3">
              <label htmlFor="nombreUnidad" className="form-label">
                Nombre de la Unidad:
              </label>
              <input
                type="text"
                className="form-control"
                id="nombreUnidad"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresa el nombre de la Unidad"
                required
              />
              <div className="invalid-feedback">
                Por favor, ingresa el nombre de la Unidad.
              </div>
            </div>

            {/* Campo de Correo Electrónico */}
            <div className="col-md-12 mb-3">
              <label htmlFor="email" className="form-label">
                Correo Electrónico:
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresa tu correo electrónico"
                required
              />
              <div className="invalid-feedback">
                Por favor, ingresa un correo electrónico válido.
              </div>
            </div>

            {/* Campo de Nombre */}
            <div className="col-md-12 mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre:
              </label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                required
              />
              <div className="invalid-feedback">Por favor, ingresa tu nombre.</div>
            </div>

            {/* Campo de Contraseña */}
            <div className="col-md-12 mb-3">
              <label htmlFor="contrasena" className="form-label">
                Contraseña:
              </label>
              <input
                type="password"
                className="form-control"
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required
              />
              <div className="invalid-feedback">Por favor, ingresa tu contraseña.</div>
            </div>

            {/* Botón de registro */}
            <div className="col-md-12 d-flex justify-content-end">
              <button className="btn btn-primary" type="submit">
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

// Exporta el componente RegistroForm para su uso en la aplicación
export default RegistroForm;


