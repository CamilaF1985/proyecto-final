// Importar acciones relacionadas con el usuario desde userActions.js
import {
  SET_USER_TYPE,
  SAVE_USER_DATA,
  CLEAR_USER_DATA,
  GET_USER_BY_RUT,
  SAVE_NEW_USER_DATA, // Agregado el nuevo tipo de acción
  SAVE_NEW_INQUILINO_DATA,
} from './userActions.js';

// Importar acciones relacionadas con unidades desde unitActions.js
import {
  SAVE_UNIT_DATA,
  FETCH_UNIT_BY_ID,
  SAVE_NEW_UNIT_DATA, // Agregado el nuevo tipo de acción
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
} from './taskActions.js';

// Importar acciones relacionadas con gastos desde expenseActions.js
import {
  ADD_EXPENSE,
  DELETE_EXPENSE,
} from './expenseActions.js';

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
  tasks: [],
  expenses: [],
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
      // No realiza ningún cambio en el estado global, simplemente devuelve el estado actual
      return { ...state, user: { ...state.user, ...action.payload } };

    case SAVE_NEW_USER_DATA: // Agregado el nuevo caso
      return { ...state, user: { ...state.user, ...action.payload } };
    case SAVE_NEW_INQUILINO_DATA: // Agregado el nuevo caso
      return { ...state, user: { ...state.user, ...action.payload } };
    case GET_USER_BY_RUT: // Agregada la acción para obtener el usuario por su RUT
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
      const assignedUser = action.payload.assignedUser;
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, assignedUser }],
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case ADD_EXPENSE:
      return { ...state, expenses: [...state.expenses, action.payload] };
    case DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
      };
    case SAVE_UNIT_DATA:
      return { ...state, unit: { ...state.unit, ...action.payload } };

    case SAVE_NEW_UNIT_DATA: // Agregado el nuevo caso
      return { ...state, unit: { ...state.unit, ...action.payload } };

    case FETCH_UNIT_BY_ID:
      return state;

    default:
      return state;
  }
};

export default rootReducer;






















