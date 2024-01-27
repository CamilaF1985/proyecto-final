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
  CLEAR_ENTIRE_STATE,
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
  GET_TASK_BY_NAME,
} from './taskActions.js';

// Importar acciones relacionadas con gastos desde expenseActions.js
import {
  ADD_EXPENSE,
  DELETE_EXPENSE,
  SAVE_NEW_EXPENSE_DATA,
  GET_GASTO_DETAILS_SUCCESS,
  GET_GASTO_DETAILS_ERROR,
  SAVE_GASTO_DETAILS,
  UPDATE_EXPENSES,
} from './expenseActions.js';

// Importar acciones relacionadas con direcciones desde addressActions.js
import {
  SAVE_COMUNAS_DATA,
  SAVE_REGIONES_DATA,
  CREATE_DIRECCION,
  UPDATE_DIRECCION,
} from './addressActions.js';

// Importar acciones relacionas con tarea persona desde personTaskActions.js
import {
  SAVE_TAREAS_ASIGNADAS,
  UPDATE_FECHA_TERMINO,
} from './personTaskActions.js';

// Importar acciones relacionas con gasto persona desde personExpenseActions.js
import {
  ADD_GASTO_PERSONA,
  SAVE_GASTOS_PERSONA,
  UPDATE_ESTADO_GASTO_PERSONA,
  SAVE_IDS_GASTOS,
} from './personExpenseActions.js';

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
  direccionesBD: [],
  unit: {},
  tareasAsignadas: [],
  gastoPersonaList: [],
  gastosPersonaListAsync: [],
  gastosPersonaListActualizado: [],
  idsGastos: [],
  gastoDetails: {},
  gastoDetailsError: null,
  updatedExpenses: []
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
      const { data } = action.payload;

      const existingTask = state.tasks.find(task => task.id === data.id);

      if (existingTask) {
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

        return {
          ...state,
          tasks: [...state.tasks, data],
        };
      }

    case SAVE_TAREAS_ASIGNADAS:
      return {
        ...state,
        tareasAsignadas: action.payload,
      };

    case UPDATE_FECHA_TERMINO:
      const { tareaPersonaId, nuevaFechaTermino } = action.payload;

      const updatedTareasAsignadas = state.tareasAsignadas.map(tarea => {
        if (tarea.id_tarea_persona === tareaPersonaId) {
          return { ...tarea, fecha_termino: nuevaFechaTermino };
        }
        return tarea;
      });

      return {
        ...state,
        tareasAsignadas: updatedTareasAsignadas,
      };

    case FETCH_UNIT_BY_ID:
      return state;
    case ADD_EXPENSE:
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case DELETE_EXPENSE:
      const updatedExpenses = state.expenses.filter((expense) => expense.id !== action.payload);
      return {
        ...state,
        expenses: updatedExpenses,
      };

    case SAVE_NEW_EXPENSE_DATA:
      return {
        ...state,
        expenses: action.payload,
      };

    case SAVE_GASTO_DETAILS:
      return {
        ...state,
        gastoDetails: action.payload,
        gastoDetailsError: null,
      };

    case GET_GASTO_DETAILS_SUCCESS:
      return {
        ...state,
        gastoDetails: action.payload,
        gastoDetailsError: null,
      };

    case GET_GASTO_DETAILS_ERROR:
      return {
        ...state,
        gastoDetails: null,
        gastoDetailsError: action.payload,
      };

    case UPDATE_EXPENSES:
      return {
        ...state,
        gastos: action.payload,
      };

    case ADD_GASTO_PERSONA:
      return {
        ...state,
        gastoPersonaList: [...state.gastoPersonaList, action.payload],
      }

    case SAVE_GASTOS_PERSONA:
      return {
        ...state,
        gastosPersonaListAsync: action.payload,
      };

    case UPDATE_ESTADO_GASTO_PERSONA:
      const { idGasto, estadoActualizado } = action.payload;

      console.log('idGasto:', idGasto);
      console.log('estadoActualizado:', estadoActualizado);

      const gastosPersonaListActualizado = state.gastosPersonaListAsync.map((gasto) =>
        gasto.id_gasto === idGasto ? { ...gasto, estado: estadoActualizado } : gasto
      );

      console.log('gastosPersonaListActualizado:', gastosPersonaListActualizado);

      return {
        ...state,
        gastosPersonaListActualizado: gastosPersonaListActualizado,
      };

    case SAVE_IDS_GASTOS:
      return {
        ...state,
        idsGastos: action.payload,
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

    case UPDATE_DIRECCION:
      return {
        ...state,
        direccionesBD: [...state.direccionesBD, action.payload],
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

    case CLEAR_ENTIRE_STATE:
      return initialState;

    default:
      return state;

  }

};

export default rootReducer;
























