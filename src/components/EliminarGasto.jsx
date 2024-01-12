import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { deleteExpense } from '../flux/expenseActions';
import { useNavigate } from 'react-router-dom';

const EliminarGasto = () => {
  // Hooks y Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [factura, setFactura] = useState('');

  // Función para cerrar el modal y redirigir a la ruta principal
  const handleCloseModal = () => {
    const path = '/administrar-panel';
    dispatch(closeModalAndRedirect(path, navigate));
  };

  // Función para eliminar el gasto
  const handleEliminarGasto = (e) => {
    e.preventDefault();

    // Dispatch de la acción para eliminar el gasto
    dispatch(deleteExpense(factura));

    // Cerrar el modal y redirigir
    handleCloseModal();
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={handleCloseModal}
      contentLabel="EliminarGasto Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      {/* Encabezado del modal */}
      <div className="modal-header d-flex justify-content-end mb-2">
        <button className="btn btn-danger" onClick={handleCloseModal}>
          X
        </button>
      </div>

      {/* Cuerpo del modal */}
      <div className="modal-body">
        <div className="form-container">
          {/* Título del formulario */}
          <h2 className="form-titulo">Eliminar Gasto</h2>

          {/* Formulario con clases de Bootstrap para la responsividad */}
          <form onSubmit={handleEliminarGasto} className="row g-3 needs-validation" noValidate>
            {/* Campo para ingresar la factura del gasto */}
            <div className="col-md-12 mb-3">
              <label htmlFor="factura" className="form-label">Factura del Gasto:</label>
              <input
                type="text"
                className="form-control"
                id="factura"
                placeholder="Ingresa la factura del Gasto"
                value={factura}
                onChange={(e) => setFactura(e.target.value)}
                required
              />
              {/* Mensaje de retroalimentación en caso de entrada no válida */}
              <div className="invalid-feedback">
                Por favor, ingresa la factura del Gasto.
              </div>
            </div>

            {/* Mensaje de verificación antes de eliminar */}
            <div className="col-md-12 mb-3">
              <p>¿Estás seguro de querer eliminar el gasto con factura: {factura}?</p>
            </div>

            {/* Botón para enviar el formulario de eliminación */}
            <div className="col-md-12 d-flex justify-content-end">
              <button className="btn btn-danger" type="submit">Eliminar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EliminarGasto;
