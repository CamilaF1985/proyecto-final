import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllRegiones, fetchComunasByRegionId, fetchDireccionByUnidad } from '../flux/addressActions';
import logo from '../assets/img/logo.png';
import Swal from 'sweetalert2';

const EditarDireccion = () => {
    const dispatch = useDispatch();
    const regiones = useSelector((state) => state.regiones);
    const comunas = useSelector((state) => state.comunas);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        idRegion: '',
        idComuna: '',
        calle: '',
        numero: '',
        deptoCasa: '',
    });

    const [regionDeComuna, setRegionDeComuna] = useState('');

    useEffect(() => {
        dispatch(fetchDireccionByUnidad())
            .then((direccionData) => {
                // Si hay una región preseleccionada, primero cargamos todas las regiones
                if (direccionData && direccionData.id_region) {
                    dispatch(fetchAllRegiones());
                }

                // Luego, si hay datos de dirección, los cargamos y las comunas de la región preseleccionada
                if (direccionData) {
                    setFormData({
                        idRegion: direccionData.id_region,
                        idComuna: direccionData.id_comuna,
                        calle: direccionData.calle,
                        numero: direccionData.numero,
                        deptoCasa: direccionData.depto_casa,
                    });

                    setRegionDeComuna(direccionData.id_region);

                    if (direccionData.id_region) {
                        dispatch(fetchComunasByRegionId(direccionData.id_region));
                    }
                }
            })
            .catch((error) => {
                console.error('Error al obtener la dirección:', error);
            });
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegionChange = (e) => {
        const selectedRegionId = e.target.value;
        setFormData({
            ...formData,
            idRegion: selectedRegionId,
            idComuna: '',
        });

        dispatch(fetchComunasByRegionId(selectedRegionId));
    };

    const handleComunaChange = (e) => {
        const selectedComunaId = e.target.value;
        setFormData({
            ...formData,
            idComuna: selectedComunaId,
        });

        const region = comunas.find((comuna) => comuna.id === selectedComunaId)?.id_region;
        setRegionDeComuna(region);

        dispatch(fetchComunasByRegionId(region));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Lógica para la edición...

            Swal.fire({
                icon: 'success',
                title: '¡Actualización Exitosa!',
                text: 'La dirección ha sido actualizada correctamente.',
            });
        } catch (error) {
            console.error('Error al actualizar la dirección:', error);

            Swal.fire({
                icon: 'error',
                title: '¡Ocurrió un error!',
                text: 'No se pudo actualizar la dirección. Por favor, inténtelo de nuevo.',
            });
        }
    };

    const handleRegresarClick = () => {
        // Navegar a la ruta /administrar-panel
        navigate('/administrar-panel');
    };

    return (
        <div className="contenedor mt-4 mb-1 p-3 formulario-registro">
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
                            value={formData.idRegion}
                            onChange={handleRegionChange}
                            required
                        >
                            <option value="" disabled>
                                Selecciona una región
                            </option>
                            {regionDeComuna && (
                                <option key={regionDeComuna} value={regionDeComuna}>
                                    {regiones.find((region) => region.id === regionDeComuna)?.nombre}
                                </option>
                            )}
                            {regiones
                                .filter((region) => region.id !== regionDeComuna)
                                .map((region) => (
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
                        <input type="text" className="form-control" id="calle" name="calle" value={formData.calle} onChange={handleChange} placeholder="Ingresa la calle" required />
                        <div className="invalid-feedback">Por favor, ingresa la calle.</div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <label htmlFor="numero" className="form-label">
                            Número:
                        </label>
                        <input type="text" className="form-control" id="numero" name="numero" value={formData.numero} onChange={handleChange} placeholder="Ingresa el número" required />
                        <div className="invalid-feedback">Por favor, ingresa el número.</div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <label htmlFor="deptoCasa" className="form-label">
                            Depto/Casa:
                        </label>
                        <input type="text" className="form-control" id="deptoCasa" name="deptoCasa" value={formData.deptoCasa} onChange={handleChange} placeholder="Ingresa el departamento/casa" required />
                        <div className="invalid-feedback"> Por favor, ingresa el departamento/casa. </div>
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
