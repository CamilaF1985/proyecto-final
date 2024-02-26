import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { useNavigate } from 'react-router-dom';
import { sendContactForm } from '../flux/contactActions';  // Asegúrate de poner la ruta correcta
import Swal from 'sweetalert2';

import '../assets/css/App.css';

const ContactForm = () => {
    // Hooks y Redux
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Estados locales para los campos del formulario
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crear un objeto con los datos del formulario
        const formData = {
            to: 'camila.fabbroni1985@gmail.com,',  
            subject: 'Nuevo mensaje de contacto',
            body: `Nombre: ${fullName}\nCorreo electrónico: ${email}\nMensaje: ${message}`,
        };

        try {
            // Llamar a la acción para enviar el formulario
            await sendContactForm(formData);

            // Mostrar mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El mensaje se envió correctamente.',
                confirmButtonText: 'OK',
            }).then(() => {
                // Cerrar el modal y redirigir
                const path = '/';
                dispatch(closeModalAndRedirect(path, navigate));
            });
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);

            // Mostrar mensaje de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al enviar el formulario. Por favor, intenta de nuevo.',
                confirmButtonText: 'OK',
            });
        }
    };

    // Función para cerrar el modal y redirigir a la ruta principal
    const handleCloseModal = () => {
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
            <div className="modal-header d-flex justify-content-end mb-2">
                <button className="btn btn-danger" onClick={handleCloseModal}>
                    X
                </button>
            </div>

            <div className="modal-body">
                <div className="form-container">
                    <h2 className="form-titulo">Contacto</h2>
                    <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                        <div className="col-md-12 mb-3">
                            <label htmlFor="fullName" className="form-label"><strong>Nombre completo:</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                id="fullName"
                                placeholder="Ingresa tu nombre completo"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                            <div className="invalid-feedback">
                                Por favor, ingresa tu nombre completo.
                            </div>
                        </div>

                        <div className="col-md-12 mb-3">
                            <label htmlFor="email" className="form-label"><strong>Correo electrónico:</strong></label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Ingresa tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <div className="invalid-feedback">
                                Por favor, ingresa un correo electrónico válido.
                            </div>
                        </div>

                        <div className="col-md-12 mb-3">
                            <label htmlFor="message" className="form-label"><strong>Mensaje:</strong></label>
                            <textarea
                                className="form-control"
                                id="message"
                                placeholder="Escribe tu mensaje aquí"
                                rows="5"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                            <div className="invalid-feedback">
                                Por favor, ingresa tu mensaje.
                            </div>
                        </div>

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



