import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { deleteTaskFromDatabase, getTasksByUnit, saveTasksData } from '../flux/taskActions';
import { useNavigate } from 'react-router-dom';

const EliminarTarea = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modalIsOpen);
  const navigate = useNavigate();

  const [taskName, setTaskName] = useState('');
  const [tasksList, setTasksList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener la lista de tareas por unidad
        const unitId = localStorage.getItem('id_unidad');
        if (unitId) {
          const tasks = await dispatch(getTasksByUnit(unitId));
          setTasksList(tasks);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al obtener la lista de tareas:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleCloseModal = () => {
    const path = '/administrar-panel';
    dispatch(closeModalAndRedirect(path, navigate));
  };

  const handleEliminarTarea = (e) => {
    e.preventDefault();

    // Obtener el ID de la tarea
    const taskId = tasksList.find(task => task.nombre === taskName)?.id;

    if (taskId) {
      // Eliminar la tarea utilizando la acción correspondiente
      dispatch(deleteTaskFromDatabase(taskId))
        .then((updatedTasks) => {
          if (updatedTasks !== null) {
            // Actualizar la lista de tareas en el estado global
            dispatch(saveTasksData(updatedTasks));
            console.log('Tarea eliminada correctamente');
          } else {
            console.error('Error al eliminar la tarea');
          }
        })
        .catch((error) => {
          console.error('Error al eliminar la tarea:', error);
        });
      
      // Cerrar el modal y redirigir
      handleCloseModal();
    } else {
      console.error('Error al obtener el ID de la tarea');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="EliminarTarea Modal"
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
          <h2 className="form-titulo">Eliminar Tarea</h2>
          
          <form onSubmit={handleEliminarTarea} className="row g-3 needs-validation" noValidate>
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
              <div className="invalid-feedback">
                Por favor, ingresa el nombre de la tarea.
              </div>
            </div>

            <div className="col-md-12 mb-3">
              <p>¿Estás seguro de querer eliminar la tarea con nombre: {taskName}?</p>
            </div>

            <div className="col-md-12 d-flex justify-content-end">
              <button className="btn btn-danger" type="submit">Eliminar</button>
            </div>
          </form>

          {/* Mostrar la lista de tareas por unidad */}
          {!loading && tasksList.length > 0 && (
            <div className="mt-4">
              <h3>Lista de Tareas por Unidad:</h3>
              <ul>
                {tasksList.map((task) => (
                  <li key={task.id}>{task.nombre}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EliminarTarea;


