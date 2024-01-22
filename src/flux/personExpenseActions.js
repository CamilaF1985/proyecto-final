// En tu archivo personExpenseActions.js
import axios from 'axios';
import { getUsersByUnit } from './userActions.js';
import { getGastoDetails } from './expenseActions.js';

export const ADD_GASTO_PERSONA = 'ADD_GASTO_PERSONA';
export const UPDATE_GASTOS_PERSONA = 'UPDATE_GASTOS_PERSONA';
export const GET_GASTOS_PERSONA_BY_ID_GASTO = 'GET_GASTOS_PERSONA_BY_ID_GASTO';

// Acción para agregar gasto_persona al estado global
export const addGastoPersona = (expensePersonaData) => {
    return {
        type: ADD_GASTO_PERSONA,
        payload: expensePersonaData,
    };
};

// Acción para actualizar los gastos persona en el estado global
export const updateGastosPersona = (gastosPersonaDataArray) => {
    return {
        type: UPDATE_GASTOS_PERSONA,
        payload: gastosPersonaDataArray,
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

// Acción para obtener gastos persona por el ID de gasto
export const getGastosPersonaByIdGasto = (gastoId) => async (dispatch) => {
    try {
        // Realiza la solicitud GET para obtener los gastos persona por el ID de gasto
        const response = await axios.get(`http://localhost:5000/gasto_persona_by_id_gasto/${gastoId}`);

        if (response.status === 200) {
            const gastosPersonaList = response.data.gastos_persona_list;

            // Despacha la acción para actualizar los gastos persona en el estado global
            dispatch(updateGastosPersona(gastosPersonaList));

            console.log('Gastos Persona obtenidos y actualizados exitosamente:', gastosPersonaList);
        } else {
            console.error('Error al obtener gastos persona por ID de gasto:', response.data.error);
            // Puedes despachar alguna acción adicional en caso de error
        }
    } catch (error) {
        // Maneja los errores de la solicitud
        console.error('Error al obtener gastos persona por ID de gasto:', error);

        // Imprime toda la respuesta
        console.log('Respuesta completa:', error.response);

        // Si hay una respuesta en el error, imprímela
        if (error.response) {
            console.error('Detalles de la respuesta:', error.response.data);
        }

        // Puedes despachar alguna acción adicional en caso de error
    }
};

// Acción para eliminar gastos persona por el ID del gasto asociado
export const deleteGastoPersonaByGasto = (factura) => async (dispatch, getState) => {
    try {
        // Obtén los detalles del gasto antes de eliminar los gastos persona
        const gastoDetailsResponse = await axios.get(`http://localhost:5000/get_detalle_gasto/${factura}`);

        if (gastoDetailsResponse.status === 200) {
            // Imprime los detalles del gasto
            console.log('Detalles del gasto obtenidos con éxito:', gastoDetailsResponse.data.gasto);

            // Verifica si hay gastos persona asociados al gasto
            if (gastoDetailsResponse.data.gasto && gastoDetailsResponse.data.gasto.gasto_persona && gastoDetailsResponse.data.gasto.gasto_persona.length > 0) {
                // Imprime los detalles de gasto_persona
                console.log('Detalles de gasto_persona:', gastoDetailsResponse.data.gasto.gasto_persona);

                // Obtén el ID del gasto desde los detalles del gasto
                const gastoId = gastoDetailsResponse.data.gasto.id;

                // Realiza la solicitud DELETE para eliminar los gastos persona por el ID del gasto
                const deleteGastoPersonaResponse = await axios.delete(
                    `http://localhost:5000/delete_gasto_persona_by_gasto/${gastoId}`
                );

                console.log('Respuesta completa al eliminar gastos persona:', deleteGastoPersonaResponse);

                if (deleteGastoPersonaResponse.status === 200) {
                    console.log('Gastos Persona eliminados exitosamente:', deleteGastoPersonaResponse.data.message);

                    // Llama a la acción para obtener detalles del gasto después de la eliminación
                    await dispatch(getGastoDetails(factura));

                    // Obtén el ID del gasto desde el estado global después de la eliminación
                    const estadoGlobal = getState();
                    const gastoDetailsId = estadoGlobal.gastoDetails.id;

                    console.log('ID del gasto desde el estado global después de la eliminación:', gastoDetailsId);

                    // Puedes despachar alguna acción adicional si es necesario
                } else {
                    console.error('Error al eliminar gastos persona:', deleteGastoPersonaResponse.data.error);
                    // Puedes despachar alguna acción adicional en caso de error
                }
            } else {
                console.log('No hay gastos persona asociados al gasto o gasto_persona es undefined.');
            }
        } else {
            console.error('Error al obtener detalles del gasto:', gastoDetailsResponse.data.error);
        }
    } catch (error) {
        // Maneja los errores de la solicitud
        console.error('Error durante la eliminación de gastos persona:', error);

        // Imprime toda la respuesta
        console.log('Respuesta completa:', error.response);

        // Si hay una respuesta en el error, imprímela
        if (error.response) {
            console.error('Detalles de la respuesta:', error.response.data);
        }

        // Puedes despachar alguna acción adicional en caso de error
    }
};






























