// En tu archivo personExpenseActions.js
import axios from 'axios';
import { getUsersByUnit } from './userActions.js';
export const ADD_GASTO_PERSONA = 'ADD_GASTO_PERSONA';
export const GET_GASTOS_PERSONA_BY_ID_GASTO = 'GET_GASTOS_PERSONA_BY_ID_GASTO';

// Acción para agregar gasto_persona al estado global
export const addGastoPersona = (expensePersonaData) => {
    return {
        type: ADD_GASTO_PERSONA,
        payload: expensePersonaData,
    };
};

// Acción para asignar gasto_persona después de crear un nuevo gasto
export const assignGastoPersona = () => async (dispatch, getState) => {
    try {
        // Obtener el id de la unidad desde localStorage y convertirlo a número
        const unitId = Number(localStorage.getItem('id_unidad'));

        // Verificar si id_unidad tiene un valor
        if (!unitId) {
            console.error('Error: id_unidad no encontrado en el localStorage o no es un número válido');
            // Manejar el error, si es necesario
            return;
        }

        // Obtener la lista de usuarios de la unidad
        const users = await dispatch(getUsersByUnit(unitId));

        // Verificar si hay usuarios en la unidad
        if (users.length === 0) {
            console.error('Error: No hay usuarios en la unidad para asignar el gasto_persona.');
            // Manejar el error, si es necesario
            return;
        }

        // Obtener los detalles del gasto directamente del estado global
        const gastoDetails = getState().gastoDetails;

        // Verificar si los detalles del gasto existen
        if (!gastoDetails?.id) {
            console.error('Error: Detalles del gasto no encontrados en el estado global.');
            // Manejar el error, si es necesario
            return;
        }

        // Calcular el monto prorrateado dividido entre los usuarios de la unidad
        const montoProrrateadoPorUsuario = Math.floor(gastoDetails.monto / users.length);

        // Construir la data para asignar a gasto_persona
        const gastoPersonaDataArray = users.map((user) => {
            return {
                id_gasto: gastoDetails.id, // Usar el id del gasto directamente desde gastoDetails
                id_unidad: unitId,
                id_persona: user.id,
                monto_prorrateado: montoProrrateadoPorUsuario,
            };
        });

        // Despachar la acción para agregar gasto_persona al estado global
        gastoPersonaDataArray.forEach((gastoPersonaData) => {
            dispatch(addGastoPersona(gastoPersonaData));
        });

        // Realizar la solicitud POST para crear los registros en la tabla gasto_persona
        console.log('Data enviada a create_gasto_persona:', gastoPersonaDataArray);
        const responses = await Promise.all(
            gastoPersonaDataArray.map((gastoPersonaData) =>
                axios.post('http://localhost:5000/create_gasto_persona', gastoPersonaData)
            )
        );

        // Verificar si todas las respuestas son exitosas
        const allResponsesSuccessful = responses.every((response) => response.status === 201);

        if (allResponsesSuccessful) {
            console.log('Gastos Persona creados exitosamente:', responses.map((response) => response.data));
        } else {
            console.error('Error al crear los registros en gasto_persona:', responses);
        }
    } catch (error) {
        // Manejar los errores de la solicitud
        console.error('Error al asignar gasto_persona:', error);

        // Imprimir toda la respuesta
        console.log('Respuesta completa:', error.response);

        // Si hay una respuesta en el error, imprímela
        if (error.response) {
            console.error('Detalles de la respuesta:', error.response.data);
        }
    }
};































