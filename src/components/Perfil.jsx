import React from 'react';
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';  
import { clearUserData } from '../flux/userActions';
import { useNavigate } from 'react-router-dom';
import '../assets/css/App.css';  
import perfilImage from '../assets/img/perfil.png';  
import logoutIcon from '../assets/img/logout.png';  

// Componente funcional para la ventana modal del perfil
const Perfil = () => {
    // Hooks y redux
    const dispatch = useDispatch();
    const modalIsOpen = useSelector((state) => state.modalIsOpen);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    // Función para cerrar la ventana modal y redirigir según el tipo de usuario
    const handleCloseModal = () => {
        const path = user.userType === 'Administrador' ? '/home-administrador' : '/home-inquilino';
        dispatch(closeModalAndRedirect(path, navigate));
    };

    // Función para gestionar el cierre de sesión
    const handleLogout = () => {
        dispatch(clearUserData());
        navigate('/logout');
    };

    // Estructura JSX del componente modal de perfil
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Perfil Modal"
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            {/* Encabezado de la ventana modal */}
            <div className="modal-header d-flex justify-content-end mb-2">
                <button className="btn btn-danger" onClick={handleCloseModal}>
                    X
                </button>
            </div>

            {/* Cuerpo de la ventana modal */}
            <div className="modal-body">
                <div className="perfil-container row">
                    {/* Sección de imagen de perfil */}
                    <div className="col-md-4 mb-3 text-center">
                        <img src={perfilImage} alt="Perfil" className="img-fluid img-perfil" />
                    </div>

                    {/* Sección de detalles de usuario */}
                    <div className="col-md-8 mb-3">
                        <div className="row">
                            {/* Nombre de usuario */}
                            <label htmlFor="username" className="form-label col-md-3">
                                Nombre de usuario:
                            </label>
                            <div className="col-md-9">
                                <p className="form-text">{user.nombre}</p>
                            </div>
                        </div>

                        {/* RUT (por ejemplo) */}
                        <div className="row">
                            <label htmlFor="rut" className="form-label col-md-3">RUT:</label>
                            <div className="col-md-9">
                                <p className="form-text">{user.rut}</p>
                            </div>
                        </div>

                        {/* Correo electrónico (por ejemplo) */}
                        <div className="row">
                            <label htmlFor="email" className="form-label col-md-3">Correo electrónico:</label>
                            <div className="col-md-9 d-flex justify-content-between align-items-center">
                                <p className="form-text">{user.email}</p>
                                <button className="btn btn-secondary" type="button">Editar</button>
                            </div>
                        </div>

                        {/* Sección de cambio de contraseña */}
                        <div className="row mt-3">
                            <div className="col-md-9 offset-md-3 d-flex justify-content-end">
                                <button className="btn btn-primary" type="button">Cambiar contraseña</button>
                            </div>
                        </div>

                        {/* Icono de cerrar sesión y texto */}
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

// Exporta el componente Perfil para su uso en la aplicación
export default Perfil;










