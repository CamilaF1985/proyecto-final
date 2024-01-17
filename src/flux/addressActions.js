import axios from 'axios';

// Tipo de acción para guardar las comunas en el estado global
export const SAVE_COMUNAS_DATA = 'SAVE_COMUNAS_DATA';

// Acción para guardar las comunas en el estado global
export const saveComunasData = (comunasData) => ({
  type: SAVE_COMUNAS_DATA,
  payload: comunasData,
});

// Acción para obtener las comunas por ID de región
export const fetchComunasByRegionId = (regionId) => {
  return async (dispatch) => {
    try {
      // Espera solicitud de la promesa antes de asignar el valor
      const resolvedRegionId = await regionId;
      // Asigna el valor del ID de región a la solicitud get
      const response = await axios.get(`http://localhost:5000/comuna/get_comunas_by_region/${resolvedRegionId}`);

      // Guarda los datos de las comunas en el estado global usando la acción saveComunasData
      dispatch(saveComunasData(response.data.comunas));

      return response.data.comunas;
    } catch (error) {
      console.error('Error al obtener las comunas:', error);
      throw error; // Propaga el error para que pueda ser manejado en userActions.js
    }
  };
};

