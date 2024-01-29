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
export const CLEAR_ENTIRE_STATE = 'CLEAR_ENTIRE_STATE';

// Acción para limpiar el estado
export const clearEntireState = () => {
  return {
    type: CLEAR_ENTIRE_STATE,
  };
};

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
        userData.id_unidad = unitData.id; // Actualizar el ID de la unidad en userData
        // Realizar la solicitud POST al endpoint para crear el administrador
        const response = await axios.post('http://localhost:5000/create_persona_admin', userData);
        // Verificar si la respuesta tiene un código de estado exitoso 
        if (response.status >= 200 && response.status < 300) {
          console.log('Usuario creado exitosamente:', response.data);
        } else {
          // Si la respuesta no es exitosa, lanzar una excepción con el mensaje del servidor
          throw new Error(`Error al crear el usuario: ${response.data.msg}`);
        }
      } else {
        console.error('Error al obtener la unidad:', unitData);
      }
    } catch (error) {
      throw error;  // Lanzar la excepción para ser capturada por el componente
    }
  };
};

// Acción para guardar nuevo inquilino en la base de datos
export const saveNewInquilinoData = (userData) => {
  return async (dispatch) => {
    return new Promise(async (resolve, reject) => {
      try {
        const idUnidad = localStorage.getItem('id_unidad'); // Obtener el id_unidad desde el localStorage
        // Verificar si id_unidad tiene un valor antes de continuar
        if (idUnidad) {
          userData.id_unidad = idUnidad;  // Actualizar el ID de la unidad en userData
          console.log('ID de unidad desde localStorage:', idUnidad);
          console.log('Datos del inquilino a enviar:', userData);  // Verificar contenido de UserData
          // Realizar la solicitud POST al endpoint para crear el inquilino
          const response = await axios.post('http://localhost:5000/create_persona_inquilino', userData);
          console.log('Respuesta del servidor:', response);
          // Despachar la acción para guardar los nuevos datos del inquilino en el estado global
          dispatch(saveUserData(response.data));
          resolve(response.data);  // Resolver la promesa con el resultado de la solicitud
        } else {
          console.error('Error: id_unidad no encontrado en el localStorage');
          // Rechazar la promesa con un mensaje de error
          reject(new Error('Error: id_unidad no encontrado en el localStorage'));
        }
      } catch (error) {
        console.error('Error al guardar el inquilino:', error);
        reject(error); // Rechazar la promesa con el error obtenido
      }
    });
  };
};

// Función auxiliar para guardar datos del usuario en el almacenamiento local
export const saveToLocalStorage = (userData) => {
  localStorage.setItem('id_unidad', userData.id_unidad);
  localStorage.setItem('userType', userData.userType);
  localStorage.setItem('rut', userData.rut);
  sessionStorage.setItem('miToken', userData.token);
};

export const loginUser = (formData, closeModal, navigate) => {
  return async (dispatch) => {
    try {
      const existingToken = sessionStorage.getItem('miToken');// Verificar si hay un token en sessionStorage
      if (existingToken) {
        const userType = localStorage.getItem('userType');// Si ya hay un token almacenado, redirigir al usuario
        if (userType === 'Administrador') {
          navigate(`/home-administrador`);
        } else if (userType === 'Inquilino') {
          navigate(`/home-inquilino`);
        }
        return;
      }
      const response = await axios.post('http://localhost:5000/auth/login', {
        rut: formData.rut,
        contrasena: formData.password,
      });
      const userData = response.data || {}; // Asegurarse de que userData esté bien definido 
      const miToken = userData.token; // Agregar el token a una variable separada
      const expirationTimestamp = getJwtExpirationTimestamp(miToken); //Obtener la fecha de expiración del token
      userData.tokenExpiration = expirationTimestamp; // Incluir la fecha de expiración en userData
      sessionStorage.setItem('tokenExpiration', expirationTimestamp); // Almacena la fecha de expiración en sessionStorage 
      console.log('Respuesta del servidor:', response.data); // Imprimir la data de la respuesta del servidor
      sessionStorage.setItem('miToken', miToken); // Guardar el token en sessionStorage
      const idUnidad = userData.id_unidad; // Acceder a id_unidad desde userData
      console.log('Valor de id_unidad:', idUnidad);
      const userType = userData.id_perfil === 1 ? 'Administrador' : 'Inquilino';  // Determinar el tipo de usuario 
      userData.userType = userType; // Agregar el tipo de usuario a los datos del usuario
      dispatch(saveUserData(userData)); // Guardar los datos del usuario en el estado global
      localStorage.setItem('userType', userType);
      saveToLocalStorage(userData); // Guardar los datos del usuario en localStorage
      closeModal();
      // Redirigir a la página correspondiente según el tipo de usuario
      setTimeout(() => {
        if (userType === 'Administrador') {
          navigate(`/home-administrador`);
        } else if (userType === 'Inquilino') {
          navigate(`/home-inquilino`);
        }
      }, 100);
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error); // En caso de error, mostrar un mensaje 
      if (error.response && error.response.status === 401) {
        throw new Error('Credenciales inválidas. Por favor, inténtalo de nuevo.');
      }
      throw new Error('Se produjo un error inesperado. Por favor, inténtalo de nuevo más tarde.');
    }
  };
};

// Acción asincrónica para obtener los datos del usuario por su RUT desde el servidor
export const getUserByRut = () => {
  return async (dispatch) => {
    try {
      const token = sessionStorage.getItem('miToken'); // Verificar si hay un token en sessionStorage

      if (!token) {
        return;
      }
      const rut = localStorage.getItem('rut');
      if (rut) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Incluir el token en la cabecera de la solicitud
          },
        };
        const response = await axios.get(`http://localhost:5000/get_persona_by_rut/${rut}`, config);
        if (response.status === 200) {
          const userData = response.data;
          const userType = userData.id_perfil === 1 ? 'Administrador' : 'Inquilino';
          userData.userType = userType;
          return new Promise((resolve) => {
            // Utilizar una promesa para esperar a que el estado se actualice antes de resolver
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
        console.log('Correo electrónico actualizado exitosamente');  // Mensaje en caso de éxito
      } else {
        console.error('Error al actualizar el correo electrónico:', response.data.error); //Mensaje en caso de error
      }
    } catch (error) {
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
          resolve(response.data); // Resolver la Promesa con los datos
        } else {
          console.error('Error en la respuesta del servidor:', response);
          reject({ error: `Error: ${response.data.error}` });  // Rechazar la Promesa con el error
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        reject({ error: `Error al obtener usuarios por unidad: ${error.message}` }); // Rechazar la Promesa con el error
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
        console.log('Persona eliminada exitosamente'); // Mensaje de éxito si la persona fue eliminada correctamente
        // Despacha la acción para obtener y guardar los datos actualizados de usuarios
        const updatedUsers = await dispatch(getUsersByUnit(id_unidad));
        dispatch(saveUsersData(updatedUsers));
        return updatedUsers; // Devolvemos los datos actualizados de usuarios después de la eliminación
      } else {
        throw new Error(`Error al eliminar la persona: ${response.data.error}`); //manejo de error
      }
    } catch (error) {
      console.error('Error durante la eliminación de la persona:', error); //Mensaje de error
      return null; // Devolver null si la eliminación falló
    }
  };
};

export const clearUserData = () => {
  // Acción para limpiar los datos del usuario almacenados localmente
  localStorage.removeItem('userType');
  localStorage.removeItem('rut');
  localStorage.removeItem('id_unidad');
  return {
    type: CLEAR_USER_DATA,  // Retornar la acción para indicar la limpieza de los datos del usuario
  };
};

// Acción para cerrar sesión y limpiar los datos del usuario
export const logoutUser = () => {
  return async (dispatch) => {
    try {
      sessionStorage.removeItem('miToken'); // Limpiar el token en sessionStorage
      sessionStorage.removeItem('tokenExpiration'); // Limpiar el token en sessionStorage
      dispatch(clearUserData()); // Limpiar los datos del usuario en el estado global
      dispatch(clearEntireState()); // Limpiar los datos del usuario en el estado global
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
};

// Función para obtener la marca de tiempo de expiración del token JWT
function getJwtExpirationTimestamp(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); //Extraer la marca de tpo del objeto json
    console.log('Payload:', payload); //console.log para el payload retornado por el servidor

    const expirationTimestamp = payload.exp * 1000; // Convertir la marca de tpo a milisegundos
    const expirationDate = new Date(expirationTimestamp);

    console.log('Expiration Date:', expirationDate.toLocaleString()); // Imprimir la fecha en formato legible
    return expirationTimestamp; //devuelve la marca de tpo en caso de exito
  } catch (error) {
    //manejo de errores
    console.error('Error al analizar el token JWT:', error);
    return null;
  }
}

// Acción para actualizar la contraseña
export const updatePassword = (formData) => {
  return async () => {
    try {
      const rut = localStorage.getItem('rut'); // Obtener el rut desde el localStorage
      if (!rut) {
        console.error('Error: Rut no encontrado en el localStorage');//si no se encuentra el rut, imprimir el error
        return;
      }
      const url = `http://localhost:5000/contrasena/${rut}`; //construir la url antes de la solicitud para poder revisarla
      console.log('URL de la solicitud:', url); // Mostrar la URL antes de la solicitud con motivos de depuracion
      const convertedFormData = {
        contrasena: formData.nuevaContrasena,// Realizar la conversión de la clave
      };
      const response = await axios.put(url, convertedFormData); //solicitud a la api para cambiar la contraseña en la BD
      console.log('Contraseña actualizada:', response.data); //console.log con la respuesta
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error); //si hay un error, se imprime por consola
    }
  };
};






















