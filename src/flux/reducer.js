// Importar acciones relacionadas con el usuario desde userActions.js
import {
  SET_USER_TYPE,
  SAVE_USER_DATA,
  CLEAR_USER_DATA,
  GET_USER_BY_RUT,
  SAVE_NEW_USER_DATA,
  SAVE_NEW_INQUILINO_DATA,
  UPDATE_USER_EMAIL,
  SAVE_USERS_DATA,
} from './userActions.js';

// Importar acciones relacionadas con unidades desde unitActions.js
import {
  SAVE_UNIT_DATA,
  FETCH_UNIT_BY_ID,
  SAVE_NEW_UNIT_DATA,
} from './unitActions.js';

// Importar acciones relacionadas con modales desde modalActions.js
import {
  OPEN_MODAL,
  CLOSE_MODAL,
  SET_MODAL_STATE,
} from './modalActions.js';

// Importar acciones relacionadas con tareas desde taskActions.js
import {
  ADD_TASK,
  DELETE_TASK,
  SAVE_NEW_TASK_DATA,
  GET_TASK_BY_NAME, // Agrega la importación del tipo de acción GET_TASK_BY_ID
} from './taskActions.js';

// Importar acciones relacionadas con gastos desde expenseActions.js
import {
  ADD_EXPENSE,
  DELETE_EXPENSE,
  SAVE_NEW_EXPENSE_DATA,
} from './expenseActions.js';

// Importar acciones relacionadas con direcciones desde addressActions.js
import {
  SAVE_COMUNAS_DATA,
  SAVE_REGIONES_DATA,
  CREATE_DIRECCION,
} from './addressActions.js';

// Estado inicial de la aplicación
const initialState = {
  modalIsOpen: false,
  user: {
    userType: null,
    username: null,
    rut: null,
    email: null,
    id_unidad: null,
    nombre_unidad: null
  },

  usersData: [{
    userType: null,
    username: null,
    rut: null,
    email: null,
    id_unidad: null,
  }],

  tasks: [{
    id: null,
    id_unidad: null,
    nombre: null,
  }],

  expenses: [{
    id_unidad: null,
    factura: null,
    monto_original: null,
    descripcion: null,
  }],

  comunas: [],
  regiones: [],
  direcciones: [],
};

// Reducer que maneja las acciones y actualiza el estado global de la aplicación
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return { ...state, modalIsOpen: true };
    case CLOSE_MODAL:
      return { ...state, modalIsOpen: false };
    case SET_USER_TYPE:
      return { ...state, user: { ...state.user, userType: action.payload } };
    case SAVE_USER_DATA:
      return { ...state, user: { ...state.user, ...action.payload } };

    case SAVE_NEW_USER_DATA:
      return { ...state, user: { ...state.user, ...action.payload } };
    case SAVE_NEW_INQUILINO_DATA:
      return { ...state, user: { ...state.user, ...action.payload } };
    case GET_USER_BY_RUT:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case CLEAR_USER_DATA:
      return {
        ...state,
        user: {
          userType: null,
          username: null,
          rut: null,
          email: null,
          id_unidad: null,
        },
      };
    case SET_MODAL_STATE:
      return { ...state, modalIsOpen: action.payload };
    case ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case SAVE_NEW_TASK_DATA:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

      case GET_TASK_BY_NAME:
        const { data, status, statusText } = action.payload;
      
        // Verifica si la tarea ya existe en el estado
        const existingTask = state.tasks.find(task => task.id === data.id);
      
        if (existingTask) {
          // Si la tarea existe, actualiza solo los campos necesarios
          const updatedTasks = state.tasks.map(task => {
            if (task.id === data.id) {
              return { ...task, ...data };
            }
            return task;
          });
      
          return {
            ...state,
            tasks: updatedTasks,
          };
        } else {
          // Si la tarea no existe, agrégala al estado
          return {
            ...state,
            tasks: [...state.tasks, data],
          };
        }
        
    case ADD_EXPENSE:
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
      };

    case SAVE_NEW_EXPENSE_DATA:
      return {
        ...state,
        expenses: action.payload,
      };

    case SAVE_UNIT_DATA:
      return { ...state, unit: { ...state.unit, ...action.payload } };

    case SAVE_NEW_UNIT_DATA:
      return { ...state, unit: { ...state.unit, ...action.payload } };

    case FETCH_UNIT_BY_ID:
      return state;

    case SAVE_COMUNAS_DATA:
      return {
        ...state,
        comunas: action.payload,
      };

    case SAVE_REGIONES_DATA:
      return {
        ...state,
        regiones: action.payload,
      };

    case CREATE_DIRECCION:
      return {
        ...state,
        direcciones: [...state.direcciones, action.payload],
      };

    case UPDATE_USER_EMAIL:
      return {
        ...state,
        user: {
          ...state.user,
          email: action.payload.email,
        },
      };

    case SAVE_USERS_DATA:
      return {
        ...state,
        usersData: action.payload,
      };

    default:
      return state;
  }
};

export default rootReducer;























