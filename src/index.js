import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { saveUserData } from './flux/userActions.js';
import { Provider } from 'react-redux';
import store from './flux/store.js';
import AppRoutes from './routes/routes.jsx';
import ReactModal from 'react-modal';

// Configuración de React Modal
ReactModal.setAppElement('#root'); // Establece el elemento raíz de la aplicación para React Modal

// Cargar los datos del usuario desde localStorage al iniciar la aplicación
const userType = localStorage.getItem('userType');
const username = localStorage.getItem('username');

if (userType && username) {
  store.dispatch(saveUserData({ userType, username }));
}

// Utiliza createRoot desde "react-dom/client"
const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    {/* Envuelve la aplicación con el componente Provider de Redux para proporcionar el store */}
    <Router>
      <AppRoutes />
      {/* Componente principal que contiene las rutas de la aplicación */}
    </Router>
  </Provider>
);







