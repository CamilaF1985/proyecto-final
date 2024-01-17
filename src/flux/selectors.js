// Importar el selector createSelector desde reselect
import { createSelector } from 'reselect';

// Seleccionar partes del estado desde rootReducer
const selectModalIsOpen = (state) => state.modalIsOpen;
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

// Exportar todos los selectores
export {
  selectModalIsOpen,
  selectUser,
  selectTasks,
  selectExpenses,
};

