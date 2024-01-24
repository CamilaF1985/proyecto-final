import { createSelector } from 'reselect';

const selectUser = (state) => state.user;
const selectTasks = (state) => state.tasks;
const selectExpenses = (state) => state.expenses;
const selectUsersData = (state) => state.usersData;

// Selector para el tipo de usuario
export const selectUserType = createSelector(
  selectUser,
  (user) => user.userType
);

// Selector para filtrar las tareas que están completadas
export const selectCompletedTasks = createSelector(
  selectTasks,
  (tasks) => tasks.filter((task) => task.completed)
);

// Selector que calcula el total de gastos
export const selectTotalExpenses = createSelector(
  selectExpenses,
  (expenses) => expenses.reduce((total, expense) => total + expense.amount, 0)
);

// Selector para modalIsOpen
export const selectModalIsOpen = (state) => state.modalIsOpen;

// Selector para usersData
export const selectUsersDataSelector = createSelector(
  selectUsersData,
  (usersData) => {
    return usersData.map((user) => ({ ...user, transformedField: user.field * 2 }));
  }
);

// Selector para userId
export const selectUserId = createSelector(
  selectUser,
  (user) => user.id_persona
);

// Exportar todos los selectores en un solo objeto
const selectors = {
  selectModalIsOpen,
  selectUser,
  selectTasks,
  selectExpenses,
  selectUsersDataSelector,
  selectUserId,
};

export default selectors;








