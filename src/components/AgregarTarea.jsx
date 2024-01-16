import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { saveNewTaskData } from '../flux/taskActions';
import { useNavigate } from 'react-router-dom';

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
            dispatch(saveNewTaskData({ nombre: nombreTarea, id_unidad: idUnidad }));

            // Cerrar el modal y redirigir
            handleCloseModal();
        } else {
            // Manejar caso donde no se ingresó el valor de la tarea
            alert('Por favor, ingrese el nombre de la tarea.');
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

