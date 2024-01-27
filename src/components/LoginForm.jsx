import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { loginUser } from '../flux/userActions';
import { closeModal, closeModalAndRedirect } from '../flux/modalActions';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import format from "../assets/js/format";
import validate from '../assets/js/validate';


const LoginForm = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rut: '',
    password: '',
  });

  const handleCloseModal = () => {
    // Cierre de modal y redirección
    dispatch(closeModal());
    dispatch(closeModalAndRedirect('/', navigate));
  };

  const rut = Yup.string()
    .test('valida-rut', 'RUT inválido', function (value) {
      return validate.rut(value);
    })
    .required('Requerido');

  const formik = useFormik({
    initialValues: {
      rut: '',
      password: ''
    },
    validationSchema: Yup.object({
      rut: rut,
      password: Yup.string().required('Requerido')
    }),
    onSubmit: values => {
      setFormData({
        "rut": values.rut,
        "password": values.password
      });
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


    },
  });

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


          <form className="row g-3 needs-validation" noValidate onSubmit={formik.handleSubmit}>

            {/* Campo para el rut */}
            <div className="col-md-12 mb-3">
              <label htmlFor="rut" className="form-label">
                RUT:
              </label>
              <input
                name="rut"
                type="text"
                value={formik.values.rut} maxLength="12"
                onChange={(e) => formik.setFieldValue('rut', format.rut(e.target.value))}
                className="form-control"
                id="rut"
                placeholder="Ingresa tu RUT"
                required
                autoComplete="off"
              />
              {formik.touched.rut && formik.errors.rut ? (
                <div>{formik.errors.rut}</div>
              ) : null}
            </div>

            {/* Campo para la contraseña */}
            <div className="col-md-12 mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña:
              </label>
              <input
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                className="form-control"
                id="password"
                placeholder="Ingresa tu contraseña"
                required
              />
              {formik.touched.password && formik.errors.password ? (
                <div>{formik.errors.password}</div>
              ) : null}
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


























