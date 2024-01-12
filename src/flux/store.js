import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer.js';

// Configuración del store de Redux
const store = configureStore({
  reducer: rootReducer,
});

export default store;







