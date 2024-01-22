import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { deleteTaskFromDatabase, getTasksByUnit } from '../flux/taskActions';
import { useNavigate } from 'react-router-dom';

const EliminarTarea = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modalIsOpen);
  const navigate = useNavigate();

  const [tasksList, setTasksList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      const unitId = localStorage.getItem('id_unidad');
      if (unitId) {
        dispatch(getTasksByUnit(unitId))
          .then(tasks => {
            setTasksList(tasks);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error al obtener la lista de tareas:', error);
            setLoading(false);
          });
      }
    };

    fetchData();
  }, [dispatch]);


  const handleCloseModal = () => {
    const path = '/administrar-panel';
    dispatch(closeModalAndRedirect(path, navigate));
  };

  const handleEliminarTarea = (taskId) => {
    dispatch(deleteTaskFromDatabase(taskId))
      .then(() => {
        // Cerrar el modal y redirigir
        handleCloseModal();
      })
      .catch(error => {
        console.error('Error al eliminar la tarea:', error);
      });
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

          {!loading && (
            <div className="mt-4">
              {tasksList.length > 0 ? (
                <>
                  <h3>Lista de Tareas por Unidad:</h3>
                  <ul>
                    {tasksList.map((task) => (
                      <li key={task.id}>
                        {task.nombre}
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => handleEliminarTarea(task.id)}
                        >
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>No hay tareas de momento</p>
              )}
            </div>
          )}

        </div>
      </div>
    </Modal>
  );
};

export default EliminarTarea;





