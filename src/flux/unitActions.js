// unitActions.js
import axios from 'axios';

// Tipos de acciones para unidades
export const SAVE_UNIT_DATA = 'SAVE_UNIT_DATA';
export const FETCH_UNIT_BY_ID = 'FETCH_UNIT_BY_ID';  // Nuevo tipo de acción

// En unitActions.js
export const fetchUnitById = (unitId) => {
    return async () => {
      try {
        // Espera solicitud de la promesa antes de asignar el valor
        const resolvedUnitId = await unitId;
        // Asigna el valor del id de la unidad a la solicitud get
        const response = await axios.get(`http://localhost:5000/unidad/${resolvedUnitId}`);
        return response.data;
      } catch (error) {
        console.error('Error al obtener la unidad:', error);
        throw error; // Propagar el error para que pueda ser manejado en userActions.js
      }
    };
  };
  
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