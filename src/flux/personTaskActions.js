import axios from 'axios';
import { getUsersByUnit } from './userActions.js';
import { getUserByRut } from './userActions.js'

// Tipos de acciones
const ADD_PERSON_TASK = 'ADD_PERSON_TASK';
const ASSIGN_TASK_ERROR = 'ASSIGN_TASK_ERROR';
const DELETE_TAREA_PERSONA = 'DELETE_TAREA_PERSONA';
export const SAVE_TAREAS_ASIGNADAS = 'SAVE_TAREAS_ASIGNADAS';
export const UPDATE_FECHA_TERMINO = 'UPDATE_FECHA_TERMINO';

// Acción para almacenar las tareas asignadas en el estado
export const saveTareasAsignadas = (tareasAsignadas) => {
    return {
        type: SAVE_TAREAS_ASIGNADAS,
        payload: tareasAsignadas,
    };
};

// Acción para asignar una tarea a una persona de forma aleatoria
export const assignTaskToRandomPerson = (taskData) => async (dispatch) => {
    try {
        const unitId = Number(localStorage.getItem('id_unidad')); // Obtener el id de la unidad y convertirlo a número
        // Verificar si id_unidad tiene un valor
        if (!unitId) {
            console.error('Error: id_unidad no encontrado en el localStorage o no es un número válido');
            dispatch({
                type: ASSIGN_TASK_ERROR,
                payload: 'Error: id_unidad no encontrado en el localStorage o no es un número válido',
            });
            return;
        }
        const users = await dispatch(getUsersByUnit(unitId));  // Obtener la lista de usuarios de la unidad
        // Verificar si hay usuarios en la unidad
        if (users.length === 0) {
            console.error('Error: No hay usuarios en la unidad para asignar la tarea.');
            dispatch({
                type: ASSIGN_TASK_ERROR,
                payload: 'Error: No hay usuarios en la unidad para asignar la tarea.',
            });
            return;
        }
        const randomUser = users[Math.floor(Math.random() * users.length)]; // Seleccionar un usuario aleatorio
        // Asignar el id_persona y id_unidad seleccionados a taskData
        taskData.id_persona = randomUser.id;
        taskData.id_unidad = unitId;
        // Establecer la fecha de inicio con la fecha actual
        const currentDate = new Date();
        taskData.fecha_inicio = currentDate.toISOString(); // Convierte la fecha a formato ISO
        console.log('Datos de la asignación de tarea a persona:', taskData); // Imprimir la data que se está enviando
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

// Acción asincrónica para obtener las tareas asignadas al usuario
export const getTareasAsignadas = () => {
    return async (dispatch, getState) => {
        try {
            await dispatch(getUserByRut()); // Utilizar la acción getUserByRut y esperar a que se resuelva
            // Obtener el ID del usuario almacenado en el estado después de llamar a getUserByRut
            const idUsuario = getState().user.id;
            console.log('ID del Usuario:', idUsuario); // Console.log para imprimir el ID del usuario
            // Realizar una solicitud al servidor para obtener las tareas asignadas al usuario por su ID
            const response = await axios.get(`http://localhost:5000/tarea_persona_by_id_persona/${idUsuario}`);
            if (response.status === 200) {
                const tareasAsignadas = response.data.tarea_persona_list; // Extraer tarea_persona_list de la respuesta
                dispatch(saveTareasAsignadas(tareasAsignadas)); // Despachar la acción para guardar las tareas asignadas en el estado
                console.log('Tareas asignadas:', tareasAsignadas); // Console.log para las tareas asignadas
                // Imprimir el nombre de la primera tarea
                if (tareasAsignadas.length > 0) {
                    console.log('Nombre de la primera tarea:', tareasAsignadas[0].nombre_tarea);
                }
            } else {
                // Mostrar un mensaje de error si la solicitud no fue exitosa
                const errorData = response.data;
                console.error(`Error al obtener las tareas asignadas: ${errorData.error}`);
            }
        } catch (error) {
            // Mostrar un mensaje de error si ocurre un error durante la obtención de las tareas asignadas
            console.error('Error al obtener las tareas asignadas:', error);
        }
    };
};

// Acción para actualizar la fecha de término de una tarea asignada a una persona en la base de datos
export const updateFechaTermino = (tareaPersonaId) => async (dispatch) => {
    try {
        const currentDate = new Date(); // Obtener la fecha actual
        const nuevaFechaTermino = currentDate.toISOString(); // Convierte la fecha a formato ISO
        // Realizar la solicitud al servidor para actualizar la fecha de término
        const response = await axios.put(`http://localhost:5000/update_tarea_persona/${tareaPersonaId}`, {
            fecha_termino: nuevaFechaTermino,
        });
        if (response.status === 200) {
            // Despachar la acción para actualizar la fecha de término en el estado
            dispatch({
                type: UPDATE_FECHA_TERMINO,
                payload: {
                    tareaPersonaId,
                    nuevaFechaTermino,
                },
            });
        } else {
            // Manejar posibles errores en la respuesta del servidor
            console.error('Error al actualizar fecha de término:', response.data.error || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error durante la actualización de fecha de término:', error.message || 'Error desconocido');
    }
};

// Acción para eliminar una tarea-persona de la base de datos
export const deleteTareaPersona = (taskId) => async (dispatch) => {
    // Verificar si taskId es un número
    if (typeof taskId !== 'number') {
        console.error('Error: El ID de tarea debe ser un número.');
        return;
    }
    try {
        // Realizar la solicitud al servidor para eliminar la tarea_persona
        const response = await axios.delete(`http://localhost:5000/delete_tarea_persona_by_task/${taskId}`, {
            params: { id_tarea: taskId }
        });
        if (response.status === 200) {
            // Despachar la acción para eliminar la tarea_persona del estado
            dispatch({
                type: DELETE_TAREA_PERSONA,
                payload: taskId,
            });
        } else {
            // Manejar posibles errores en la respuesta del servidor
            console.error('Error al eliminar tarea_persona:', response.data.error || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error durante la eliminación de tarea_persona:', error.message || 'Error desconocido');
    }
};











