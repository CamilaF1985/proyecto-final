import axios from 'axios';
import { getUsersByUnit } from './userActions.js';
import { getUserByRut } from './userActions.js';

// tipos de acciones
export const ADD_GASTO_PERSONA = 'ADD_GASTO_PERSONA';
export const GET_GASTOS_PERSONA = 'GET_GASTOS_PERSONA';
export const SAVE_GASTOS_PERSONA = 'SAVE_GASTOS_PERSONA';
export const UPDATE_ESTADO_GASTO_PERSONA = 'UPDATE_ESTADO_GASTO_PERSONA';
export const SAVE_IDS_GASTOS = 'SAVE_IDS_GASTOS';

// Acción para agregar gasto_persona al estado global
export const addGastoPersona = (expensePersonaData) => {
    return {
        type: ADD_GASTO_PERSONA,
        payload: expensePersonaData,
    };
};

// Acción para guardar los gastos persona en el estado
export const saveGastosPersona = (gastosPersona) => {
    return {
        type: SAVE_GASTOS_PERSONA,
        payload: gastosPersona,
    };
};

// Acción para guardar los Ids en el estado
export const saveIdsGastos = (ids) => ({
    type: SAVE_IDS_GASTOS,
    payload: ids,
});

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

        // Imprimir respuesta de error
        if (error.response) {
            console.error('Detalles de la respuesta:', error.response.data);
        }
    }
};

// Acción para obtener los gastos persona desde la base de datos
export const getGastosPersona = () => {
    return async (dispatch, getState) => {
        try {
            await dispatch(getUserByRut());
            const idUsuario = getState().user.id;

            // Realizar la solicitud al servidor para obtener los gastos persona
            const response = await axios.get(`http://localhost:5000/gasto_persona_by_id_persona/${idUsuario}`);

            if (response.status === 200) {
                const gastosPersona = response.data && response.data.gastos_persona_list;

                if (gastosPersona) {
                    // Guarda los ids en el estado
                    const idsGastos = gastosPersona.map(gastoPersona => ({
                        idGasto: gastoPersona.id_gasto,
                        idPersona: gastoPersona.id_persona
                    }));
                    dispatch(saveIdsGastos(idsGastos));

                    // Guarda los datos en el estado local o realiza cualquier otro procesamiento necesario
                    dispatch(saveGastosPersona(gastosPersona));
                } else {
                    console.error('Error: La respuesta del servidor no contiene la propiedad gastos_persona_list.');
                }
            } else {
                const errorData = response.data;
                console.error(`Error al obtener los gastos persona: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error en la acción getGastosPersona:', error);
        }
    };
};

// Accion para modificar el estado de un gasto persona en la base de datos
export const updateEstadoGastoPersona = (selectedGasto) => {
    return async (dispatch, getState) => {
        try {
            const { id_gasto, id_persona } = selectedGasto;

            if (!id_gasto || !id_persona) {
                console.error('Objeto seleccionado no tiene los valores necesarios.');
                return;
            }

            // Realiza la solicitud para actualizar el estado de gasto persona
            const response = await axios.put(`http://localhost:5000/update_estado_gasto_persona/${id_gasto}/${id_persona}`);

            if (response.status === 200) {
                // Actualiza el estado local directamente sin llamar a getGastosPersona()
                dispatch({
                    type: UPDATE_ESTADO_GASTO_PERSONA,
                    payload: { idGasto: id_gasto, estadoActualizado: true },
                });

                // Log del estado actualizado
                console.log('Estado actualizado después de la acción:', getState());

                console.log('Estado de gasto persona actualizado exitosamente:', response.data);

                // Obtener los datos actualizados nuevamente después de la actualización del estado
                await dispatch(getGastosPersona());

                // Ahora, el estado debería estar actualizado con la lista completa de gastos persona
            } else {
                console.error('Error al actualizar el estado de gasto persona:', response.data);
            }
        } catch (error) {
            console.error('Error en la acción updateEstadoGastoPersona:', error);
        }
    };
};





































































