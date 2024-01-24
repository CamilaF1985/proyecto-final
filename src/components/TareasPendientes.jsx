import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTareasAsignadas, updateFechaTermino } from '../flux/personTaskActions';
import '../assets/css/App.css';

const TareasPendientes = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.modalIsOpen);
    const navigate = useNavigate();
    const tareasAsignadas = useSelector((state) => state.tareasAsignadas);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTareas = () => {
            dispatch(getTareasAsignadas())
                .then(() => {
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error al obtener las tareas asignadas:', error);
                    setLoading(false);
                });
        };

        fetchTareas();
    }, [dispatch]);

    const handleCloseModal = () => {
        navigate('/');
    };

    const handleUpdateFechaTermino = (tareaPersonaId) => {
        // Llama a la acción para actualizar la fecha de término
        dispatch(updateFechaTermino(tareaPersonaId))
            .then(() => {
                // Vuelve a cargar las tareas después de actualizar la fecha de término
                fetchTareas();
            })
            .catch((error) => {
                console.error('Error al actualizar la fecha de término:', error);
            });
    };

    // Verifica si todas las tareas tienen una fecha de término asignada
    const todasTienenFechaTermino = tareasAsignadas.every((tarea) => tarea.fecha_termino);

    return (
        <Modal
            isOpen={isOpen ?? false}
            onRequestClose={handleCloseModal}
            contentLabel="TareasPendientes Modal"
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
                    <h2 className="form-titulo">Tareas Pendientes</h2>
                    <p ClassName= "subtitulo"> Marca las tareas que ya has realizado </p> {/* Nuevo texto agregado */}
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <div className="row g-3">
                            {tareasAsignadas && tareasAsignadas.length > 0 ? (
                                <>
                                    {todasTienenFechaTermino ? (
                                        <div className="col-md-12 mb-3">
                                            <p>No hay tareas pendientes.</p>
                                        </div>
                                    ) : (
                                        tareasAsignadas.map((tarea) => (
                                            // Verifica si la tarea no tiene una fecha de término asignada
                                            !tarea.fecha_termino && (
                                                <div key={tarea.id_tarea_persona} className="col-md-12 mb-3">
                                                    <label>
                                                        {` ${tarea.nombre_tarea || "Sin nombre"}`}
                                                        <input
                                                            type="checkbox"
                                                            onChange={() => handleUpdateFechaTermino(tarea.id_tarea_persona)}
                                                        />
                                                    </label>
                                                </div>
                                            )
                                        ))
                                    )}
                                </>
                            ) : (
                                <div className="col-md-12 mb-3">
                                    <p>No hay tareas asignadas.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default TareasPendientes;






