// En tu archivo taskActions.js
import axios from 'axios';
import { assignTaskToRandomPerson } from './personTaskActions.js';

// Tipos de acciones
export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const SAVE_NEW_TASK_DATA = 'SAVE_NEW_TASK_DATA';
export const ASSIGN_TASK_ERROR = 'ASSIGN_TASK_ERROR';
export const GET_TASK_BY_NAME = 'GET_TASK_BY_NAME'; 

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

// Acción para obtener una tarea por su nombre
export const getTaskByName = (taskName) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`http://localhost:5000/get_tarea_by_name/${taskName}`);
      console.log('Respuesta del servidor para obtener tarea por nombre:', response);

      if (response.status === 200) {
        // Accede al ID de la tarea dentro de la respuesta
        const taskId = response.data.id; // Asegúrate de que esta línea esté extrayendo el ID correctamente

        // Modifica el objeto de respuesta antes de guardarlo en el estado
        const responseData = {
          data: { ...response.data, id: taskId },  // Incluye el ID en el objeto de datos
          status: response.status,
          statusText: response.statusText,
        };

        dispatch({
          type: GET_TASK_BY_NAME,
          payload: responseData,
        });

        return responseData; // Devuelve la respuesta modificada para su uso posterior
      } else {
        console.error('Error al obtener la tarea por nombre:', response.data.error || 'Error desconocido');
        dispatch({
          type: ASSIGN_TASK_ERROR,
          payload: response.data.error || 'Error desconocido',
        });
        return null; // Devuelve null en caso de error
      }
    } catch (error) {
      console.error('Error durante la obtención de la tarea por nombre:', error.message || 'Error desconocido');
      dispatch({
        type: ASSIGN_TASK_ERROR,
        payload: error.message || 'Error desconocido',
      });
      return null; // Devuelve null en caso de error
    }
  };
};

export const saveNewTaskData = (taskData) => {
  return async (dispatch) => {
    try {
      // Realiza la solicitud POST al endpoint para crear la tarea usando axios
      const response = await axios.post('http://localhost:5000/create_tarea', taskData);

      if (response.status === 201) {
        // Despacha la acción para agregar la tarea al estado global
        dispatch(addTask(taskData)); // Utiliza los datos proporcionados en taskData

        // Obtén el nombre asignado a la tarea recién creada desde los datos de la tarea
        const newTaskName = taskData.nombre;
        console.log('Nombre de la tarea recién creada:', newTaskName);

        // Llama a la acción para obtener la tarea por su nombre utilizando el nombre recién obtenido
        if (newTaskName) {
          const getTaskResponse = await dispatch(getTaskByName(newTaskName));

          // Verifica si la respuesta es válida y contiene el ID
          const newTaskId = getTaskResponse?.data?.id;
          if (newTaskId) {
            console.log('ID de la tarea recién creada:', newTaskId);

            // Guarda el ID de la unidad en localStorage
            localStorage.setItem('id_unidad', taskData.id_unidad);

            // Llama a la acción para asignar la tarea a una persona
            await dispatch(assignTaskToRandomPerson({ id_tarea: newTaskId }));

            // Puedes agregar un console.log para imprimir el objeto completo antes de enviarlo
            console.log('Datos de la asignación de tarea a persona:', { id_tarea: newTaskId });
          } else {
            console.error('No se pudo obtener el ID de la tarea recién creada');
          }
        } else {
          console.error('No se pudo obtener el nombre de la tarea recién creada');
        }
      } else {
        console.error('Error al crear la tarea en el servidor');
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




