import axios from 'axios';
import { fetchUnitById } from './unitActions.js';

// Tipos de acciones para usuarios
export const SET_USER_TYPE = 'SET_USER_TYPE';
export const CLEAR_USER_DATA = 'CLEAR_USER_DATA';
export const SAVE_USER_DATA = 'SAVE_USER_DATA';
export const GET_USER_BY_RUT = 'GET_USER_BY_RUT';
export const SAVE_NEW_USER_DATA = 'SAVE_NEW_USER_DATA';
export const SAVE_NEW_INQUILINO_DATA = 'SAVE_NEW_INQUILINO_DATA';
export const UPDATE_USER_EMAIL = 'UPDATE_USER_EMAIL';
export const SAVE_USERS_DATA = 'SAVE_USERS_DATA';

// Acción para guardar datos de usuario en el estado global
export const saveUserData = (userData) => {
  return {
    type: SAVE_USER_DATA,
    payload: userData,
  };
};

// Acción para guardar datos de usuarios en el estado global
export const saveUsersData = (usersData) => {
  console.log('Guardando datos de usuarios en el estado global:', usersData); // Agrega este log
  return {
    type: SAVE_USERS_DATA,
    payload: usersData,
  };
};

// Acción para guardar nuevos datos de administrador nuevo
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

// Acción para guardar nuevos datos de inquilino
export const saveNewInquilinoData = (userData) => {
  return async (dispatch) => { // Incluye nuevamente el parámetro dispatch
    try {
      // Obtiene el id_unidad desde el localStorage
      const idUnidad = localStorage.getItem('id_unidad');

      // Verifica si id_unidad tiene un valor antes de continuar
      if (idUnidad) {
        // Actualiza el ID de la unidad en userData
        userData.id_unidad = idUnidad;
        console.log('ID de unidad desde localStorage:', idUnidad);

        // Verifica que userData tenga todos los campos necesarios y esté bien formado
        console.log('Datos del inquilino a enviar:', userData);

        // Realiza la solicitud POST al endpoint para crear el inquilino
        const response = await axios.post('http://localhost:5000/create_persona_inquilino', userData);
        console.log('Respuesta del servidor:', response);

        // Despacha la acción para guardar los nuevos datos del inquilino en el estado global
        dispatch(saveUserData(response.data));
      } else {
        console.error('Error: id_unidad no encontrado en el localStorage');
      }
    } catch (error) {
      console.error('Error al guardar el inquilino:', error);
    }
  };
};

// Función auxiliar para guardar datos del usuario en el almacenamiento local
export const saveToLocalStorage = (userData) => {
  localStorage.setItem('id_unidad', userData.id_unidad);
  localStorage.setItem('userType', userData.userType);
  localStorage.setItem('rut', userData.rut);
};

// Acción para realizar el inicio de sesión del usuario
export const loginUser = (formData, closeModal, navigate) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        rut: formData.rut,
        contrasena: formData.password,
      });

      if (response.status === 200) {
        const userData = response.data;

        // Accede a id_unidad directamente desde userData
        const idUnidad = userData.id_unidad;
        console.log('Valor de id_unidad:', idUnidad);

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

// Acción asincrónica para obtener los datos del usuario por su RUT desde el servidor
export const getUserByRut = () => {
  return async (dispatch) => {
    try {
      // Obtiene el RUT almacenado localmente
      const rut = localStorage.getItem('rut');

      if (rut) {
        // Realiza una solicitud al servidor para obtener los datos del usuario por su RUT
        const response = await axios.get(`http://localhost:5000/get_persona_by_rut/${rut}`);

        if (response.status === 200) {
          // Procesa los datos del usuario obtenidos y actualiza el tipo de usuario
          const userData = response.data;
          const userType = userData.id_perfil === 1 ? 'Administrador' : 'Inquilino';
          userData.userType = userType;
          dispatch(saveUserData(userData));

          // Llama a fetchUnitById para obtener los datos de la unidad asociada al usuario
          if (userData.id_unidad) {
            try {
              const unitData = await dispatch(fetchUnitById(userData.id_unidad));
              if (unitData) {
                console.log('Unidad encontrada - ID:', unitData.id, 'Nombre:', unitData.nombre);
              } else {
                console.log('No se encontraron datos de unidad');
              }
            } catch (error) {
              console.error('Error al obtener la unidad:', error);
            }
          }
        } else {
          // Muestra un mensaje de error si la solicitud no fue exitosa
          const errorData = response.data;
          console.error(`Error: ${errorData.error}`);
        }
      } else {
        // Muestra un mensaje de error si el RUT no se encuentra en el localStorage
        console.error('Error: RUT no encontrado en el localStorage');
      }
    } catch (error) {
      // Muestra un mensaje de error si ocurre un error durante la obtención de datos del usuario
      console.error('Error al obtener el usuario por su RUT:', error);
    }
  };
};

// Acción asincrónica para actualizar el correo electrónico del usuario en el servidor
export const updateEmail = (userId, newEmail) => {
  return async () => {
    try {
      // Realiza una solicitud al servidor para actualizar el correo electrónico del usuario
      const response = await axios.put(`http://localhost:5000/update_email_persona/${userId}`, {
        email: newEmail,
      });

      if (response.status === 200) {
        // Muestra un mensaje de éxito si la actualización del correo electrónico fue exitosa
        console.log('Correo electrónico actualizado exitosamente');
      } else {
        // Muestra un mensaje de error si la solicitud no fue exitosa
        console.error('Error al actualizar el correo electrónico:', response.data.error);
      }
    } catch (error) {
      // Muestra un mensaje de error si ocurre un error durante la actualización del correo electrónico
      console.error('Error durante la actualización del correo electrónico:', error);
    }
  };
};

// En la acción getUsersByUnit, devuelve la propiedad 'payload' y envuelve en una Promesa
export const getUsersByUnit = (unitId) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(`http://localhost:5000/get_person_by_unidad/${unitId}`);

        if (response.status === 200) {
          // Guardar los usuarios en el estado global antes de devolver la respuesta
          dispatch(saveUsersData(response.data));
          // Resolver la Promesa con los datos
          resolve(response.data);
        } else {
          console.error('Error en la respuesta del servidor:', response);
          // Rechazar la Promesa con el error
          reject({ error: `Error: ${response.data.error}` });
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        // Rechazar la Promesa con el error
        reject({ error: `Error al obtener usuarios por unidad: ${error.message}` });
      }
    });
  };
};

// Acción para limpiar los datos del usuario almacenados localmente
export const clearUserData = () => {
  // Elimina ciertos elementos del localStorage asociados a los datos del usuario
  localStorage.removeItem('userType');
  localStorage.removeItem('rut');
  localStorage.removeItem('id_unidad');

  // Retorna la acción para indicar la limpieza de los datos del usuario
  return {
    type: CLEAR_USER_DATA,
  };
};








