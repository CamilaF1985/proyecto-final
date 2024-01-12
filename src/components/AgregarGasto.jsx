import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { addExpense } from '../flux/expenseActions';
import { useNavigate } from 'react-router-dom';

const AgregarGasto = () => {
  // Hooks y Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Estados locales para almacenar valores del formulario
  const [factura, setFactura] = useState('');
  const [nombreUnidad, setNombreUnidad] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Función para cerrar el modal y redirigir a la ruta principal
  const handleCloseModal = () => {
    const path = '/administrar-panel';
    dispatch(closeModalAndRedirect(path, navigate));
  };

  // Función para agregar un nuevo gasto
  const handleAgregarGasto = () => {
    // Validar que se hayan ingresado todos los valores
    if (factura && nombreUnidad && monto && descripcion) {
      // Dispatch de la acción para agregar gasto
      dispatch(addExpense({ factura, unidad: nombreUnidad, monto, descripcion }));

      // Cerrar el modal y redirigir
      handleCloseModal();
    } else {
      // Manejar caso donde no se ingresaron todos los valores
      alert('Por favor, ingrese todos los detalles del gasto.');
    }
  };

  return (
    // Modal para agregar gasto
    <Modal
      isOpen={true}
      onRequestClose={handleCloseModal}
      contentLabel="AgregarGasto Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header d-flex justify-content-end mb-2">
        {/* Botón para cerrar el modal */}
        <button className="btn btn-danger" onClick={handleCloseModal}>
          X
        </button>
      </div>

      <div className="modal-body">
        <div className="form-container">
          {/* Título del formulario */}
          <h2 className="form-titulo">Agregar Gasto</h2>
          {/* Formulario con clases de Bootstrap para la responsividad */}
          <form className="row g-3 needs-validation" noValidate>
            {/* Campo para el número de factura */}
            <div className="col-md-12 mb-3">
              <label htmlFor="factura" className="form-label">
                Número de Factura:
              </label>
              {/* Entrada para el número de factura */}
              <input
                type="text"
                className="form-control"
                id="factura"
                placeholder="Ingrese el número de factura"
                value={factura}
                onChange={(e) => setFactura(e.target.value)}
                required
              />
              {/* Mensaje de retroalimentación en caso de entrada no válida */}
              <div className="invalid-feedback">
                Por favor, ingrese el número de factura.
              </div>
            </div>

            {/* Campo para el nombre de la unidad */}
            <div className="col-md-12 mb-3">
              <label htmlFor="nombreUnidad" className="form-label">
                Nombre de la Unidad:
              </label>
              {/* Entrada para el nombre de la unidad */}
              <input
                type="text"
                className="form-control"
                id="nombreUnidad"
                placeholder="Ingrese el nombre de la unidad"
                value={nombreUnidad}
                onChange={(e) => setNombreUnidad(e.target.value)}
                required
              />
              {/* Mensaje de retroalimentación en caso de entrada no válida */}
              <div className="invalid-feedback">
                Por favor, ingrese el nombre de la unidad.
              </div>
            </div>

            {/* Campo para el monto del gasto */}
            <div className="col-md-12 mb-3">
              <label htmlFor="monto" className="form-label">
                Monto del Gasto:
              </label>
              {/* Entrada para el monto del gasto */}
              <input
                type="number"
                className="form-control"
                id="monto"
                placeholder="Ingrese el monto del gasto"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />
              {/* Mensaje de retroalimentación en caso de entrada no válida */}
              <div className="invalid-feedback">
                Por favor, ingrese el monto del gasto.
              </div>
            </div>

            {/* Campo para la descripción del gasto */}
            <div className="col-md-12 mb-3">
              <label htmlFor="descripcion" className="form-label">
                Descripción del Gasto:
              </label>
              {/* Entrada para la descripción del gasto */}
              <input
                type="text"
                className="form-control"
                id="descripcion"
                placeholder="Ingrese la descripción del gasto"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
              {/* Mensaje de retroalimentación en caso de entrada no válida */}
              <div className="invalid-feedback">
                Por favor, ingrese la descripción del gasto.
              </div>
            </div>

            {/* Botón para agregar el gasto */}
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

