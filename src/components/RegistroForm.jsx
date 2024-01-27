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
import { useFormik } from 'formik';
import * as Yup from 'yup';
import format from "../assets/js/format";
import validate from '../assets/js/validate';

const RegistroForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const regiones = useSelector((state) => state.regiones);
  const comunas = useSelector((state) => state.comunas);

  const handleRegresarClick = () => {
    // Navegar a la ruta /
    navigate('/');
  };

  useEffect(() => {
    dispatch(fetchAllRegiones());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      rut: '',
      nombreUnidad: '',
      idRegion: '',
      idComuna: '',
      calle: '',
      numero: '',
      deptoCasa: '',
      email: '',
      nombre: '',
      contrasena: ''
    },
    validationSchema: Yup.object({
      rut: Yup.string()
        .test('valida-rut', 'RUT inválido', function (value) {
          return validate.rut(value);
        })
        .required('Requerido'),
      nombreUnidad: Yup.string().required('Requerido'),
      idRegion: Yup.string().notRequired(),
      idComuna: Yup.string().notRequired(),
      calle: Yup.string().required('Requerido'),
      numero: Yup.string().notRequired(),
      deptoCasa: Yup.string().notRequired(),
      email: Yup.string().required('Requerido'),
      nombre: Yup.string().required('Requerido'),
      contrasena: Yup.string().required('Requerido')
    }),
    onSubmit: values => {
      const unitData = {
        nombre: values.nombreUnidad,
      };

      dispatch(saveNewUnitData(unitData))
        .then((unitId) => {
          if (unitId) {
            const direccionData = {
              id_pais: '1',
              id_region: values.idRegion,
              id_comuna: values.idComuna,
              calle: values.calle,
              numero: values.numero,
              depto_casa: values.deptoCasa,
              id_unidad: unitId,
            };

            dispatch(createDireccionDB(direccionData))
              .then(() => {
                const userData = {
                  rut: values.rut,
                  email: values.email,
                  nombre: values.nombre,
                  contrasena: values.contrasena,
                  id_unidad: unitId,
                };

                dispatch(saveNewUserData(userData))
                  .then(() => {
                    navigate('/');
                    Swal.fire({
                      icon: 'success',
                      title: '¡Registro Exitoso!',
                      text: 'Bienvenido.',
                    });
                  })
                  .catch((error) => {
                    console.error('Error al guardar el usuario:', error);
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
    },
  });


  return (
    <div className="contenedor mt-4 mb-1 p-3 formulario-registro">
      <div className="row"> <div className="col-10 text-center">
        <img src={logo} alt="Logo" className="contenedor-logo img-fluid img-logo mb-2" />
      </div>
        <div className="row col-12 justify-content-center">
          <div className="row">
            <div className="col-md-12 mb-3">
              <h2 className="form-titulo-registro">Registro</h2>
            </div>
            <div className="form-container-contacto">
              <form className="row g-3 needs-validation" noValidate onSubmit={formik.handleSubmit}>
                <div className="col-md-3 mb-3">
                  <label htmlFor="rut" className="form-label"> RUT: </label>
                  <input
                    type="text"
                    className="form-control"
                    id="rut"
                    name="rut"
                    value={formik.values.rut}
                    onChange={(e) => formik.setFieldValue('rut', format.rut(e.target.value))}
                    placeholder="Ingresa tu RUT"
                    required />
                  <div className="invalid-feedback">Por favor, ingresa tu RUT.</div>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="nombreUnidad" className="form-label"> Nombre de la Unidad: </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombreUnidad"
                    name="nombreUnidad"
                    value={formik.values.nombreUnidad}
                    onChange={formik.handleChange}
                    placeholder="Ingresa el nombre de la Unidad"
                    required />
                  <div className="invalid-feedback"> Por favor, ingresa el nombre de la Unidad. </div>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="idRegion" className="form-label"> Región: </label>
                  <select
                    className="form-select"
                    id="idRegion"
                    name="idRegion"
                    value={formik.values.idRegion}
                    onChange={(e) => {
                      formik.handleChange(e);
                      dispatch(fetchComunasByRegionId(e.target.value));
                    }}
                    required
                  >
                    <option value="" disabled> Selecciona una región </option>
                    {regiones && regiones.map((region) => (
                      <option key={region.id} value={region.id}> {region.nombre}</option>
                    ))}
                  </select>
                  <div className="invalid-feedback">Por favor, selecciona una región.</div>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="idComuna" className="form-label"> Comuna: </label>
                  <select
                    className="form-select"
                    id="idComuna"
                    name="idComuna"
                    value={formik.values.idComuna}
                    onChange={formik.handleChange}
                    required
                  >
                    <option value="" disabled> Selecciona una comuna </option>
                    {comunas && comunas.map((comuna) => (
                      <option key={comuna.id} value={comuna.id}> {comuna.nombre}</option>
                    ))}
                  </select>
                  <div className="invalid-feedback">Por favor, selecciona una comuna.</div>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="calle" className="form-label"> Calle: </label>
                  <input
                    type="text"
                    className="form-control"
                    id="calle"
                    name="calle"
                    value={formik.values.calle}
                    onChange={formik.handleChange}
                    placeholder="Ingresa la calle"
                    required />
                  <div className="invalid-feedback">Por favor, ingresa la calle.</div>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="numero" className="form-label"> Número: </label>
                  <input
                    type="text"
                    className="form-control"
                    id="numero"
                    name="numero"
                    value={formik.values.numero}
                    onChange={formik.handleChange}
                    placeholder="Ingresa el número"
                    required />
                  <div className="invalid-feedback">Por favor, ingresa el número.</div>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="deptoCasa" className="form-label"> Depto/Casa: </label>
                  <input
                    type="text"
                    className="form-control"
                    id="deptoCasa"
                    name="deptoCasa"
                    value={formik.values.deptoCasa}
                    onChange={formik.handleChange}
                    placeholder="Ingresa el departamento/casa"
                    required />
                  <div className="invalid-feedback"> Por favor, ingresa el departamento/casa. </div>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="email" className="form-label"> Correo Electrónico: </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email" name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    placeholder="Ingresa tu correo electrónico"
                    required />
                  <div className="invalid-feedback"> Por favor, ingresa un correo electrónico válido. </div>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="nombre" className="form-label"> Nombre: </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={formik.values.nombre}
                    onChange={formik.handleChange}
                    placeholder="Ingresa tu nombre"
                    required />
                  <div className="invalid-feedback">Por favor, ingresa tu nombre.</div>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="contrasena" className="form-label"> Contraseña: </label>
                  <input
                    type="password"
                    className="form-control"
                    id="contrasena"
                    name="contrasena"
                    value={formik.values.contrasena}
                    onChange={formik.handleChange}
                    placeholder="Ingresa tu contraseña"
                    required />
                  <div className="invalid-feedback">Por favor, ingresa tu contraseña.</div>
                </div>
                <div className="col-md-12 mt-2">
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-primary" type="button" onClick={handleRegresarClick}>
                      Regresar
                    </button>
                    <button className="btn btn-primary" type="submit"> Registrarse </button>
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








