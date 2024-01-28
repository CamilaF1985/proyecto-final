import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { saveNewTaskData } from '../flux/taskActions';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CronometroSesion from '../components/CronometroSesion.jsx';

// Componente funcional para agregar una tarea
const AgregarTarea = () => {
    // Hooks y redux
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [nombreTarea, setNombreTarea] = useState('');

    // Función para cerrar el modal y redirigir a la ruta principal
    const handleCloseModal = () => {
        const path = '/administrar-panel';
        dispatch(closeModalAndRedirect(path, navigate));
    };

    // Función para agregar una nueva tarea
    const handleAgregarTarea = () => {
        // Validar que se haya ingresado el valor de la tarea
        if (nombreTarea) {
            // Obtener id_unidad del localStorage
            const idUnidad = localStorage.getItem('id_unidad');

            // Dispatch de la acción para agregar tarea con id_unidad
            dispatch(saveNewTaskData({ nombre: nombreTarea, id_unidad: idUnidad }))
                .then(() => {
                    // Cerrar el modal y redirigir después de que la acción sea completada
                    handleCloseModal();

                    // Mostrar mensaje de éxito
                    Swal.fire({
                        icon: 'success',
                        title: '¡Tarea Agregada!',
                        text: 'La nueva tarea se ha agregado correctamente.',
                    });
                })
                .catch((error) => {
                    // Mostrar mensaje de error
                    Swal.fire({
                        icon: 'error',
                        title: '¡Error al Agregar Tarea!',
                        text: error.message || 'Ocurrió un error al agregar la tarea.',
                    });
                    console.error('Error al agregar la tarea:', error);
                });
        } else {
            // Mostrar mensaje en caso de que no se ingrese el nombre de la tarea
            Swal.fire({
                icon: 'error',
                title: '¡Error al Agregar Tarea!',
                text: 'Por favor, ingrese el nombre de la tarea.',
            });
        }
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={handleCloseModal}
            contentLabel="AgregarTarea Modal"
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
                    {/* Componente CronometroSesion */}
                    <CronometroSesion />
                    <h2 className="form-titulo">Agregar Tarea</h2>
                    <form className="row g-3 needs-validation" noValidate>
                        <div className="col-md-12 mb-3">
                            <label htmlFor="nombreTarea" className="form-label">
                                Nombre de la Tarea:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombreTarea"
                                placeholder="Ingrese el nombre de la tarea"
                                value={nombreTarea}
                                onChange={(e) => setNombreTarea(e.target.value)}
                                required
                            />
                            <div className="invalid-feedback">
                                Por favor, ingrese el nombre de la tarea.
                            </div>
                        </div>

                        <div className="col-md-12 d-flex justify-content-end">
                            <button className="btn btn-primary" type="button" onClick={handleAgregarTarea}>
                                Agregar Tarea
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default AgregarTarea;

