import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { loginUser } from '../flux/userActions';
import { closeModal, closeModalAndRedirect } from '../flux/modalActions';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { validarLogin } from '../assets/js/validarLogin'; //importar el js de validaciones

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rut: '',
    password: '',
  });
  const [rutError, setRutError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
  
    // Manejo de cambios en el formulario
    setFormData({
      ...formData,
      [id]: value,
    });
  
    // Validar el RUT y la contraseña en tiempo real, muestra mensajes de error
    if (id === 'rut') {
      const isRutValid = validarLogin.rut(value);
      setRutError(isRutValid ? '' : 'El RUT no es válido');
    } else if (id === 'password') {
      const isPasswordValid = validarLogin.password(value);
      setPasswordError(isPasswordValid ? '' : 'La contraseña no puede quedar nula');
    }
  };
    
  const handleLogin = (e) => {
    // No enviar el formulario hasta que esté completo
    e.preventDefault();

    // Validar el RUT antes de enviar el formulario
    if (rutError) {
      // mensaje de error por consola para el rut
      console.error('El RUT no es válido');
      return;
    }

    dispatch(loginUser(formData, closeModal, navigate))
      .then(() => {
        // Autenticación exitosa
        Swal.fire({
          icon: 'success',
          title: '¡Inicio de sesión exitoso!',
          text: 'Bienvenido de nuevo.',
        });

        // Cierra el modal después de un breve tiempo 
        setTimeout(() => {
          handleCloseModal();
        }, 3000);
      })
      .catch((error) => {
        // Mensaje de error
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: '¡Credenciales incorrectas!',
          text: 'Por favor revisa tus credenciales.',
        });
      });
  };

  const handleCloseModal = () => {
    // Cierre de modal y redirección
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
                className={`form-control ${rutError ? 'is-invalid' : ''}`}
                id="rut"
                placeholder="Ingresa tu RUT"
                required
                onChange={handleInputChange}
                autoComplete="off"
              />
              {rutError && <div className="invalid-feedback error-message">{rutError}</div>}
            </div>

            {/* Campo para la contraseña */}
            <div className="col-md-12 mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña:
              </label>
              <input
                type="password"
                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                id="password"
                placeholder="Ingresa tu contraseña"
                required
                onChange={handleInputChange}
              />
              {passwordError && <div className="invalid-feedback error-message">{passwordError}</div>}
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




























