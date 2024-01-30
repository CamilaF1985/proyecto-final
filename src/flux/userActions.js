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
          // Realizar la solicitud POST al endpoint para crear el inquilino
          const response = await axios.post('http://localhost:5000/create_persona_inquilino', userData);
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

// Acción para iniciar sesión
export const loginUser = (formData, closeModal, navigate) => {
  return async (dispatch) => {
    try {
      //Verifica si ya hay un token en sessionStorage antes de proceder
      const existingToken = sessionStorage.getItem('miToken');
      if (existingToken) {
        const userType = localStorage.getItem('userType');
        if (userType === 'Administrador') {
          navigate(`/home-administrador`);
        } else if (userType === 'Inquilino') {
          navigate(`/home-inquilino`);
        }
        return;
      }

      //Solicitud post a la api para iniciar sesión
      const response = await axios.post('http://localhost:5000/auth/login', {
        rut: formData.rut,
        contrasena: formData.password,
      });

      const { data: userData } = response; // Desestructuración para obtener userData

      const { token: miToken, id_perfil } = userData; // Desestructuración para obtener miToken e id_perfil

      const expirationTimestamp = getJwtExpirationTimestamp(miToken); //Obtiene la marca de expiración del token
      userData.tokenExpiration = expirationTimestamp; 

      //Añade el token y su marca de expiración al sessionStorage
      sessionStorage.setItem('tokenExpiration', expirationTimestamp);
      sessionStorage.setItem('miToken', miToken);

      //Determina el tipo de Usuario a partir de su id_perfil
      const userType = id_perfil === 1 ? 'Administrador' : 'Inquilino';
      userData.userType = userType;

      dispatch(saveUserData(userData));
      localStorage.setItem('userType', userType);
      saveToLocalStorage(userData);

      closeModal();

      setTimeout(() => {
        //Redirige al usuario a la vista correcta según el tipo de perfil
        if (userType === 'Administrador') {
          navigate(`/home-administrador`);
        } else if (userType === 'Inquilino') {
          navigate(`/home-inquilino`);
        }
      }, 100);

    } catch (error) {
      if (error.response && error.response.status === 401) {
        //Propagación de errores posibles al componente
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
          reject({ error: `Error: ${response.data.error}` });  // Rechazar la Promesa con el error
        }

      } catch (error) {
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

    const expirationTimestamp = payload.exp * 1000; // Convertir la marca de tpo a milisegundos

    return expirationTimestamp; //devuelve la marca de tpo en caso de exito

  } catch (error) {
    return null; //Si hay un error devuelve nulo
  }
}

// Acción para actualizar la contraseña
export const updatePassword = (formData) => {
  return async () => {
    try {
      const rut = localStorage.getItem('rut'); // Obtiene el rut desde el localStorage
      if (!rut) {
        // Si no lo encuentra arroja un error
        console.error('Error: Rut no encontrado en el localStorage');
        return;
      }

      //Convierte las claves antes de enviar la solicitud
      const convertedFormData = {
        contrasena: formData.nuevaContrasena,
      };

      //Solicitud put a la api para actualizar la contraseña
      await axios.put(`http://localhost:5000/contrasena/${rut}`, convertedFormData);

    } catch (error) {
      // Mensaje en caso de error en la actualización
      console.error('Error al actualizar la contraseña:', error);
    }
  };
};
























