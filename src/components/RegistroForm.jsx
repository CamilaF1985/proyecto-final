import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveNewUserData } from '../flux/userActions';
import { saveNewUnitData } from '../flux/unitActions';
import logo from '../assets/img/logo.png';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllRegiones,
  fetchComunasByRegionId,
  createDireccionDB,
} from '../flux/addressActions';
import Swal from 'sweetalert2';
import '../assets/css/App.css';
import { validarRegistro } from '../assets/js/validarRegistro';//importar el js de validaciones

const RegistroForm = () => {
  // Hooks y selectores
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const regiones = useSelector((state) => state.regiones);
  const comunas = useSelector((state) => state.comunas);

  useEffect(() => {
    // Cargar las regiones al montar el componente
    dispatch(fetchAllRegiones());
  }, [dispatch]);

  // Declarar el estado del formulario, inicializarr las variables en null
  const [formData, setFormData] = useState({
    rut: '',
    email: '',
    nombre: '',
    contrasena: '',
    nombreUnidad: '',
    idRegion: '',
    idComuna: '',
    calle: '',
    numero: '',
    correoElectronico: '',
    deptoCasa: '',
  });

  const [formErrors, setFormErrors] = useState({
    rut: '',
    contrasena: '',
    email: '',
    nombre: '',
    nombreUnidad: '',
    calle: '',
    numero: '',
    deptoCasa: '',
  });

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
      case 'rut':
        return 'Por favor, ingresa un RUT válido.';
      case 'contrasena':
        return 'Mínimo 8 caracteres, al menos una letra, un número y un carácter especial.';
      case 'email':
        return 'Por favor, ingresa un correo electrónico válido.';
      case 'nombre':
        return 'Minimo 4 caracteres, máximo 15.';
      case 'nombreUnidad':
        return 'Minimo 4 caracteres, máximo 15.';
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
    // Manejo de cambios al seleccionar una región
    const selectedRegionId = e.target.value;
    setFormData({
      ...formData,
      idRegion: selectedRegionId,
      idComuna: '',
    });

    // Cargar las comunas para la región seleccionada
    dispatch(fetchComunasByRegionId(selectedRegionId));
  };

  const handleComunaChange = (e) => {
    // Carga las comunas para la región seleccionada
    const selectedComunaId = e.target.value;
    setFormData({
      ...formData,
      idComuna: selectedComunaId,
    });
  };

  // No enviar el formulario hasta que este completo
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Guardar los datos de la unidad en el estado global
      const unitData = {
        nombre: formData.nombreUnidad,
      };

      // Llamar a la acción y trabajar con la promesa resultante usando then y catch
      dispatch(saveNewUnitData(unitData))
        .then((unitId) => {
          if (unitId) {
            // Guardar la dirección en la base de datos
            const direccionData = {
              id_pais: '1',
              id_region: formData.idRegion,
              id_comuna: formData.idComuna,
              calle: formData.calle,
              numero: formData.numero,
              depto_casa: formData.deptoCasa,
              id_unidad: unitId,
            };

            dispatch(createDireccionDB(direccionData))
              .then(() => {
                // Si la creación de la unidad y dirección es exitosa, proceder a guardar el usuario
                const userData = {
                  rut: formData.rut,
                  email: formData.email,
                  nombre: formData.nombre,
                  contrasena: formData.contrasena,
                  id_unidad: unitId,
                };

                dispatch(saveNewUserData(userData))
                  .then(() => {
                    // Redirigir a la página principal después de completar el proceso de registro
                    navigate('/');

                    // Mostrar mensaje de registro exitoso
                    Swal.fire({
                      icon: 'success',
                      title: '¡Registro Exitoso!',
                      text: 'Bienvenido.',
                    });
                  })
                  .catch((error) => {
                    console.error('Error al guardar el usuario:', error);
                    // Mostrar mensaje de error en el registro
                    Swal.fire({
                      icon: 'error',
                      title: '¡Ocurrió un error en el registro!',
                      text: 'Por favor revise los campos.',
                    });
                  });
              })
              .catch((error) => {
                console.error('Error al guardar la dirección:', error);
              });
          } else {
            console.error('Error al guardar la unidad:', unitId);
          }
        })
        .catch((error) => {
          console.error('Error al guardar la unidad:', error);
        });
    } catch (error) {
      console.error('Error general:', error);
    }
  };

  const handleRegresarClick = () => {
    // Navegar a la ruta /
    navigate('/');
  };

  return (
    <div className="contenedor mt-4 mb-1 p-3 formulario-registro">
      <div className="row">
        <div className="col-10 text-center">
          <img src={logo} alt="Logo" className="contenedor-logo img-fluid img-logo mb-2" />
        </div>
        <div className="row col-12 justify-content-center">
          <div className="row">
            <div className="col-md-12 mb-3">
              <h2 className="form-titulo-registro">Registro</h2>
            </div>
            <div className="form-container-contacto">
              <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                <div className="col-md-3 mb-3">
                  <label htmlFor="rut" className="form-label">
                    RUT:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.rut ? 'is-invalid' : ''}`}
                    id="rut"
                    name="rut"
                    value={formData.rut}
                    onChange={handleChange}
                    placeholder="Ingresa tu RUT"
                    required
                  />
                  {formErrors.rut && <div className="invalid-feedback">{formErrors.rut}</div>}
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="nombreUnidad" className="form-label">
                    Nombre de la Unidad:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.nombreUnidad ? 'is-invalid' : ''}`}
                    id="nombreUnidad"
                    name="nombreUnidad"
                    value={formData.nombreUnidad}
                    onChange={handleChange}
                    placeholder="Ingresa el nombre de la Unidad"
                    required
                  />
                  {formErrors.nombreUnidad && (
                    <div className="invalid-feedback">{formErrors.nombreUnidad}</div>
                  )}
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="idRegion" className="form-label">
                    Región:
                  </label>
                  <select
                    className={`form-select ${formErrors.idRegion ? 'is-invalid' : ''}`}
                    id="idRegion"
                    name="idRegion"
                    value={formData.idRegion}
                    onChange={handleRegionChange}
                    required
                  >
                    <option value="" disabled>
                      Selecciona una región
                    </option>
                    {regiones &&
                      regiones.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.nombre}
                        </option>
                      ))}
                  </select>
                  {formErrors.idRegion && (
                    <div className="invalid-feedback">{formErrors.idRegion}</div>
                  )}
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="idComuna" className="form-label">
                    Comuna:
                  </label>
                  <select
                    className={`form-select ${formErrors.idComuna ? 'is-invalid' : ''}`}
                    id="idComuna"
                    name="idComuna"
                    value={formData.idComuna}
                    onChange={handleComunaChange}
                    required
                  >
                    <option value="" disabled>
                      Selecciona una comuna
                    </option>
                    {comunas &&
                      comunas.map((comuna) => (
                        <option key={comuna.id} value={comuna.id}>
                          {comuna.nombre}
                        </option>
                      ))}
                  </select>
                  {formErrors.idComuna && (
                    <div className="invalid-feedback">{formErrors.idComuna}</div>
                  )}
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="calle" className="form-label">
                    Calle:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.calle ? 'is-invalid' : ''}`}
                    id="calle"
                    name="calle"
                    value={formData.calle}
                    onChange={handleChange}
                    placeholder="Ingresa la calle"
                    required
                  />
                  {formErrors.calle && <div className="invalid-feedback">{formErrors.calle}</div>}
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="numero" className="form-label">
                    Número:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.numero ? 'is-invalid' : ''}`}
                    id="numero"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    placeholder="Ingresa el número"
                    required
                  />
                  {formErrors.numero && <div className="invalid-feedback">{formErrors.numero}</div>}
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="deptoCasa" className="form-label">
                    Depto/Casa:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.deptoCasa ? 'is-invalid' : ''}`}
                    id="deptoCasa"
                    name="deptoCasa"
                    value={formData.deptoCasa}
                    onChange={handleChange}
                    placeholder="Ingresa el departamento/casa"
                    required
                  />
                  {formErrors.deptoCasa && (
                    <div className="invalid-feedback">{formErrors.deptoCasa}</div>
                  )}
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico:
                  </label>
                  <input
                    type="email"
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ingresa tu correo electrónico"
                    required
                  />
                  {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.nombre ? 'is-invalid' : ''}`}
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre"
                    required
                  />
                  {formErrors.nombre && <div className="invalid-feedback">{formErrors.nombre}</div>}
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="contrasena" className="form-label">
                    Contraseña:
                  </label>
                  <input
                    type="password"
                    className={`form-control ${formErrors.contrasena ? 'is-invalid' : ''}`}
                    id="contrasena"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                  {formErrors.contrasena && (
                    <div className="invalid-feedback">{formErrors.contrasena}</div>
                  )}
                </div>
                <div className="col-md-12 mt-2">
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleRegresarClick}
                    >
                      Regresar
                    </button>
                    <button className="btn btn-primary" type="submit">
                      Registrarse
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroForm;








