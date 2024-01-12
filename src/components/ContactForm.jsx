import React from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { useNavigate } from 'react-router-dom';
import '../assets/css/App.css';

const ContactForm = () => {
    // Hooks y Redux
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Función para cerrar el modal y redirigir a la ruta principal
    const handleCloseModal = () => {
        // Configuración de la ruta
        const path = '/';
        dispatch(closeModalAndRedirect(path, navigate));
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={handleCloseModal}
            contentLabel="ContactForm Modal"
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            {/* Contenido del modal */}
            <div className="modal-header d-flex justify-content-end mb-2">
                {/* Botón para cerrar el modal */}
                <button className="btn btn-danger" onClick={handleCloseModal}>
                    X
                </button>
            </div>

            <div className="modal-body">
                <div className="form-container">
                    {/* Título del formulario */}
                    <h2 className="form-titulo">Contacto</h2>
                    {/* Formulario con clases de Bootstrap para la responsividad */}
                    <form className="row g-3 needs-validation" noValidate>
                        {/* Fila para el campo de nombre completo */}
                        <div className="col-md-12 mb-3">
                            <label htmlFor="fullName" className="form-label">Nombre completo:</label>
                            {/* Campo de entrada para el nombre completo */}
                            <input type="text" className="form-control" id="fullName" placeholder="Ingresa tu nombre completo" required />
                            {/* Mensaje de retroalimentación en caso de entrada no válida */}
                            <div className="invalid-feedback">
                                Por favor, ingresa tu nombre completo.
                            </div>
                        </div>

                        {/* Fila para el campo de correo electrónico */}
                        <div className="col-md-12 mb-3">
                            <label htmlFor="email" className="form-label">Correo electrónico:</label>
                            {/* Campo de entrada para el correo electrónico */}
                            <input type="email" className="form-control" id="email" placeholder="Ingresa tu correo electrónico" required />
                            {/* Mensaje de retroalimentación en caso de entrada no válida */}
                            <div className="invalid-feedback">
                                Por favor, ingresa un correo electrónico válido.
                            </div>
                        </div>

                        {/* Fila para el campo de mensaje */}
                        <div className="col-md-12 mb-3">
                            <label htmlFor="message" className="form-label">Mensaje:</label>
                            {/* Área de texto para el mensaje */}
                            <textarea className="form-control" id="message" placeholder="Escribe tu mensaje aquí" rows="5" required />
                            {/* Mensaje de retroalimentación en caso de entrada no válida */}
                            <div className="invalid-feedback">
                                Por favor, ingresa tu mensaje.
                            </div>
                        </div>

                        {/* Botón "Enviar" */}
                        <div className="col-md-12 d-flex justify-content-end">
                            <button className="btn btn-primary" type="submit">Enviar</button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default ContactForm;

