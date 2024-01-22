// En tu archivo taskActions.js
import axios from 'axios';
import { assignGastoPersona } from './personExpenseActions.js';  // Importa la acción de personExpenseActions

// tipos de acciones
export const ADD_EXPENSE = 'ADD_EXPENSE';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';
export const SAVE_NEW_EXPENSE_DATA = 'SAVE_NEW_EXPENSE_DATA';
export const GET_GASTO_DETAILS_SUCCESS = 'GET_GASTO_DETAILS_SUCCESS';
export const GET_GASTO_DETAILS_ERROR = 'GET_GASTO_DETAILS_ERROR';
export const SAVE_GASTO_DETAILS = 'SAVE_GASTO_DETAILS';

// Acción para agregar un nuevo gasto al estado global
export const addExpense = (expenseData) => {
    return {
        type: 'ADD_EXPENSE',
        payload: expenseData,
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

            // Si hay una respuesta en el error, imprímela
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

                console.log('Respuesta de getExpensesByUnit:', response.data); // Agregado aquí

                if (response.status === 200) {
                    // Guardar los gastos en el estado global antes de devolver la respuesta
                    dispatch(saveFetchedExpensesData(response.data));
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
            // Realiza la solicitud DELETE al endpoint para eliminar el gasto por su ID
            const response = await axios.delete(`http://localhost:5000/delete_gasto_por_unidad/${expenseId}`);

            if (response.status === 200) {
                // Despacha la acción para eliminar el gasto del estado global
                dispatch(deleteExpense(expenseId));

                // Obtiene y guarda los datos actualizados de gastos utilizando la acción correspondiente
                const updatedExpenses = await dispatch(getExpensesByUnit(localStorage.getItem('id_unidad')));
                dispatch(saveFetchedExpensesData(updatedExpenses));

                // Devuelve los datos actualizados de gastos después de la eliminación
                return updatedExpenses;
            } else {
                // Maneja el caso en que la respuesta del servidor no sea exitosa
                console.error('Error al eliminar el gasto:', response.data.error);
                // Devuelve null o algún valor que indique que la eliminación falló
                return null;
            }
        } catch (error) {
            // Muestra un mensaje de error si ocurre un error durante la eliminación del gasto
            console.error('Error durante la eliminación del gasto:', error);
            // Devuelve null o algún valor que indique que la eliminación falló
            return null;
        }
    };
};

// Acción para obtener detalles del gasto
export const getGastoDetails = (factura) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:5000/get_detalle_gasto/${factura}`);

        if (response.status === 200) {
            const gastoDetails = response.data.gasto;

            // Asegúrate de extraer correctamente el id del objeto gastoDetails
            const gastoId = gastoDetails ? gastoDetails.id : null;

            if (gastoId) {
                console.log('Detalles del gasto obtenidos con éxito:', gastoDetails);
                dispatch({ type: GET_GASTO_DETAILS_SUCCESS, payload: gastoDetails });

                // Agrega un console.log para la data que se está enviando al estado
                console.log('Data enviada al estado:', gastoDetails);

            } else {
                console.error('Error: No se pudo obtener el id del gasto desde los detalles:', gastoDetails);
                dispatch({ type: GET_GASTO_DETAILS_ERROR, payload: 'Error al obtener detalles del gasto' });
            }

            // Mover la línea dentro del bloque try
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







