// userActions.js
import axios from 'axios';

// Tipos de acciones
export const SET_USER_TYPE = 'SET_USER_TYPE';
export const CLEAR_USER_DATA = 'CLEAR_USER_DATA';
export const SAVE_USER_DATA = 'SAVE_USER_DATA';

// Función auxiliar para guardar datos del usuario en el almacenamiento local
const saveToLocalStorage = (userData) => {
  localStorage.setItem('userType', userData.userType);
  localStorage.setItem('rut', userData.rut);  
};

// Acción para establecer el tipo de usuario basado en los datos almacenados localmente
export const setUserType = () => {
  const storedUserType = localStorage.getItem('userType');
  const storedRut = localStorage.getItem('rut');

  return {
    type: SET_USER_TYPE,
    payload: { userType: storedUserType, rut: storedRut }, 
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

// Acción para guardar los datos del usuario en el estado global y en el almacenamiento local
export const saveUserData = (userData) => {
  // Llama a la función auxiliar para almacenar en el localStorage
  saveToLocalStorage(userData);

  // Retorna la acción con los datos del usuario
  return {
    type: SAVE_USER_DATA,
    payload: userData,
  };
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

        // Guarda los datos del usuario en el estado global y en el localStorage
        dispatch(saveUserData(userData));

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




