import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllRegiones, fetchComunasByRegionId, fetchDireccionByUnidad, updateDireccionDB } from '../flux/addressActions';
import logo from '../assets/img/logo.png';
import Swal from 'sweetalert2';
import { validarRegistro } from '../assets/js/validarRegistro';//importar el js de validaciones
import CronometroSesion from '../components/CronometroSesion.jsx';

const EditarDireccion = () => {
    // Componente funcional para editar la dirección de la unidad
    const dispatch = useDispatch();
    const regiones = useSelector((state) => state.regiones);
    const comunas = useSelector((state) => state.comunas);
    const navigate = useNavigate();
    const [selectedRegionId, setSelectedRegionId] = useState(''); // Estado para la región seleccionada
    const [selectedComunaId, setSelectedComunaId] = useState(''); //Estado para la comuna seleccionada

    const [formData, setFormData] = useState({
        idRegion: '',
        idComuna: '',
        calle: '',
        numero: '',
        deptoCasa: '',
    });

    const [formErrors, setFormErrors] = useState({
        calle: '',
        numero: '',
        deptoCasa: '',
    });

    const [regionDeComuna, setRegionDeComuna] = useState('');
    const [direccionData, setDireccionData] = useState(null);

    useEffect(() => {
        // Buscar la dirección en la bd
        dispatch(fetchDireccionByUnidad())
            .then((direccionData) => {
                setDireccionData(direccionData);

                // Si hay datos de dirección, los cargamos y las comunas de la región preseleccionada
                if (direccionData) {
                    setFormData({
                        idRegion: direccionData.id_region,
                        idComuna: direccionData.id_comuna,
                        calle: direccionData.calle,
                        numero: direccionData.numero,
                        deptoCasa: direccionData.depto_casa,
                    });

                    setRegionDeComuna(direccionData.id_region);

                    if (!regiones.length) {
                        dispatch(fetchAllRegiones());
                    }

                    if (direccionData.id_region) {
                        dispatch(fetchComunasByRegionId(direccionData.id_region))
                            .then((updatedComunas) => {
                                console.log('Comunas actualizadas:', updatedComunas);
                            })
                            .catch((error) => {
                                console.error('Error al obtener las comunas:', error);
                            });
                    }
                }
            })
            .catch((error) => {
                console.error('Error al obtener la dirección:', error);
            });
    }, [dispatch, regiones]);

    // Función para manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validaciones
        console.log(`Validando ${name}: ${value}`);
        const isValid = validarRegistro[name](value);

        console.log('isValid:', isValid);

        setFormErrors({
            ...formErrors,
            [name]: isValid ? '' : getErrorMessage(name),
        });

        // Manejo de cambios en el formulario
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const getErrorMessage = (fieldName) => {
        // Mensajes de error personalizados para cada campo, como es un formulario largo usamos un switch
        switch (fieldName) {
            case 'calle':
                return 'Minimo 4 caracteres, máximo 30';
            case 'numero':
                return 'Máximo 10 caracteres.';
            case 'deptoCasa':
                return 'Máximo 10 caracteres.';
            default:
                return 'Campo inválido.';
        }
    };

    const handleRegionChange = (e) => {
        // Manejar cambios para el select de las regiones
        const selectedRegionId = e.target.value;
        console.log('Selected Region ID:', selectedRegionId);

        setFormData({
            ...formData,
            idRegion: selectedRegionId,
            idComuna: '', // Reiniciar comuna al cambiar la región
        });

        setSelectedRegionId(selectedRegionId); // Actualizar el estado de la región seleccionada

        if (selectedRegionId) {
            dispatch(fetchComunasByRegionId(selectedRegionId))
                // Actualiza el estado de comunas según la región seleccionada
                .then((updatedComunas) => {
                    console.log('Comunas actualizadas:', updatedComunas);
                })
                .catch((error) => {
                    console.error('Error al obtener las comunas:', error);
                });

            if (!direccionData.id_region || selectedRegionId !== '') {
                setRegionDeComuna(selectedRegionId)
            }
        }
    };

    const handleComunaChange = (e) => {
        // Manejar cambios para el select de comunas
        const selectedComunaId = e.target.value;
        console.log('Selected Comuna ID:', selectedComunaId);

        setFormData({
            ...formData,
            idComuna: selectedComunaId,
        });

        setSelectedComunaId(selectedComunaId); // Actualizar el estado de la comuna seleccionada

        if (formData.idRegion) {
            // renderiza las comunas según la región seleccionada
            dispatch(fetchComunasByRegionId(formData.idRegion))
                .then((updatedComunas) => {
                    console.log('Comunas actualizadas:', updatedComunas);
                })
                .catch((error) => {
                    console.error('Error al obtener las comunas:', error);
                });
        }
    };

    const handleSubmit = (e) => {
        // No se enviará si algún campo obligatorio está vacío
        e.preventDefault();
        console.log('Datos que se enviarán a la API:', formData);

        // Incluir Ids necesarios en formdata
        const formDataWithIds = {
            ...formData,
            idUnidad: direccionData.id_unidad,
            idRegion: selectedRegionId, // Utilizar el estado actualizado
            idComuna: selectedComunaId, // Utilizar el estado actualizado
        };

        // Actualizar la dirección en la base de datos
        dispatch(updateDireccionDB(direccionData.id, formDataWithIds))
            .then((direccionActualizada) => {
                // Mostrar mensaje de actualización exitosa
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualización Exitosa!',
                    text: 'La dirección ha sido actualizada correctamente.',
                });

                //Console.log para la direccion actualizada
                console.log('Dirección actualizada:', direccionActualizada);

                // Console.log para la respuesta de la api
                console.log('Respuesta de la API:', direccionActualizada);
            })
            .catch((error) => {
                console.error('Error al actualizar la dirección:', error);

                // Mostrar mensaje de error en la actualización
                Swal.fire({
                    icon: 'error',
                    title: '¡Ocurrió un error!',
                    text: 'No se pudo actualizar la dirección. Por favor, inténtelo de nuevo.',
                });
            });
    };

    const handleRegresarClick = () => {
        // Navegar a la ruta /administrar-panel
        navigate('/administrar-panel');
    };

    return (
        <div className="contenedor mt-4 mb-1 p-3 formulario-registro">
            {/* Componente CronometroSesion */}
            <CronometroSesion />
            <div className="row">
                <div className="col-10 text-center">
                    <img src={logo} alt="Logo" className="contenedor-logo img-fluid img-logo mb-2" />
                </div>
            </div>

            <div className="row col-12 justify-content-center">
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <h2 className="form-titulo-registro">Editar dirección</h2>
                    </div>
                </div>

                <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="col-md-3 mb-3">
                        <label htmlFor="idRegion" className="form-label">
                            Región:
                        </label>
                        <select
                            className="form-select"
                            id="idRegion"
                            name="idRegion"
                            value={selectedRegionId || formData.idRegion}
                            onChange={handleRegionChange}
                            required
                        >
                            {regiones.map((region) => (
                                <option key={region.id} value={region.id}>
                                    {region.nombre}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">Por favor, selecciona una región.</div>
                    </div>

                    <div className="col-md-3 mb-3">
                        <label htmlFor="idComuna" className="form-label">
                            Comuna:
                        </label>
                        <select
                            className="form-select"
                            id="idComuna"
                            name="idComuna"
                            value={formData.idComuna}
                            onChange={handleComunaChange}
                            required
                        >
                            <option value="" disabled>
                                Selecciona una comuna
                            </option>
                            {comunas.map((comuna) => (
                                <option key={comuna.id} value={comuna.id}>
                                    {comuna.nombre}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">Por favor, selecciona una comuna.</div>
                    </div>

                    <div className="col-md-3 mb-3">
                        <label htmlFor="calle" className="form-label">
                            Calle:
                        </label>
                        <input type="text"
                            className={`form-control ${formErrors.calle ? 'is-invalid' : ''}`}
                            id="calle"
                            name="calle"
                            value={formData.calle}
                            onChange={handleChange}
                            placeholder="Ingresa la calle"
                            required />
                        {formErrors.calle && <div className="invalid-feedback">{formErrors.calle}</div>}
                    </div>

                    <div className="col-md-3 mb-3">
                        <label htmlFor="numero" className="form-label">
                            Número:
                        </label>
                        <input type="text"
                            className={`form-control ${formErrors.numero ? 'is-invalid' : ''}`}
                            id="numero"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            placeholder="Ingresa el número"
                            required />
                        {formErrors.numero && <div className="invalid-feedback">{formErrors.numero}</div>}
                    </div>

                    <div className="col-md-3 mb-3">
                        <label htmlFor="deptoCasa" className="form-label">
                            Depto/Casa:
                        </label>
                        <input type="text"
                            className={`form-control ${formErrors.deptoCasa ? 'is-invalid' : ''}`}
                            id="deptoCasa"
                            name="deptoCasa"
                            value={formData.deptoCasa}
                            onChange={handleChange}
                            placeholder="Ingresa el departamento/casa"
                            required />
                        <div className="invalid-feedback">{formErrors.deptoCasa}</div>
                    </div>

                    <div className="col-md-12 mt-2">
                        <div className="d-flex justify-content-between">
                            <button className="btn btn-primary" type="button" onClick={handleRegresarClick}>
                                Regresar
                            </button>
                            <button className="btn btn-primary" type="submit">
                                Actualizar Dirección
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarDireccion;


