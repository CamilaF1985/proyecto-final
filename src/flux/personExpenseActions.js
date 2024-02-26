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

export const updateEstadoGastoPersona = (idGasto, estadoActualizado) => {
    return {
        type: UPDATE_ESTADO_GASTO_PERSONA,
        payload: { idGasto, estadoActualizado },
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
            return;
        }
        const users = await dispatch(getUsersByUnit(unitId)); // Obtener la lista de usuarios de la unidad

        // Verificar si hay usuarios en la unidad
        if (users.length === 0) {
            console.error('Error: No hay usuarios en la unidad para asignar el gasto_persona.');
            return;
        }

        const gastoDetails = getState().gastoDetails; // Obtener los detalles del gasto del estado global
        // Verificar si los detalles del gasto existen
        if (!gastoDetails?.id) {
            console.error('Error: Detalles del gasto no encontrados en el estado global.');
            return;
        }

        // Calcular el monto prorrateado dividido entre los usuarios de la unidad
        const montoProrrateadoPorUsuario = Math.floor(gastoDetails.monto / users.length);
        // Construir la data para asignar a gasto_persona
        const gastoPersonaDataArray = users.map((user) => {
            return {
                id_gasto: gastoDetails.id, // Usar el id del gasto desde gastoDetails
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
        const responses = await Promise.all(
            gastoPersonaDataArray.map((gastoPersonaData) =>
                axios.post('http://localhost:5000/create_gasto_persona', gastoPersonaData)
            )
        );
        // Verificar si todas las respuestas son exitosas
        const allResponsesSuccessful = responses.every((response) => response.status === 201);
        if (allResponsesSuccessful) {
        } else {
            console.error('Error al crear los registros en gasto_persona:', responses);
        }
    } catch (error) {
        // Manejar los errores de la solicitud
        console.error('Error al asignar gasto_persona:', error);
        if (error.response) {
            console.error('Detalles de la respuesta:', error.response.data); // Imprimir respuesta de error
        }
    }
};

// Acción para obtener los gastos persona desde la base de datos
export const getGastosPersona = () => {
    return async (dispatch, getState) => {

        try {
            await dispatch(getUserByRut()); // Obtiene la data de la persona llamando a getUserByRut
            const idUsuario = getState().user.id; //extrae el id del usuario
            //Solicitud a la api para obtener los gastos persona del usuario
            const response = await axios.get(`http://localhost:5000/gasto_persona_by_id_persona/${idUsuario}`);

            if (response.status === 200) {
                if (response.data && response.data.gastos_persona_list) {
                    const gastosPersona = response.data.gastos_persona_list; //agrega la respuesta a la lista local
                    // Extrae ids de gasto y de la persona
                    const idsGastos = gastosPersona.map(gastoPersona => ({
                        idGasto: gastoPersona.id_gasto,
                        idPersona: gastoPersona.id_persona
                    }));

                    dispatch(saveIdsGastos(idsGastos)); //Guardar los ids en el estado local
                    dispatch(saveGastosPersona(gastosPersona)); //Guardar los gastos persona en el estado local
                    return gastosPersona;

                } else {
                    console.error('Error: La respuesta del servidor no contiene la propiedad gastos_persona_list.');
                }
            } else {
                const errorData = response.data;
                console.error(`Error al obtener los gastos persona: ${errorData.error}`);
            }

        } catch (error) {
            console.error('Error en la acción getGastosPersona:', error);
            throw error;
        }
    };
};

// Acción para modificar el estado de gasto persona en la base de datos
export const updateEstadoGastoPersonaEnBD = (selectedGasto) => {
    return async () => {
        try {
            //Disponibilizar los ids de gasto y persona del gasto persona seleccionado
            const { id_gasto, id_persona } = selectedGasto;
            if (!id_gasto || !id_persona) {
                console.error('Objeto seleccionado no tiene los valores necesarios.');
                throw new Error('Objeto seleccionado no tiene los valores necesarios.');
            }

            // Realizar la solicitud para actualizar el estado de gasto persona
            const response = await axios.put(`http://localhost:5000/update_estado_gasto_persona/${id_gasto}/${id_persona}`);
            if (response.status === 200) {
            } else {
                console.error('Error al actualizar el estado de gasto persona:', response.data);
                throw new Error('Error al actualizar el estado de gasto persona.');
            }

        } catch (error) {
            console.error('Error en la acción updateEstadoGastoPersonaEnBD:', error);
            throw error;
        }
    };
};












































































