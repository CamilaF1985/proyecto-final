import axios from 'axios';
import { fetchUnitById } from './unitActions.js';

// Tipos de acciones 
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
  console.log('Guardando datos de usuarios en el estado global:', usersData); 
  return {
    type: SAVE_USERS_DATA,
    payload: usersData,
  };
};

// Acción para guardar nuevos datos de administrador nuevo
export const saveNewUserData = (userData) => {
  return async (dispatch) => {
    try {
      // Realizar una solicitud GET para obtener la unidad por su ID
      const unitData = await dispatch(fetchUnitById(userData.id_unidad));

      // Verificar si unitData tiene datos antes de continuar
      if (unitData) {
        // Actualizar el ID de la unidad en userData
        userData.id_unidad = unitData.id;

        // Realizar la solicitud POST al endpoint para crear el administrador
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

// Acción para guardar nuevo inquilino en la base de datos
export const saveNewInquilinoData = (userData) => {
  return async (dispatch) => { 
    try {
      // Obtener el id_unidad desde el localStorage
      const idUnidad = localStorage.getItem('id_unidad');

      // Verificar si id_unidad tiene un valor antes de continuar
      if (idUnidad) {
        // Actualizar el ID de la unidad en userData
        userData.id_unidad = idUnidad;
        console.log('ID de unidad desde localStorage:', idUnidad);

        // Verificar que userData tenga todos los campos necesarios y esté bien formado
        console.log('Datos del inquilino a enviar:', userData);

        // Realizar la solicitud POST al endpoint para crear el inquilino
        const response = await axios.post('http://localhost:5000/create_persona_inquilino', userData);
        console.log('Respuesta del servidor:', response);

        // Despachar la acción para guardar los nuevos datos del inquilino en el estado global
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

        // Acceder a id_unidad directamente desde userData
        const idUnidad = userData.id_unidad;
        console.log('Valor de id_unidad:', idUnidad);

        // Determinar el tipo de usuario basado en el id_perfil obtenido
        const userType = userData.id_perfil === 1 ? 'Administrador' : 'Inquilino';

        // Agregar el tipo de usuario a los datos del usuario
        userData.userType = userType;

        // Guardar los datos del usuario en el estado global
        dispatch(saveUserData(userData));

        // Guardar los datos del usuario en el localStorage
        saveToLocalStorage(userData);

        // Cerrar el modal de inicio de sesión
        closeModal();

        // Redirigir a la página correspondiente según el tipo de usuario
        if (userType === 'Administrador') {
          navigate(`/home-administrador`);
        } else if (userType === 'Inquilino') {
          navigate(`/home-inquilino`);
        }
      } else {
        // En caso de respuesta no exitosa, mostrar un mensaje de error
        const errorData = response.data;
        alert(`Error: ${errorData.msg}`);
        closeModal();
      }
    } catch (error) {
      // En caso de error durante la solicitud, mostrar un mensaje de error
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
      const rut = localStorage.getItem('rut');

      if (rut) {
        const response = await axios.get(`http://localhost:5000/get_persona_by_rut/${rut}`);

        if (response.status === 200) {
          const userData = response.data;
          const userType = userData.id_perfil === 1 ? 'Administrador' : 'Inquilino';
          userData.userType = userType;

          // Utilizar una promesa para esperar a que el estado se actualice antes de resolver
          return new Promise((resolve) => {
            dispatch(saveUserData(userData));
            resolve();
          });
        } else {
          const errorData = response.data;
          console.error(`Error: ${errorData.error}`);
        }
      } else {
        console.error('Error: RUT no encontrado en el localStorage');
      }
    } catch (error) {
      console.error('Error al obtener el usuario por su RUT:', error);
    }
  };
};

// Acción asincrónica para actualizar el correo electrónico del usuario en el servidor
export const updateEmail = (userId, newEmail) => {
  return async () => {
    try {
      // Realizar una solicitud al servidor para actualizar el correo electrónico del usuario
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

// Acción para obtener usuarios pertenecientes a una unidad
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

// Acción para borrar a una persona por su RUT
export const deletePersonaByRut = (rut, id_unidad) => {
  return async (dispatch) => {
    try {
      // Realiza la solicitud DELETE al endpoint para eliminar la persona por su RUT
      const response = await axios.delete(`http://localhost:5000/delete_persona_by_rut/${rut}/${id_unidad}`);

      if (response.status === 200) {
        // Muestra un mensaje de éxito si la persona fue eliminada correctamente
        console.log('Persona eliminada exitosamente');

        // Despacha la acción para obtener y guardar los datos actualizados de usuarios
        const updatedUsers = await dispatch(getUsersByUnit(id_unidad));
        dispatch(saveUsersData(updatedUsers));

        // Devolvemos los datos actualizados de usuarios después de la eliminación
        return updatedUsers;
      } else {
        // Muestra un mensaje de error si la solicitud no fue exitosa
        console.error('Error al eliminar la persona:', response.data.error);
        // Devolvemos null si la eliminación falló
        return null;
      }
    } catch (error) {
      // Muestra un mensaje de error si ocurre un error durante la eliminación de la persona
      console.error('Error durante la eliminación de la persona:', error);
      // Devolvemos null si la eliminación falló
      return null;
    }
  };
};

// Acción para limpiar los datos del usuario almacenados localmente
export const clearUserData = () => {
  // Eliminar ciertos elementos del localStorage asociados a los datos del usuario
  localStorage.removeItem('userType');
  localStorage.removeItem('rut');
  localStorage.removeItem('id_unidad');

  // Retornar la acción para indicar la limpieza de los datos del usuario
  return {
    type: CLEAR_USER_DATA,
  };
};








