import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { clearUserData, getUserByRut, updateEmail } from '../flux/userActions';
import { fetchUnitById } from '../flux/unitActions';
import { useNavigate } from 'react-router-dom';
import '../assets/css/App.css';
import perfilImage from '../assets/img/perfil.png';
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

    // Acción para obtener los datos del usuario por su RUT al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getUserByRut());

            if (userData.id_unidad) {
                try {
                    const unitData = await dispatch(fetchUnitById(userData.id_unidad));

                    if (unitData) {
                        console.log('Unidad encontrada - ID:', unitData.id, 'Nombre:', unitData.nombre);
                    } else {
                        console.log('No se encontraron datos de unidad');
                    }
                } catch (error) {
                    console.error('Error al obtener la unidad:', error);
                }
            }
        };

        fetchData();
    }, [dispatch, userData.id_unidad]);

    const handleCloseModal = () => {
        const path = user.userType === 'Administrador' ? '/home-administrador' : '/home-inquilino';
        dispatch(closeModalAndRedirect(path, navigate));
    };

    const handleLogout = () => {
        dispatch(clearUserData());
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
            await dispatch(updateEmail(userData.id, newEmail));

            // Actualizar el estado local con el nuevo valor de correo electrónico
            setNewEmail('');

            // Refrescar los datos del usuario para obtener el nuevo valor
            await dispatch(getUserByRut());
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
                    <div className="col-md-4 mb-3 text-center">
                        <img src={perfilImage} alt="Perfil" className="img-fluid img-perfil" />
                    </div>

                    <div className="col-md-8 mb-3">
                        <div className="row">
                            <label htmlFor="username" className="form-label col-md-3">
                                Nombre de usuario:
                            </label>
                            <div className="col-md-9">
                                <p className="form-text">{userData.nombre}</p>
                            </div>
                        </div>

                        <div className="row">
                            <label htmlFor="unidad" className="form-label col-md-3">
                                Unidad:
                            </label>
                            <div className="col-md-9">
                                <p className="form-text">{unit && unit.nombre ? unit.nombre : 'No asignada'}</p>
                            </div>
                        </div>

                        <div className="row">
                            <label htmlFor="rut" className="form-label col-md-3">RUT:</label>
                            <div className="col-md-9">
                                <p className="form-text">{userData.rut}</p>
                            </div>
                        </div>

                        <div className="row">
                            <label htmlFor="email" className="form-label col-md-3">
                                Correo electrónico:
                            </label>
                            <div className="col-md-9 d-flex justify-content-between align-items-center">
                                {!isEditing ? (
                                    <>
                                        <p className="form-text">{userData.email}</p>
                                        <button className="btn btn-secondary" type="button" onClick={handleEditEmail}>
                                            Editar
                                        </button>
                                    </>
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

                        <div className="row mt-3">
                            <div className="col-md-9 offset-md-3 d-flex justify-content-end">
                                <button className="btn btn-primary" type="button">Cambiar contraseña</button>
                            </div>
                        </div>

                        <div className="mt-3 d-flex justify-content-end" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            <img src={logoutIcon} alt="Cerrar sesión" className="img-fluid" style={{ width: '30px', height: '30px' }} />
                            <p className="form-text">Cerrar sesión</p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Perfil;












