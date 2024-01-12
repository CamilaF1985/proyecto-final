// En tu archivo taskActions.js

// Tipos de acciones
export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';

// Acción para agregar una nueva tarea al estado global
export const addTask = (taskData, users) => {
  // Genera un índice aleatorio para seleccionar un usuario
  const randomIndex = Math.floor(Math.random() * users.length);
  
  // Obtiene el usuario asignado
  const assignedUser = users[randomIndex];

  // Puedes añadir la lógica necesaria para la asignación de tareas a usuarios aquí

  const taskWithAssignment = {
    ...taskData,
    assignedUser,
  };

  return {
    type: ADD_TASK,
    payload: taskWithAssignment,
  };
};
// Acción para eliminar una tarea del estado global
export const deleteTask = (taskId) => {
  return {
    type: DELETE_TASK,
    payload: taskId,
  };
};

