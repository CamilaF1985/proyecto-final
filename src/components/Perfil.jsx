import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { getUserByRut, updateEmail, logoutUser } from '../flux/userActions';
import { fetchUnitById } from '../flux/unitActions';
import { useNavigate } from 'react-router-dom';
import '../assets/css/App.css';
import logoutIcon from '../assets/img/logout.png';

const Perfil = () => {
    const dispatch = useDispatch();
    const modalIsOpen = useSelector((state) => state.modalIsOpen);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const userData = user || {};
    const unit = useSelector((state) => state.unit);

    // Estado local para controlar la visibilidad del input y el botón
    const [isEditing, setIsEditing] = useState(false);
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        const fetchData = () => {
            dispatch(getUserByRut())
                .then(() => {
                    // La acción getUserByRut se completó, ahora puedes realizar otras operaciones
                    if (userData.id_unidad) {
                        return dispatch(fetchUnitById(userData.id_unidad));
                    } else {
                        // Si no hay id_unidad, puedes devolver una promesa resuelta
                        return Promise.resolve(null);
                    }
                })
                .then((unitData) => {
                    if (unitData) {
                        console.log('Unidad encontrada - ID:', unitData.id, 'Nombre:', unitData.nombre);
                    } else {
                        console.log('No se encontraron datos de unidad');
                    }
                })
                .catch((error) => {
                    console.error('Error en useEffect:', error);
                });
        };

        fetchData();
    }, [dispatch, userData.id_unidad]);

    const handleCloseModal = () => {
        const path = user.userType === 'Administrador' ? '/home-administrador' : '/home-inquilino';
        dispatch(closeModalAndRedirect(path, navigate));
    };

    const handleLogout = () => {
        // Llama a la acción logoutUser
        dispatch(logoutUser());

        // Después de cerrar sesión, navega a /logout
        navigate('/logout');
    };


    const handleEditEmail = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setNewEmail('');
    };

    const handleUpdateEmail = async () => {
        try {
            // Dispatch de la acción para actualizar el email
            const updateEmailResult = dispatch(updateEmail(userData.id, newEmail));

            // Asegurarte de que updateEmailResult es una promesa si es necesario
            if (updateEmailResult instanceof Promise) {
                await updateEmailResult;
            }

            // Actualizar el estado local con el nuevo valor de correo electrónico
            setNewEmail('');

            // Refrescar los datos del usuario para obtener el nuevo valor
            const getUserResult = dispatch(getUserByRut());

            // Asegurarte de que getUserResult es una promesa si es necesario
            if (getUserResult instanceof Promise) {
                await getUserResult;
            }
        } catch (error) {
            console.error('Error durante la actualización del correo electrónico:', error);
        } finally {
            // Salir del modo de edición
            setIsEditing(false);
        }
    };

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Perfil Modal"
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            <div className="modal-header d-flex justify-content-end mb-2">
                <button className="btn btn-danger" onClick={handleCloseModal}>
                    X
                </button>
            </div>

            <div className="modal-body">
                <div className="perfil-container row">
                    <div className="col-md-12 mb-3 text-center">
                        <h1>Mi Perfil</h1>
                    </div>

                    <div className="col-md-8 offset-md-2 mb-3">
                        <div className="row mb-3">
                            <div className="col-6">
                                <label htmlFor="username" className="form-label">
                                    Nombre:
                                </label>
                            </div>
                            <div className="col-6">
                                <p className="form-text">{userData.nombre}</p>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="unidad" className="form-label">
                                    Unidad:
                                </label>
                            </div>
                            <div className="col-md-6">
                                <p className="form-text">{unit && unit.nombre ? unit.nombre : 'No asignada'}</p>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="rut" className="form-label">
                                    RUT:
                                </label>
                            </div>
                            <div className="col-md-6">
                                <p className="form-text">{userData.rut}</p>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="email" className="form-label">
                                    E-mail:
                                </label>
                            </div>
                            <div className="col-md-6">
                                <p className="form-text">{userData.email}</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12 offset-md-3">
                                {!isEditing ? (
                                    <button className="btn btn-secondary" type="button" onClick={handleEditEmail}>
                                        Editar correo
                                    </button>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                        />
                                        <div className="d-flex justify-content-between align-items-center">
                                            <button className="btn btn-success" type="button" onClick={handleUpdateEmail}>
                                                Guardar
                                            </button>
                                            <button className="btn btn-danger" type="button" onClick={handleCancelEdit}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <button className="btn btn-primary me-2" type="button">
                                    Cambiar contraseña
                                </button>
                                <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                    <img src={logoutIcon} alt="Cerrar sesión" className="img-fluid ms-5" style={{ width: '30px', height: '30px' }} />
                                    <p className="form-text img-fluid ms-5">Cerrar sesión</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Perfil;












