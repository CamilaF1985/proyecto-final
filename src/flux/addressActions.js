import axios from 'axios';

// Tipos de acciones
export const CREATE_DIRECCION = 'CREATE_DIRECCION';
export const SAVE_COMUNAS_DATA = 'SAVE_COMUNAS_DATA';
export const SAVE_REGIONES_DATA = 'SAVE_REGIONES_DATA';
export const UPDATE_DIRECCION = 'UPDATE_DIRECCION'

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
            console.log('Region ID:', regionId); //mensaje para verificar el id de la region
            const response = await axios.get(`http://localhost:5000/get_comunas_by_region/${regionId}`);
            console.log('Comunas Response:', response); //verificar la respuesta del servidor
            dispatch(saveComunasData(response.data.comunas)); //Guarda la data en el estado local
            return response.data.comunas; //retorna la data
        } catch (error) {
            console.error('Error al obtener las comunas:', error); //mensaje en caso de error
            throw error; //Devuelve el error para que pueda ser usado en el componente
        }
    };
};

// Acción para crear una nueva dirección en la base de datos
export const createDireccionDB = (direccionData) => {
    return async (dispatch) => {
        try {
            // Solicitud a la api para crear la dirección
            const response = await axios.post('http://localhost:5000/create_direccion', direccionData);
            dispatch(createDireccion(response.data)); // Guarda la data en el estado local
            return response.data;
        } catch (error) {
            console.error('Error al crear la dirección:', error); //Mensaje en caso de error
            throw error; //Devuelve el error
        }
    };
};

// Acción para obtener una dirección por ID de unidad
export const fetchDireccionByUnidad = () => {
    return async (dispatch, getState) => {
        try {
            const id_unidad = localStorage.getItem('id_unidad');  // Obtener el id de la unidad desde localStorage
            if (!id_unidad) {
                // Arroja error y mensaje correspondiente si no se encontró el id de la unidad
                console.error('No se encontró el id de la unidad en localStorage');
                throw new Error('No se encontró el id de la unidad en localStorage');
            }
            // Realiza la solicitud GET para obtener la dirección por ID de unidad
            const response = await axios.get(`http://localhost:5000/direccion/${id_unidad}`);
            dispatch(updateDireccion(response.data));  // Despacha la acción que actualiza la dirección en el estado global
            console.log('Data obtenida desde la base de datos:', response.data);
            console.log('Estado después de actualizar:', getState());
            return response.data;
        } catch (error) {
            console.error('Error al obtener la dirección:', error);
            throw error; // Propaga el error para que pueda ser manejado en el componente
        }
    };
};

// Acción para actualizar la dirección en la BD
export const updateDireccionDB = (idDireccion, nuevaDireccionData) => async () => {
    try {
        // Ajustar los nombres de las claves antes de realizar la solicitud
        const datosParaEnviar = {
            id_comuna: nuevaDireccionData.idComuna,
            id_region: nuevaDireccionData.idRegion,
            depto_casa: nuevaDireccionData.deptoCasa,
            numero: nuevaDireccionData.numero,
            calle: nuevaDireccionData.calle,
        };
        // Realizar la solicitud PUT a la API para actualizar la dirección
        console.log('Realizando solicitud PUT a la API...');
        console.log('Datos que se enviarán a la API:', datosParaEnviar);
        const response = await axios.put(`http://localhost:5000/direccion/${idDireccion}`, datosParaEnviar);
        // Devolver la dirección actualizada para su uso posterior 
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la dirección en la base de datos:', error);
        throw error; // Propagación del error
    }
};


// Acción para actualizar la dirección en el estado global
export const updateDireccion = (direccionBDData) => ({
    type: UPDATE_DIRECCION,
    payload: direccionBDData,
});

// Acción para guardar la dirección en el estado global
export const createDireccion = (direccionData) => ({
    type: CREATE_DIRECCION,
    payload: direccionData,
});




