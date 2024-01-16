// En tu archivo taskActions.js
import axios from 'axios';

// Tipos de acciones
export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const SAVE_NEW_TASK_DATA = 'SAVE_NEW_TASK_DATA';

// Acción para agregar una nueva tarea al estado global
export const addTask = (taskData) => {
  return {
    type: ADD_TASK,
    payload: taskData,
  };
};

// Acción para guardar nuevas tareas
export const saveNewTaskData = (taskData) => {
  return async (dispatch) => {
    try {
      // Obtiene el id_unidad desde el localStorage
      const idUnidad = localStorage.getItem('id_unidad');

      // Verifica si id_unidad tiene un valor antes de continuar
      if (idUnidad) {
        // Actualiza el ID de la unidad en taskData
        taskData.id_unidad = idUnidad;

        // Realiza la solicitud POST al endpoint para crear la tarea usando axios
        const response = await axios.post('http://localhost:5000/create_tarea', taskData);

        // Verifica si la respuesta es exitosa
        if (response.status === 201) {
          // Despacha la acción para agregar la tarea al estado global
          dispatch(addTask(response.data));
        } else {
          // Maneja el caso en que la respuesta del servidor no sea exitosa
          console.error('Error al crear la tarea en el servidor');
        }
      } else {
        console.error('Error: id_unidad no encontrado en el localStorage');
      }
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
    }
  };
};

// Acción para eliminar una tarea del estado global
export const deleteTask = (taskId) => {
  return {
    type: DELETE_TASK,
    payload: taskId,
  };
};

