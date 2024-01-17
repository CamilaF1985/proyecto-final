import axios from 'axios';

// Tipos de acciones
export const CREATE_DIRECCION = 'CREATE_DIRECCION';
export const SAVE_COMUNAS_DATA = 'SAVE_COMUNAS_DATA';
export const SAVE_REGIONES_DATA = 'SAVE_REGIONES_DATA';

// Acción para guardar las comunas en el estado global
export const saveComunasData = (comunasData) => ({
    type: SAVE_COMUNAS_DATA,
    payload: comunasData,
});

// Acción para guardar las regiones en el estado global
export const saveRegionesData = (regionesData) => ({
    type: SAVE_REGIONES_DATA,
    payload: regionesData,
});

// Acción para obtener todas las regiones
export const fetchAllRegiones = () => {
    return async (dispatch) => {
        try {
            // Realiza la solicitud GET para obtener todas las regiones
            const response = await axios.get('http://localhost:5000/get_all_region_bp');

            // Guarda los datos de las regiones en el estado global usando la acción saveRegionesData
            dispatch(saveRegionesData(response.data.regiones));

            return response.data.regiones;
        } catch (error) {
            console.error('Error al obtener todas las regiones:', error);
            throw error; // Propaga el error para que pueda ser manejado en otro lugar si es necesario
        }
    };
};

// Acción para obtener las comunas por ID de región
export const fetchComunasByRegionId = (regionId) => {
    return async (dispatch) => {
        try {
            // Espera solicitud de la promesa antes de asignar el valor
            const resolvedRegionId = await regionId;
            // Asigna el valor del ID de región a la solicitud get
            const response = await axios.get(`http://localhost:5000/get_comunas_by_region/${resolvedRegionId}`);

            // Guarda los datos de las comunas en el estado global usando la acción saveComunasData
            dispatch(saveComunasData(response.data.comunas));

            return response.data.comunas;
        } catch (error) {
            console.error('Error al obtener las comunas:', error);
            throw error; // Propaga el error para que pueda ser manejado en userActions.js
        }
    };
};

// Acción para crear una nueva dirección en la base de datos
export const createDireccionDB = (direccionData) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('http://localhost:5000/create_direccion', direccionData);

            // Despacha la acción que guarda la dirección en el estado global
            dispatch(createDireccion(response.data));

            // Puedes manejar la respuesta en tu componente si es necesario
            return response.data;
        } catch (error) {
            console.error('Error al crear la dirección:', error);
            throw error;
        }
    };
};

// Acción para guardar la dirección en el estado global
export const createDireccion = (direccionData) => ({
    type: CREATE_DIRECCION,
    payload: direccionData,
});



