import axios from 'axios';

// Tipos de acciones
export const SAVE_UNIT_DATA = 'SAVE_UNIT_DATA';
export const FETCH_UNIT_BY_ID = 'FETCH_UNIT_BY_ID';
export const SAVE_NEW_UNIT_DATA = 'SAVE_NEW_UNIT_DATA';

// Acción para guardar datos de unidad en el estado global
export const saveUnitData = (unitData) => ({
  type: SAVE_UNIT_DATA,
  payload: unitData,
});

// Acción para buscar la unidad por su Id en la base de datos
export const fetchUnitById = (unitId) => {
  return async (dispatch) => {  
    try {
      // Esperar solicitud de la promesa antes de asignar el valor
      const resolvedUnitId = await unitId;
      // Asignar el valor del id de la unidad a la solicitud get
      const response = await axios.get(`http://localhost:5000/unidad/${resolvedUnitId}`);

      // Guardar los datos de la unidad en el estado global usando la acción saveUnitData
      dispatch(saveUnitData(response.data));

      return response.data;
    } catch (error) {
      console.error('Error al obtener la unidad:', error);
      throw error; 
    }
  };
};

// Acción para guardar los datos de una nueva unidad en la base de datos
export const saveNewUnitData = (unitData) => {
  return async () => {
    try {
      // Realizar la solicitud POST al endpoint correspondiente
      const response = await axios.post('http://localhost:5000/create_unidad', unitData);

      if (response.status === 201) {
        // Si la solicitud es exitosa, devolver el ID de la unidad creada directamente
        return response.data.id;
      } else {
        // Manejar otros casos de respuesta 
        console.error('Error al guardar la unidad:', response.data);
        return null;
      }
    } catch (error) {
      // Manejo de errores
      console.error('Error al guardar la unidad:', error);
      return null;
    }
  };
};
