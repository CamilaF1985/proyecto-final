// Importar el selector createSelector desde reselect
import { createSelector } from 'reselect';

// Seleccionar partes del estado desde rootReducer
const selectModalIsOpenFromState = (state) => state.modalIsOpen;  // Cambié el nombre aquí
const selectUser = (state) => state.user;
const selectTasks = (state) => state.tasks;
const selectExpenses = (state) => state.expenses;

// Ejemplo de un selector que deriva algún valor del estado
export const selectUserType = createSelector(
  selectUser,
  (user) => user.userType
);

// Ejemplo de un selector que filtra tareas basado en alguna condición
export const selectCompletedTasks = createSelector(
  selectTasks,
  (tasks) => tasks.filter((task) => task.completed)
);

// Ejemplo de un selector que calcula el total de gastos
export const selectTotalExpenses = createSelector(
  selectExpenses,
  (expenses) => expenses.reduce((total, expense) => total + expense.amount, 0)
);

export const selectModalIsOpen = createSelector(
  selectModalIsOpenFromState,  // Cambié el nombre aquí
  (modalIsOpen) => modalIsOpen
);

// Exportar todos los selectores en un solo objeto
const selectors = {
  selectModalIsOpen,
  selectUser,
  selectTasks,
  selectExpenses,
};

export default selectors;







