import axios from 'axios';
import { getUsersByUnit } from './userActions.js';

// Definir tipos de acción directamente en el archivo
const ADD_PERSON_TASK = 'ADD_PERSON_TASK';
const ASSIGN_TASK_ERROR = 'ASSIGN_TASK_ERROR';

// Acción para asignar una tarea a una persona de forma aleatoria
export const assignTaskToRandomPerson = (taskData) => async (dispatch) => {
  try {
    // Obtener el id de la unidad desde localStorage y convertirlo a número
    const unitId = Number(localStorage.getItem('id_unidad'));

    // Verificar si id_unidad tiene un valor
    if (!unitId) {
      console.error('Error: id_unidad no encontrado en el localStorage o no es un número válido');
      dispatch({
        type: ASSIGN_TASK_ERROR,
        payload: 'Error: id_unidad no encontrado en el localStorage o no es un número válido',
      });
      return;
    }

    // Obtener la lista de usuarios de la unidad
    const users = await dispatch(getUsersByUnit(unitId));

    // Verificar si hay usuarios en la unidad
    if (users.length === 0) {
      console.error('Error: No hay usuarios en la unidad para asignar la tarea.');
      dispatch({
        type: ASSIGN_TASK_ERROR,
        payload: 'Error: No hay usuarios en la unidad para asignar la tarea.',
      });
      return;
    }

    // Seleccionar un usuario aleatorio
    const randomUser = users[Math.floor(Math.random() * users.length)];

    // Asignar el id_persona y id_unidad seleccionados a taskData
    taskData.id_persona = randomUser.id;
    taskData.id_unidad = unitId;

    // Establecer la fecha de inicio con la fecha actual
    const currentDate = new Date();
    taskData.fecha_inicio = currentDate.toISOString(); // Convierte la fecha a formato ISO

    // Imprimir la data que se está enviando
    console.log('Datos de la asignación de tarea a persona:', taskData);

    // Realizar la asignación de la tarea al usuario seleccionado
    const response = await axios.post('http://localhost:5000/create_tarea_persona', taskData);

    if (response.status === 201) {
      // Despacha la acción para agregar la asignación al estado
      dispatch({
        type: ADD_PERSON_TASK,
        payload: response.data,
      });
    } else {
      // Manejar posibles errores en la respuesta del servidor
      console.error('Error al asignar tarea a persona:', response.data.error || 'Error desconocido');
      dispatch({
        type: ASSIGN_TASK_ERROR,
        payload: response.data.error || 'Error desconocido',
      });
    }
  } catch (error) {
    console.error('Error durante la asignación de tarea a persona:', error.message || 'Error desconocido');
    dispatch({
      type: ASSIGN_TASK_ERROR,
      payload: error.message || 'Error desconocido',
    });
  }
};




