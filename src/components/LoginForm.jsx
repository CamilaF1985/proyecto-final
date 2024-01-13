// LoginForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { loginUser } from '../flux/userActions';
import { closeModal, closeModalAndRedirect } from '../flux/modalActions';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rut: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData, closeModal, navigate));
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    dispatch(closeModalAndRedirect('/', navigate));
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={handleCloseModal}
      contentLabel="LoginForm Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header d-flex justify-content-end mb-2">
        <button className="btn btn-danger" onClick={handleCloseModal}>
          X
        </button>
      </div>

      <div className="modal-body">
        <div className="form-container">
          <h2 className="form-titulo">Ingresa a tu cuenta</h2>

          <form className="row g-3 needs-validation" noValidate onSubmit={handleLogin}>
            {/* Campo para el rut */}
            <div className="col-md-12 mb-3">
              <label htmlFor="rut" className="form-label">
                RUT:
              </label>
              <input
                type="text"
                className="form-control"
                id="rut"
                placeholder="Ingresa tu RUT"
                required
                onChange={handleInputChange}
                autoComplete="off"
              />
              <div className="invalid-feedback">Por favor, ingresa tu RUT.</div>
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

























