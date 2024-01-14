// userActions.js
import axios from 'axios';

// Tipos de acciones
export const SET_USER_TYPE = 'SET_USER_TYPE';
export const CLEAR_USER_DATA = 'CLEAR_USER_DATA';
export const SAVE_USER_DATA = 'SAVE_USER_DATA';

// Acción para guardar los datos de una unidad en la base de datos
export const saveUnitData = (unitData) => {
  return async () => {
    try {
      // Realizar la solicitud POST al endpoint correspondiente
      const response = await axios.post('http://localhost:5000/create_unidad', unitData);

      if (response.status === 201) {
        // Si la solicitud es exitosa, devolver el ID de la unidad creada directamente
        return response.data.id;
      } else {
        // Manejar otros casos de respuesta si es necesario
        console.error('Error al guardar la unidad:', response.data);
        return null;
      }
    } catch (error) {
      // Manejar errores aquí, puedes despachar otra acción de error si es necesario
      console.error('Error al guardar la unidad:', error);
      return null;
    }
  };
};

// Acción para guardar los datos del usuario en el estado global
export const saveUserData = (userData) => {
  return async (dispatch) => {
    try {
      // Realiza una solicitud GET para obtener el ID de la unidad por su ID
      const unitId = await dispatch(saveUnitData(userData)); // Cambiado de unitData a userData

      // Verifica si unitId es un número antes de continuar
      if (typeof unitId === 'number') {
        const unitResponse = await axios.get(`http://localhost:5000/unidad/${unitId}`);

        console.log("Respuesta del servidor:", unitResponse);

        // Verifica si se obtuvo el ID de la unidad correctamente
        if (unitResponse.status === 200) {
          // Ahora, agrega el ID de la unidad al objeto userData (esto puede no ser necesario si ya tienes el ID)
          userData.id_unidad = unitId;

          // Realiza la solicitud POST al endpoint para crear el administrador
          const response = await axios.post('http://localhost:5000/create_persona_admin', userData);

          console.log(response);
          // Si la solicitud es exitosa, puedes despachar otra acción si es necesario
          // Por ejemplo, podrías despachar una acción para actualizar el estado de los usuarios en tu aplicación

          // Puedes realizar otras acciones aquí, si es necesario
        } else {
          console.error('Error al obtener el ID de la unidad:', unitId);
        }
      }
    } catch (error) {
      // Manejar errores aquí, puedes despachar otra acción de error si es necesario
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

// Acción para limpiar los datos del usuario almacenados localmente
export const clearUserData = () => {
  localStorage.removeItem('userType');
  localStorage.removeItem('rut');

  return {
    type: CLEAR_USER_DATA,
  };
};






