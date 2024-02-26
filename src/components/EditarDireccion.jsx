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
                                return updatedComunas;
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
        const isValid = validarRegistro[name](value);

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
                    return updatedComunas;
                })
                .catch((error) => {
                    console.error('Error al obtener las comunas:', error);
                });
        }
    };

    const handleComunaChange = (e) => {
        // Manejar cambios para el select de comunas
        const selectedComunaId = e.target.value;

        setFormData({
            ...formData,
            idComuna: selectedComunaId,
        });

        setSelectedComunaId(selectedComunaId); // Actualizar el estado de la comuna seleccionada

        if (selectedRegionId) {
            // renderiza las comunas según la región seleccionada
            dispatch(fetchComunasByRegionId(selectedRegionId))
                .then((updatedComunas) => {
                    return updatedComunas;
                })
                .catch((error) => {
                    console.error('Error al obtener las comunas:', error);
                });
        }
    };

    const transformarNombresClaves = (datos) => {
        const mapeoNombres = {
            idUnidad: 'id_unidad',
            idComuna: 'id_comuna',
            idRegion: 'id_region',
            deptoCasa: 'depto_casa',
        };

        const datosTransformados = {};

        for (const [clave, valor] of Object.entries(datos)) {
            const nuevaClave = mapeoNombres[clave] || clave;
            datosTransformados[nuevaClave] = valor;
        }

        return datosTransformados;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Incluir Ids necesarios en formdata
        const formDataWithIds = {
            idUnidad: direccionData.id_unidad,
        };

        // Verificar si hay cambios en cada campo
        if (formData.calle !== direccionData.calle) {
            formDataWithIds.calle = formData.calle;
        }

        if (formData.numero !== direccionData.numero) {
            formDataWithIds.numero = formData.numero;
        }

        if (formData.deptoCasa !== direccionData.depto_casa) {
            formDataWithIds.deptoCasa = formData.deptoCasa;
        }

        if (selectedRegionId !== direccionData.id_region) {
            formDataWithIds.idRegion = selectedRegionId;
        }

        if (selectedComunaId !== direccionData.id_comuna) {
            formDataWithIds.idComuna = selectedComunaId;
        }

        // Transformar los nombres de las claves
        const formDataTransformado = transformarNombresClaves(formDataWithIds);

        // Solo enviar la solicitud si hay cambios
        if (Object.keys(formDataWithIds).length > 1) {
            dispatch(updateDireccionDB(direccionData.id, formDataTransformado))
                .then((direccionActualizada) => {
                    // Mostrar mensaje de actualización exitosa
                    Swal.fire({
                        icon: 'success',
                        title: '¡Actualización Exitosa!',
                        text: 'La dirección ha sido actualizada correctamente.',
                    });
                    return direccionActualizada;
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
        }
    };

    const handleRegresarClick = () => {
        // Navegar a la ruta /administrar-panel
        navigate('/administrar-panel');
    };

    return (
            <div className="contenedor mt-4 mb-1 p-3 formulario-registro editar-direccion">
                {/* Componente CronometroSesion */}
                <CronometroSesion />
                <div className="row">
                    <div className="col-12 ms-5 text-center">
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
                                <strong>Región:</strong>
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
                                <strong>Comuna:</strong>
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
                                <strong>Calle:</strong>
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
                                <strong>Número:</strong>
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
                                <strong>Depto/Casa:</strong>
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
                            <div className="d-flex justify-content-between botones-direccion">
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





