import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveNewUserData } from '../flux/userActions';
import { saveNewUnitData } from '../flux/unitActions';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllRegiones,
  fetchComunasByRegionId,
  createDireccionDB,
} from '../flux/addressActions';
import '../assets/css/App.css';

const RegistroForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Añade useNavigate
  const regiones = useSelector((state) => state.regiones);
  const comunas = useSelector((state) => state.comunas);

  useEffect(() => {
    // Cargar las regiones al montar el componente
    dispatch(fetchAllRegiones());
  }, [dispatch]);

  console.log('Regiones:', regiones); // Agrega este log

  const [formData, setFormData] = useState({
    rut: '',
    email: '',
    nombre: '',
    contrasena: '',
    nombreUnidad: '',
    idRegion: '', // Nuevo campo para el ID de la región
    idComuna: '', // Nuevo campo para el ID de la comuna
    calle: '', // Nuevo campo para la calle
    numero: '', // Nuevo campo para el número
    deptoCasa: '', // Nuevo campo para el departamento/casa
  });

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
      idComuna: '', // Reiniciar la comuna cuando cambie la región
    });

    // Agrega el log aquí
    console.log('ID de Región:', selectedRegionId);
    // Cargar las comunas para la región seleccionada
    dispatch(fetchComunasByRegionId(selectedRegionId));
  };

  const handleComunaChange = (e) => {
    const selectedComunaId = e.target.value;
    setFormData({
      ...formData,
      idComuna: selectedComunaId,
    });

    // Agrega el log aquí
    console.log('ID de Comuna:', selectedComunaId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      // Guardar los datos de la unidad en el estado global
      const unitData = {
        nombre: formData.nombreUnidad,
      };

      // Manejar la promesa directamente usando then
      dispatch(saveNewUnitData(unitData)).then((unitId) => {
        if (unitId) {
          // Resto del código...

          if (unitId) {
            // Guardar la dirección en la base de datos
            const direccionData = {
              id_pais: '1', // Ejemplo: asignar el ID del país según tu lógica
              id_region: formData.idRegion,
              id_comuna: formData.idComuna,
              calle: formData.calle,
              numero: formData.numero,
              depto_casa: formData.deptoCasa,
              id_unidad: unitId,
            };

            console.log('Datos de la dirección:', direccionData); // Agrega este log

            dispatch(createDireccionDB(direccionData));

            // Si la creación de la unidad y dirección es exitosa, proceder a guardar el usuario
            const userData = {
              rut: formData.rut,
              email: formData.email,
              nombre: formData.nombre,
              contrasena: formData.contrasena,
              id_unidad: unitId,
            };

            dispatch(saveNewUserData(userData));

            // Redirigir a la página principal después de completar el proceso de registro
            navigate('/');

          } else {
            console.error('Error al guardar la unidad:', unitId);
          }
        }
      });
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  return (

    <div className="form-container">
      <h2 className="form-titulo">Registro</h2>
      <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
        <div className="col-md-12 mb-3">
          <label htmlFor="rut" className="form-label">
            RUT:
          </label>
          <input
            type="text"
            className="form-control"
            id="rut"
            name="rut"
            value={formData.rut}
            onChange={handleChange}
            placeholder="Ingresa tu RUT"
            required
          />
          <div className="invalid-feedback">Por favor, ingresa tu RUT.</div>
        </div>

        <div className="col-md-12 mb-3">
          <label htmlFor="nombreUnidad" className="form-label">
            Nombre de la Unidad:
          </label>
          <input
            type="text"
            className="form-control"
            id="nombreUnidad"
            name="nombreUnidad"
            value={formData.nombreUnidad}
            onChange={handleChange}
            placeholder="Ingresa el nombre de la Unidad"
            required
          />
          <div className="invalid-feedback">
            Por favor, ingresa el nombre de la Unidad.
          </div>
        </div>
        <div className="col-md-12 mb-3">
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
            {regiones && regiones.map((region) => (
              <option key={region.id} value={region.id}>
                {region.nombre}
              </option>
            ))}

          </select>
          <div className="invalid-feedback">Por favor, selecciona una región.</div>
        </div>

        <div className="col-md-12 mb-3">
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
            {comunas && comunas.map((comuna) => (
              <option key={comuna.id} value={comuna.id}>
                {comuna.nombre}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">Por favor, selecciona una comuna.</div>
        </div>

        <div className="col-md-12 mb-3">
          <label htmlFor="calle" className="form-label">
            Calle:
          </label>
          <input
            type="text"
            className="form-control"
            id="calle"
            name="calle"
            value={formData.calle}
            onChange={handleChange}
            placeholder="Ingresa la calle"
            required
          />
          <div className="invalid-feedback">Por favor, ingresa la calle.</div>
        </div>

        <div className="col-md-12 mb-3">
          <label htmlFor="numero" className="form-label">
            Número:
          </label>
          <input
            type="text"
            className="form-control"
            id="numero"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            placeholder="Ingresa el número"
            required
          />
          <div className="invalid-feedback">Por favor, ingresa el número.</div>
        </div>

        <div className="col-md-12 mb-3">
          <label htmlFor="deptoCasa" className="form-label">
            Depto/Casa:
          </label>
          <input
            type="text"
            className="form-control"
            id="deptoCasa"
            name="deptoCasa"
            value={formData.deptoCasa}
            onChange={handleChange}
            placeholder="Ingresa el departamento/casa"
            required
          />
          <div className="invalid-feedback">
            Por favor, ingresa el departamento/casa.
          </div>
        </div>

        <div className="col-md-12 mb-3">
          <label htmlFor="email" className="form-label">
            Correo Electrónico:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingresa tu correo electrónico"
            required
          />
          <div className="invalid-feedback">
            Por favor, ingresa un correo electrónico válido.
          </div>
        </div>

        <div className="col-md-12 mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre:
          </label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
            required
          />
          <div className="invalid-feedback">Por favor, ingresa tu nombre.</div>
        </div>

        <div className="col-md-12 mb-3">
          <label htmlFor="contrasena" className="form-label">
            Contraseña:
          </label>
          <input
            type="password"
            className="form-control"
            id="contrasena"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            required
          />
          <div className="invalid-feedback">Por favor, ingresa tu contraseña.</div>
        </div>

        <div className="col-md-12 d-flex justify-content-end">
          <button className="btn btn-primary" type="submit">
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroForm;







