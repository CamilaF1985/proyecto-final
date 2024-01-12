import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector  } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { useNavigate } from 'react-router-dom';
import '../assets/css/App.css';

const EliminarInquilino = () => {
  // Hooks y Redux
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modalIsOpen);
  const navigate = useNavigate();

  // Estado para almacenar el rut del inquilino a eliminar
  const [rut, setRut] = useState('');

  // Función para cerrar el modal y redirigir a la ruta principal
  const handleCloseModal = () => {
    // Configuración de la ruta
    const path = '/administrar-panel';
    dispatch(closeModalAndRedirect(path, navigate));
  };

  // Función para manejar el envío del formulario
  const handleEliminarInquilino = (e) => {
    e.preventDefault();

    // Luego de eliminar, cierra el modal y redirige a la ruta principal
    handleCloseModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="EliminarInquilino Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      {/* Contenido del modal */}
      <div className="modal-header d-flex justify-content-end mb-2">
        {/* Botón para cerrar el modal */}
        <button className="btn btn-danger" onClick={handleCloseModal}>
          X
        </button>
      </div>

      <div className="modal-body">
        <div className="form-container">
          {/* Título del formulario */}
          <h2 className="form-titulo">Eliminar Inquilino</h2>
          {/* Formulario con clases de Bootstrap para la responsividad */}
          <form onSubmit={handleEliminarInquilino} className="row g-3 needs-validation" noValidate>
            {/* Fila para el campo de rut */}
            <div className="col-md-12 mb-3">
              <label htmlFor="rut" className="form-label">RUT del Inquilino:</label>
              {/* Campo de entrada para el rut */}
              <input
                type="text"
                className="form-control"
                id="rut"
                placeholder="Ingresa el RUT del Inquilino"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                required
              />
              {/* Mensaje de retroalimentación en caso de entrada no válida */}
              <div className="invalid-feedback">
                Por favor, ingresa el RUT del Inquilino.
              </div>
            </div>

            {/* Mensaje de verificación antes de eliminar */}
            <div className="col-md-12 mb-3">
              <p>¿Estás seguro de querer eliminar al inquilino con RUT: {rut}?</p>
            </div>

            {/* Botón "Eliminar" */}
            <div className="col-md-12 d-flex justify-content-end">
              <button className="btn btn-danger" type="submit">Eliminar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EliminarInquilino;
