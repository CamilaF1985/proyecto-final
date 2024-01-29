import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import CronometroSesion from '../components/CronometroSesion.jsx';
import { updatePassword, logoutUser } from '../flux/userActions';
import Swal from 'sweetalert2';

const EditarPassword = () => {
    //componente funcional para editar la contraseña en la BD
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleNuevaContrasenaChange = (value) => {
        setNuevaContrasena(value);

        // Validar la nueva contraseña en tiempo real
        const contrasenaValida =
            value.length >= 8 &&
            /[A-Za-zÑñÁáÉéÍíÓóÚúüÜ]/.test(value) &&
            /\d/.test(value) &&
            /[@$!%#?&]/.test(value);

        // Actualizar el mensaje de error para la contraseña
        setPasswordError(contrasenaValida ? '' : 'Mínimo 8 caracteres, al menos una letra, un número y un carácter especial.');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar si las contraseñas coinciden
        if (nuevaContrasena !== confirmarContrasena) {
            // Mostrar mensaje de error con SweetAlert2 si no coinciden
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden.',
            });
            return;
        }

        // Obtener la data del formulario antes de la solicitud
        const formData = {
            nuevaContrasena,
            // Puedes agregar otros campos del formulario si es necesario
        };

        // Mostrar la data antes de la solicitud
        console.log('Data del formulario:', formData);

        // Realizar la solicitud para actualizar la contraseña
        dispatch(updatePassword(formData))
            .then(() => {
                // Mostrar mensaje de actualización exitosa con SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: '¡Contraseña actualizada!',
                    text: 'Por favor vuelve a iniciar sesión.',
                });
                // Despachar la acción para cerrar sesión después de actualizar la contraseña
                dispatch(logoutUser());
                navigate('/logout');
            })
            .catch((error) => {
                console.error('Error al actualizar la contraseña:', error);

                // Mostrar mensaje de error con SweetAlert2, si hay un error en la solicitud
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo actualizar la contraseña. Por favor, inténtelo de nuevo.',
                });
            });
    };

    const handleRegresarClick = () => {
        // Redirigir al home correspondiente al tipo de usuario
        const path = user.userType === 'Administrador' ? '/home-administrador' : '/home-inquilino';
        navigate(path);
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
                        <h2 className="form-titulo-registro">Cambiar Contraseña</h2>
                    </div>
                </div>

                <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="nuevaContrasena" className="form-label">
                            Nueva Contraseña:
                        </label>
                        <input
                            type="password"
                            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                            id="nuevaContrasena"
                            value={nuevaContrasena}
                            onChange={(e) => handleNuevaContrasenaChange(e.target.value)}
                            placeholder="Ingresa la nueva contraseña"
                            required
                        />
                        {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="confirmarContrasena" className="form-label">
                            Confirmar Contraseña:
                        </label>
                        <input
                            type="password"
                            className={`form-control`}
                            id="confirmarContrasena"
                            value={confirmarContrasena}
                            onChange={(e) => setConfirmarContrasena(e.target.value)}
                            placeholder="Confirma la nueva contraseña"
                            required
                        />
                    </div>

                    <div className="col-md-12 mt-2">
                        <div className="d-flex justify-content-between">
                            <button className="btn btn-primary" type="button" onClick={handleRegresarClick}>
                                Regresar
                            </button>
                            <button className="btn btn-primary" type="submit">
                                Actualizar Contraseña
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarPassword;
