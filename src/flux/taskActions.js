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

export const saveTasksData = (updatedTasks) => {
  return {
    type: SAVE_NEW_TASK_DATA,
    payload: updatedTasks,
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

// Acción para obtener tareas pertenecientes a una unidad
export const getTasksByUnit = (unitId) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(`http://localhost:5000/get_tarea_by_unidad/${unitId}`);

        if (response.status === 200) {
          // Guardar las tareas en el estado global antes de devolver la respuesta
          dispatch(saveTasksData(response.data));
          // Resolver la Promesa con los datos
          resolve(response.data);
        } else {
          console.error('Error en la respuesta del servidor:', response);
          // Rechazar la Promesa con el error
          reject({ error: `Error: ${response.data.error}` });
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        // Rechazar la Promesa con el error
        reject({ error: `Error al obtener tareas por unidad: ${error.message}` });
      }
    });
  };
};

// Acción para eliminar una tarea de la base de datos
export const deleteTaskFromDatabase = (taskId) => {
  return async (dispatch) => {
    try {
      // Realiza la solicitud DELETE al endpoint para eliminar la tarea por su ID
      const response = await axios.delete(`http://localhost:5000/delete_tarea_por_unidad/${taskId}`);

      if (response.status === 200) {
        // Despacha la acción para eliminar la tarea del estado global
        dispatch(deleteTask(taskId));

        // Obtiene y guarda los datos actualizados de tareas utilizando la acción correspondiente
        const updatedTasks = await dispatch(getTasksByUnit(localStorage.getItem('id_unidad')));
        dispatch(saveTasksData(updatedTasks));

        // Devuelve los datos actualizados de tareas después de la eliminación
        return updatedTasks;
      } else {
        // Maneja el caso en que la respuesta del servidor no sea exitosa
        console.error('Error al eliminar la tarea:', response.data.error);
        // Devuelve null o algún valor que indique que la eliminación falló
        return null;
      }
    } catch (error) {
      // Muestra un mensaje de error si ocurre un error durante la eliminación de la tarea
      console.error('Error durante la eliminación de la tarea:', error);
      // Devuelve null o algún valor que indique que la eliminación falló
      return null;
    }
  };
};




