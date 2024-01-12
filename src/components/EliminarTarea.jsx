import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { deleteTask } from '../flux/taskActions';
import { useNavigate } from 'react-router-dom';

const EliminarTarea = () => {
  // Hooks y Redux
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modalIsOpen);
  const navigate = useNavigate();

  // Estado para almacenar el nombre de la tarea a eliminar
  const [taskName, setTaskName] = useState('');

  // Función para cerrar el modal y redirigir a la ruta principal
  const handleCloseModal = () => {
    const path = '/administrar-panel';
    dispatch(closeModalAndRedirect(path, navigate));
  };

  // Función para eliminar la tarea
  const handleEliminarTarea = (e) => {
    e.preventDefault();

    // Dispatch de la acción para eliminar tarea
    dispatch(deleteTask(taskName));

    // Cerrar el modal y redirigir
    handleCloseModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="EliminarTarea Modal"
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
          <h2 className="form-titulo">Eliminar Tarea</h2>
          
          {/* Formulario con clases de Bootstrap para la responsividad */}
          <form onSubmit={handleEliminarTarea} className="row g-3 needs-validation" noValidate>
            {/* Campo para ingresar el nombre de la tarea */}
            <div className="col-md-12 mb-3">
              <label htmlFor="taskName" className="form-label">Nombre de la Tarea:</label>
              <input
                type="text"
                className="form-control"
                id="taskName"
                placeholder="Ingresa el nombre de la Tarea"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
              {/* Mensaje de retroalimentación en caso de entrada no válida */}
              <div className="invalid-feedback">
                Por favor, ingresa el nombre de la tarea.
              </div>
            </div>

            {/* Mensaje de verificación antes de eliminar */}
            <div className="col-md-12 mb-3">
              <p>¿Estás seguro de querer eliminar la tarea con nombre: {taskName}?</p>
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

export default EliminarTarea;

