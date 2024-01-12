// Importaciones de módulos y recursos
import React, { useState } from 'react';
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { saveUserData } from '../flux/userActions';
import { useNavigate } from 'react-router-dom';
import '../assets/css/App.css';  

// Componente funcional para el formulario de registro de inquilinos
const RegistroInquilino = () => {
  // Hooks y redux
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modalIsOpen);
  const navigate = useNavigate();

  // Estado local para manejar los datos del formulario
  const [formData, setFormData] = useState({
    rut: '',
    nombreUnidad: '',
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

    // Guardar todos los datos del inquilino en el estado global
    const inquilinoData = {
      userType: 'Inquilino',  
      username: formData.nombre,
      rut: formData.rut,
      nombreUnidad: formData.nombreUnidad,
      email: formData.email,
      contrasena: formData.contrasena,
    };

    dispatch(saveUserData(inquilinoData));

    // Cierra el modal después de enviar la solicitud
    handleCloseModal();
  };

  // Función para cerrar la ventana modal y redirigir
  const handleCloseModal = () => {
    const path = '/administrar-panel';  
    dispatch(closeModalAndRedirect(path, navigate));
  };

  // Estructura JSX del componente del formulario de registro de inquilinos
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="RegistroInquilino Modal"
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
          <h2 className="form-titulo">Registro de Inquilino</h2>
          {/* Formulario de registro */}
          <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
            {/* Campo de RUT */}
            <div className="col-md-12 mb-3">
              <label htmlFor="rut" className="form-label">RUT:</label>
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
              <div className="invalid-feedback">
                Por favor, ingresa tu RUT.
              </div>
            </div>

            {/* Campo de Nombre de la Unidad */}
            <div className="col-md-12 mb-3">
              <label htmlFor="nombreUnidad" className="form-label">Nombre de la Unidad:</label>
              <input
                type="text"
                className="form-control"
                id="nombreUnidad"
                name="nombreUnidad"
                value={formData.nombreUnidad}
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
              <label htmlFor="email" className="form-label">Correo Electrónico:</label>
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
              <label htmlFor="nombre" className="form-label">Nombre:</label>
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
              <div className="invalid-feedback">
                Por favor, ingresa tu nombre.
              </div>
            </div>

            {/* Campo de Contraseña */}
            <div className="col-md-12 mb-3">
              <label htmlFor="contrasena" className="form-label">Contraseña:</label>
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
              <div className="invalid-feedback">
                Por favor, ingresa tu contraseña.
              </div>
            </div>

            {/* Botón de registro */}
            <div className="col-md-12 d-flex justify-content-end">
              <button className="btn btn-primary" type="submit">Registrar nuevo inquilino</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

// Exporta el componente RegistroInquilino para su uso en la aplicación
export default RegistroInquilino;


