// tipos de acciones
export const ADD_EXPENSE = 'ADD_EXPENSE';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';

// Acción para agregar un nuevo gasto al estado global
export const addExpense = (expenseData) => {
    return {
        type: 'ADD_EXPENSE',
        payload: expenseData,
    };
};

// Acción para eliminar un gasto del estado global
export const deleteExpense = (expenseId) => {
    return {
        type: 'DELETE_EXPENSE',
        payload: expenseId,
    };
};