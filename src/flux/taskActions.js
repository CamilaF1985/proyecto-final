import axios from 'axios';
import { assignTaskToRandomPerson, deleteTareaPersona } from './personTaskActions.js';

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

// Acción para agregar la data de las tareas actualizadas al estado global
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
      if (response.status === 200) {
        const taskId = response.data.id; // Acceder al ID de la tarea dentro de la respuesta
        // Modificar el objeto de respuesta antes de guardarlo en el estado
        const responseData = {
          data: { ...response.data, id: taskId },
          status: response.status,
          statusText: response.statusText,
        };

        dispatch({
          type: GET_TASK_BY_NAME,
          payload: responseData,
        });
        return responseData; // Devolver la respuesta modificada para su uso posterior

      } else {
        console.error('Error al obtener la tarea por nombre:', response.data.error || 'Error desconocido');
        dispatch({
          type: ASSIGN_TASK_ERROR,
          payload: response.data.error || 'Error desconocido',
        });
        return null; // Devolver null en caso de error

      }
    } catch (error) {
      console.error('Error durante la obtención de la tarea por nombre:', error.message || 'Error desconocido');
      dispatch({
        type: ASSIGN_TASK_ERROR,
        payload: error.message || 'Error desconocido',
      });
      return null; // Devolver null en caso de error
    }
  };
};

// Acción para guardar nuevas tareas en la base de datos
export const saveNewTaskData = (taskData) => {
  return async (dispatch) => {
    try {
      // Realizar la solicitud POST al endpoint para crear la tarea usando axios
      const response = await axios.post('http://localhost:5000/create_tarea', taskData);

      if (response.status === 201) {
        dispatch(addTask(taskData)); // Despachar la acción para agregar la tarea al estado global
        const newTaskName = taskData.nombre; // Obtener el nombre asignado a la tarea recién creada desde los datos de la tarea

        // Llamar a la acción para obtener la tarea por su nombre utilizando el nombre recién obtenido
        if (newTaskName) {
          const getTaskResponse = await dispatch(getTaskByName(newTaskName));
          const newTaskId = getTaskResponse?.data?.id; // Verificar si la respuesta es válida y contiene el ID

          if (newTaskId) {
            localStorage.setItem('id_unidad', taskData.id_unidad); // Guardar el ID de la unidad en localStorage
            // Llamar a la acción para asignar la tarea a una persona
            await dispatch(assignTaskToRandomPerson({ id_tarea: newTaskId }));

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
          resolve(response.data); // Resolver la Promesa con los datos
        } else {
          console.error('Error en la respuesta del servidor:', response);
          reject({ error: `Error: ${response.data.error}` }); // Rechazar la Promesa con el error
        }
        
      } catch (error) {
        console.error('Error en la solicitud:', error);
        reject({ error: `Error al obtener tareas por unidad: ${error.message}` }); // Rechazar la Promesa con el error
      }
    });
  };
};

// Acción para eliminar una tarea de la base de datos
export const deleteTaskFromDatabase = (taskId) => {
  return async (dispatch) => {
    try {
      await dispatch(deleteTareaPersona(taskId)); // Llamada a la acción para eliminar tarea_persona
      // Si la eliminación de tarea_persona fue exitosa, procede con la eliminación de la tarea
      const response = await axios.delete(`http://localhost:5000/delete_tarea_por_unidad/${taskId}`);

      if (response.status === 200) {
        dispatch(deleteTask(taskId)); // Despachar la acción para eliminar la tarea del estado global
        // Obtener y guarda los datos actualizados de tareas utilizando la acción correspondiente
        const updatedTasks = await dispatch(getTasksByUnit(localStorage.getItem('id_unidad')));
        dispatch(saveTasksData(updatedTasks));
        return updatedTasks; // Devolver los datos actualizados de tareas después de la eliminación

      } else {
        // Manejar el caso en que la respuesta del servidor no sea exitosa
        console.error('Error al eliminar la tarea:', response.data.error);
        // Devolver null si la acción falló
        return null;
      }
    } catch (error) {
      console.error('Error durante la eliminación de la tarea:', error);  // Manejo de error
      return null; // Devolver null si la eliminación falló
    }
  };
};




