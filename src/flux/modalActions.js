// Tipo de acción para abrir el modal
export const OPEN_MODAL = 'OPEN_MODAL';

// Tipo de acción para cerrar el modal
export const CLOSE_MODAL = 'CLOSE_MODAL';

// Tipo de acción para establecer el estado del modal
export const SET_MODAL_STATE = 'SET_MODAL_STATE';

// Acción para abrir el modal
export const openModal = () => ({
  type: OPEN_MODAL,
});

// Acción para cerrar el modal
export const closeModal = () => ({
  type: CLOSE_MODAL,
});

// Acción para cerrar el modal y redirigir a una ruta específica
export const closeModalAndRedirect = (path, navigate) => {
  return (dispatch) => {
    dispatch(closeModal());
    navigate(path);
  };
};

// Acción para establecer el estado del modal
export const setModalState = (modalIsOpen) => ({
  type: SET_MODAL_STATE,
  payload: modalIsOpen,
});


