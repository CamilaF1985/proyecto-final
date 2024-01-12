// userActions.js

// Tipos de acciones
export const SET_USER_TYPE = 'SET_USER_TYPE';
export const CLEAR_USER_DATA = 'CLEAR_USER_DATA';
export const SAVE_USER_DATA = 'SAVE_USER_DATA';

// Función auxiliar para guardar datos del usuario en el almacenamiento local
const saveToLocalStorage = (userData) => {
  localStorage.setItem('userType', userData.userType);
  localStorage.setItem('username', userData.username);
};

// Acción para establecer el tipo de usuario basado en los datos almacenados localmente
export const setUserType = () => {
  const storedUserType = localStorage.getItem('userType');
  const storedUsername = localStorage.getItem('username');

  return {
    type: SET_USER_TYPE,
    payload: { userType: storedUserType, username: storedUsername },
  };
};

// Acción para limpiar los datos del usuario almacenados localmente
export const clearUserData = () => {
  localStorage.removeItem('userType');
  localStorage.removeItem('username');

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
  return (dispatch, getState) => {
    const user = getState().users.find(
      (u) => u.username === formData.username && u.password === formData.password
    );

    if (user) {
      const userData = {
        userType: user.userType,
        username: user.username,
        rut: user.rut,
        email: user.email,
        unitName: user.unitName,
      };

      dispatch(saveUserData(userData));
      closeModal();

      // Asegúrate de que estás utilizando la propiedad correcta para determinar el tipo de usuario
      if (user.userType === 'Administrador') {
        // Realiza la redirección al área de administrador
        navigate(`/home-administrador`);
      } else if (user.userType === 'Inquilino') {
        // Realiza la redirección al área de inquilino
        navigate(`/home-inquilino`);
      }
    } else {
      alert('Credenciales incorrectas');
      closeModal();
    }
  };
};



