import axios from 'axios';
import { fetchUnitById } from './unitActions.js';

// Tipos de acciones para usuarios
export const SET_USER_TYPE = 'SET_USER_TYPE';
export const CLEAR_USER_DATA = 'CLEAR_USER_DATA';
export const SAVE_USER_DATA = 'SAVE_USER_DATA';
export const GET_USER_BY_RUT = 'GET_USER_BY_RUT';
export const SAVE_NEW_USER_DATA = 'SAVE_NEW_USER_DATA'; // Nuevo tipo de acción

// Acción para guardar datos de usuario en el estado global
export const saveUserData = (userData) => {
  return {
    type: SAVE_USER_DATA,
    payload: userData,
  };
};

// Acción para guardar nuevos datos de usuario nuevo
export const saveNewUserData = (userData) => {
  return async (dispatch) => {
    try {
      // Realiza una solicitud GET para obtener la unidad por su ID
      const unitData = await dispatch(fetchUnitById(userData.id_unidad));

      // Verifica si unitData tiene datos antes de continuar
      if (unitData) {
        // Actualiza el ID de la unidad en userData
        userData.id_unidad = unitData.id;

        // Realiza la solicitud POST al endpoint para crear el administrador
        const response = await axios.post('http://localhost:5000/create_persona_admin', userData);
        // Console logs para identificar errores
        console.log(response);
      } else {
        console.error('Error al obtener la unidad:', unitData);
      }
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  };
};

// Función auxiliar para guardar datos del usuario en el almacenamiento local
export const saveToLocalStorage = (userData) => {
  localStorage.setItem('userType', userData.userType);
  localStorage.setItem('rut', userData.rut);
};

// Acción para realizar el inicio de sesión del usuario
export const loginUser = (formData, closeModal, navigate) => {
  return async (dispatch) => {
    try {
      // Realiza una solicitud POST al servidor de autenticación
      const response = await axios.post('http://localhost:5000/auth/login', {
        rut: formData.rut,                  // Envia el rut desde el formulario
        contrasena: formData.password,      // Envia la contraseña desde el formulario
      });

      // Verifica si la respuesta del servidor es exitosa (código 200)
      if (response.status === 200) {
        // Obtiene los datos del usuario desde la respuesta
        const userData = response.data;
        console.log('Valor de id_perfil:', userData.id_perfil);

        // Determina el tipo de usuario basado en el id_perfil obtenido
        const userType = userData.id_perfil === 1 ? 'Administrador' : 'Inquilino';

        // Agrega el tipo de usuario a los datos del usuario
        userData.userType = userType;

        // Guarda los datos del usuario en el estado global
        dispatch(saveUserData(userData));

        // Guarda los datos del usuario en el localStorage
        saveToLocalStorage(userData);

        // Cierra el modal de inicio de sesión
        closeModal();

        // Redirige a la página correspondiente según el tipo de usuario
        if (userType === 'Administrador') {
          navigate(`/home-administrador`);
        } else if (userType === 'Inquilino') {
          navigate(`/home-inquilino`);
        }
      } else {
        // En caso de respuesta no exitosa, muestra un mensaje de error
        const errorData = response.data;
        alert(`Error: ${errorData.msg}`);
        closeModal();
      }
    } catch (error) {
      // En caso de error durante la solicitud, muestra un mensaje de error
      console.error('Error durante el inicio de sesión:', error);
      alert('Se produjo un error inesperado. Por favor, inténtalo de nuevo más tarde.');
      closeModal();
    }
  };
};

// Acción para buscar al usuario por su RUT
export const getUserByRut = () => {
  return async (dispatch) => {
    try {
      // Obtiene el RUT almacenado en el localStorage
      const rut = localStorage.getItem('rut');

      // Verifica si el RUT está presente en el localStorage
      if (rut) {
        // Realiza una solicitud GET al endpoint para obtener al usuario por su RUT
        const response = await axios.get(`http://localhost:5000/get_persona_by_rut/${rut}`);

        // Verifica si la respuesta del servidor es exitosa (código 200)
        if (response.status === 200) {
          // Obtiene los datos del usuario desde la respuesta
          const userData = response.data;

          // Determina el tipo de usuario basado en el id_perfil obtenido
          const userType = userData.id_perfil === 1 ? 'Administrador' : 'Inquilino';

          // Agrega el tipo de usuario a los datos del usuario
          userData.userType = userType;

          // Guarda los datos del usuario en el estado global
          dispatch(saveUserData(userData));
        } else {
          // En caso de respuesta no exitosa, muestra un mensaje de error
          const errorData = response.data;
          console.error(`Error: ${errorData.error}`);
        }
      } else {
        console.error('Error: RUT no encontrado en el localStorage');
      }
    } catch (error) {
      // En caso de error durante la solicitud, muestra un mensaje de error
      console.error('Error al obtener el usuario por su RUT:', error);
    }
  };
};

// Acción para limpiar los datos del usuario almacenados localmente
export const clearUserData = () => {
  localStorage.removeItem('userType');
  localStorage.removeItem('rut');

  return {
    type: CLEAR_USER_DATA,
  };
};







