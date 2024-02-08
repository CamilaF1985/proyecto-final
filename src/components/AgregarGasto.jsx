import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { saveNewExpenseData } from '../flux/expenseActions';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { validarGasto } from '../assets/js/validarGasto';
import CronometroSesion from '../components/CronometroSesion.jsx';

const AgregarGasto = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [factura, setFactura] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [formErrors, setFormErrors] = useState({
    factura: '',
    monto: '',
    descripcion: '',
  });

  const validateField = (fieldName, value, validationFunction) => {
    const errorMessage = validationFunction(value);
    setFormErrors({
      ...formErrors,
      [fieldName]: errorMessage || getErrorMessage(fieldName),
    });
  };

  const getErrorMessage = (fieldName) => {
    switch (fieldName) {
      case 'factura':
        return 'Entre 1 y 10 caracteres.';
      case 'monto':
        return 'Ingresa un número entero mayor a cero.';
      case 'descripcion':
        return 'Entre 4 y 20 caracteres.';
      default:
        return 'Campo inválido.';
    }
  };

  const handleCloseModal = () => {
    const path = '/administrar-panel';
    dispatch(closeModalAndRedirect(path, navigate));
  };

  const handleAgregarGasto = () => {
    if (factura && monto && descripcion) {
      const idUnidad = localStorage.getItem('id_unidad');

      dispatch(
        saveNewExpenseData({
          factura: factura,
          monto_original: monto,
          descripcion: descripcion,
          id_unidad: idUnidad,
        })
      ).then(() => {
        handleCloseModal();
        Swal.fire({
          icon: 'success',
          title: '¡Gasto Agregado!',
          text: 'El nuevo gasto se ha agregado correctamente.',
        });
      }).catch((error) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error al Agregar Gasto!',
          text: error.message || 'Ocurrió un error al agregar el gasto.',
        });
        console.error('Error al agregar el gasto:', error);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Valores faltantes!',
        text: 'Por favor revise los campos.',
      });
    }
  };

  const handleChange = (fieldName, value) => {
    setFormErrors({
      ...formErrors,
      [fieldName]: '', // Limpiar el mensaje de error al cambiar el valor del campo
    });

    switch (fieldName) {
      case 'factura':
        setFactura(value);
        validateField('factura', value, validarGasto.factura);
        break;
      case 'monto':
        setMonto(value);
        validateField('monto', value, validarGasto.monto);
        break;
      case 'descripcion':
        setDescripcion(value);
        validateField('descripcion', value, validarGasto.descripcion);
        break;
      default:
        break;
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={handleCloseModal}
      contentLabel="AgregarGasto Modal"
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
          {/* Componente CronometroSesion */}
          <CronometroSesion />
          <h2 className="form-titulo">Agregar Gasto</h2>
          <form className="row g-3 needs-validation" noValidate>
            <div className="col-md-12 mb-3">
              <label htmlFor="factura" className="form-label">
                <strong>Número de Factura:</strong>
              </label>
              <input
                type="text"
                className={`form-control ${formErrors.factura ? 'is-invalid' : ''}`}
                id="factura"
                placeholder="Ingrese el número de factura"
                value={factura}
                onChange={(e) => handleChange('factura', e.target.value)}
                required
              />
              <div className="invalid-feedback">
                {formErrors.factura}
              </div>
            </div>

            <div className="col-md-12 mb-3">
              <label htmlFor="monto" className="form-label">
                <strong>Monto del Gasto:</strong>
              </label>
              <input
                type="number"
                className={`form-control ${formErrors.monto ? 'is-invalid' : ''}`}
                id="monto"
                placeholder="Ingrese el monto del gasto"
                value={monto !== null ? monto : ''}
                onChange={(e) => {
                  const parsedValue = parseInt(e.target.value, 10);
                  if (!isNaN(parsedValue)) {
                    handleChange('monto', parsedValue);
                  } else {
                    handleChange('monto', ''); 
                  }
                }}
                required
              />

              <div className="invalid-feedback">
                {formErrors.monto}
              </div>
            </div>

            <div className="col-md-12 mb-3">
              <label htmlFor="descripcion" className="form-label">
                <strong>Descripción del Gasto:</strong>
              </label>
              <input
                type="text"
                className={`form-control ${formErrors.descripcion ? 'is-invalid' : ''}`}
                id="descripcion"
                placeholder="Ingrese la descripción del gasto"
                value={descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                required
              />
              <div className="invalid-feedback">
                {formErrors.descripcion}
              </div>
            </div>

            <div className="col-md-12 d-flex justify-content-end">
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleAgregarGasto}
              >
                Agregar Gasto
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AgregarGasto;



