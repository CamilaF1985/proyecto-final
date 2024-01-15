import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { clearUserData, getUserByRut } from '../flux/userActions';
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

    // Acción para obtener los datos del usuario por su RUT al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getUserByRut());

            if (userData.id_unidad) {
                try {
                    const unitData = await dispatch(fetchUnitById(userData.id_unidad));

                    if (unitData) {
                        // Si unitData tiene datos, puedes hacer algo con ellos aquí
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
                            <label htmlFor="email" className="form-label col-md-3">Correo electrónico:</label>
                            <div className="col-md-9 d-flex justify-content-between align-items-center">
                                <p className="form-text">{userData.email}</p>
                                <button className="btn btn-secondary" type="button">Editar</button>
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












