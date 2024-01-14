// RegistroForm.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { saveNewUserData } from '../flux/userActions'; // Actualiza la importación
import { saveUnitData } from '../flux/unitActions';
import { closeModal, closeModalAndRedirect } from '../flux/modalActions';
import { useNavigate } from 'react-router-dom';
import '../assets/css/App.css';

const RegistroForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalIsOpen = useSelector((state) => state.modalIsOpen);

  const [formData, setFormData] = useState({
    rut: '',
    email: '',
    nombre: '',
    contrasena: '',
    nombreUnidad: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    dispatch(closeModalAndRedirect('/', navigate));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Guarda los datos de la unidad en el estado global
      const unitData = {
        nombre: formData.nombreUnidad,
      };
      const unitId = dispatch(saveUnitData(unitData));

      if (unitId) {
        // Si la creación de la unidad es exitosa, procede a guardar el usuario
        const userData = {
          rut: formData.rut,
          email: formData.email,
          nombre: formData.nombre,
          contrasena: formData.contrasena,
          id_unidad: unitId, // Asigna el ID de la unidad recién creada
        };

        dispatch(saveNewUserData(userData)); // Cambia la llamada a saveUserData

        // Cierra el modal después de enviar la solicitud
        handleCloseModal();
      } else {
        console.error('Error al guardar la unidad:', unitId);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleCloseModal}
      contentLabel="RegistroForm Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-body">
        <div className="form-container">
          <h2 className="form-titulo">Registro</h2>
          <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
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

            <div className="col-md-12 mb-3">
              <label htmlFor="nombreUnidad" className="form-label">
                Nombre de la Unidad:
              </label>
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

export default RegistroForm;







