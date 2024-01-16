// En tu archivo taskActions.js
import axios from 'axios';

// tipos de acciones
export const ADD_EXPENSE = 'ADD_EXPENSE';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';
export const SAVE_NEW_EXPENSE_DATA = 'SAVE_NEW_EXPENSE_DATA';

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
            // Obtiene el id_unidad desde el localStorage
            const idUnidad = localStorage.getItem('id_unidad');

            // Verifica si id_unidad tiene un valor antes de continuar
            if (idUnidad) {
                // Actualiza el ID de la unidad en expenseData
                expenseData.id_unidad = idUnidad;

                // Realiza la solicitud POST al endpoint para crear el gasto usando axios
                const response = await axios.post('http://localhost:5000/create_gasto', expenseData);

                // Verifica si la respuesta es exitosa
                if (response.status === 201) {
                    // Despacha la acción para agregar el gasto al estado global
                    dispatch(addExpense(response.data));
                } else {
                    // Maneja el caso en que la respuesta del servidor no sea exitosa
                    console.error('Error al crear el gasto en el servidor:', response);
                }

                // Imprime la data de la respuesta
                console.log('Data de la respuesta:', response.data);
            } else {
                console.error('Error: id_unidad no encontrado en el localStorage');
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

// Acción para eliminar un gasto del estado global
export const deleteExpense = (expenseId) => {
    return {
        type: 'DELETE_EXPENSE',
        payload: expenseId,
    };
};
