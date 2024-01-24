import axios from 'axios';
import { assignGastoPersona } from './personExpenseActions.js';  

// tipos de acciones
export const ADD_EXPENSE = 'ADD_EXPENSE';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';
export const SAVE_NEW_EXPENSE_DATA = 'SAVE_NEW_EXPENSE_DATA';
export const GET_GASTO_DETAILS_SUCCESS = 'GET_GASTO_DETAILS_SUCCESS';
export const GET_GASTO_DETAILS_ERROR = 'GET_GASTO_DETAILS_ERROR';
export const SAVE_GASTO_DETAILS = 'SAVE_GASTO_DETAILS';
export const UPDATE_EXPENSES = 'UPDATE_EXPENSES'; 

// Acción para agregar un nuevo gasto al estado global
export const addExpense = (expenseData) => {
    return {
        type: 'ADD_EXPENSE',
        payload: expenseData,
    };
};

// Acción para actualizar el estado de los gastos
export const updateExpenses = (updatedExpenses) => {
    return {
        type: 'UPDATE_EXPENSES',
        payload: updatedExpenses,
    };
};

// Acción para guardar nuevos gastos
export const saveNewExpenseData = (expenseData) => {
    return async (dispatch) => {
        try {
            // Realiza la solicitud POST al endpoint para crear el gasto usando axios
            const response = await axios.post('http://localhost:5000/create_gasto', expenseData);

            // Verifica si la respuesta es exitosa
            if (response.status === 201) {
                // Despacha la acción para agregar el gasto al estado global
                dispatch(addExpense(response.data));

                // Obtener el id del gasto desde la respuesta
                const gastoId = response.data.id;

                // Llama a la acción para obtener los detalles del gasto
                await dispatch(getGastoDetails(gastoId)); // Espera a que se completen los detalles del gasto

                // Llama a la acción para asignar gasto_persona directamente con el ID del gasto
                dispatch(assignGastoPersona());
            } else {
                // Maneja el caso en que la respuesta del servidor no sea exitosa
                console.error('Error al crear el gasto en el servidor:', response);
            }
        } catch (error) {
            // Maneja los errores de la solicitud
            console.error('Error al guardar el gasto:', error);

            // Imprime toda la respuesta
            console.log('Respuesta completa:', error.response);

            // Imprime si hay una respuesta en el error
            if (error.response) {
                console.error('Detalles de la respuesta:', error.response.data);
            }
        }
    };
};

// Acción para obtener gastos por unidad
export const getExpensesByUnit = (unitId) => {
    return (dispatch) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(`http://localhost:5000/get_gasto_por_unidad/${unitId}`);

                console.log('Respuesta de getExpensesByUnit:', response.data); 

                if (response.status === 200) {
                    // Guardar los gastos en el estado global antes de devolver la respuesta
                    dispatch(addExpense(response.data));
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
                reject({ error: `Error al obtener gastos por unidad: ${error.message}` });
            }
        });
    };
};

// Acción para eliminar un gasto del estado global
export const deleteExpense = (expenseId) => {
    return {
        type: 'DELETE_EXPENSE',
        payload: expenseId,
    };
};

// Acción para eliminar un gasto de la base de datos
export const deleteExpenseFromDatabase = (expenseId) => {
    return async (dispatch) => {
        try {
            const unitId = localStorage.getItem('id_unidad');
            if (!unitId) {
                console.error('No se proporcionó un ID de unidad para la eliminación de gastos.');
                return;
            }

            // Realizar la eliminación del gasto específico por su ID
            const response = await axios.delete(`http://localhost:5000/delete_gasto_por_unidad/${expenseId}`);

            if (response.status === 200) {
                // Despachar la acción para eliminar el gasto del estado global
                dispatch(deleteExpense(expenseId));
            } else {
                console.error(`Error al eliminar el gasto con ID ${expenseId}:`, response.data.error);
            }
        } catch (error) {
            // Si la respuesta del servidor es 200, entonces considerar que la eliminación fue exitosa
            if (error.response && error.response.status === 200) {
                console.log(`Gasto con ID ${expenseId} eliminado correctamente.`);
                dispatch(deleteExpense(expenseId));
            } else {
                console.error(`Error al eliminar el gasto con ID ${expenseId}:`, error);
            }
        }
    };
};

// Acción para obtener detalles del gasto
export const getGastoDetails = (factura) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:5000/get_detalle_gasto/${factura}`);

        if (response.status === 200) {
            const gastoDetails = response.data.gasto;

            // Extraer el ID y el número de factura del objeto gastoDetails
            const gastoId = gastoDetails ? gastoDetails.id : null;
            const gastoFactura = gastoDetails ? gastoDetails.factura : null;
            // Manejo de éxito y errores al ejecutar la acción
            if (gastoId && gastoFactura) {
                console.log('Detalles del gasto obtenidos con éxito:', gastoDetails);
                dispatch({ type: GET_GASTO_DETAILS_SUCCESS, payload: gastoDetails });

                console.log('Data enviada al estado:', gastoDetails);
            } else {
                console.error('Error: No se pudo obtener el ID o el número de factura del gasto desde los detalles:', gastoDetails);
                dispatch({ type: GET_GASTO_DETAILS_ERROR, payload: 'Error al obtener detalles del gasto' });
            }

            dispatch({ type: SAVE_GASTO_DETAILS, payload: gastoDetails });
        } else {
            console.error('Error en getGastoDetails. Estado de la respuesta:', response.status);
            dispatch({ type: GET_GASTO_DETAILS_ERROR, payload: 'Error al obtener detalles del gasto' });
        }
    } catch (error) {
        console.error('Error en getGastoDetails:', error);
        dispatch({ type: GET_GASTO_DETAILS_ERROR, payload: 'Error al obtener detalles del gasto' });
    }
};








