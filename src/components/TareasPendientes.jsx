import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTareasAsignadas, updateFechaTermino } from '../flux/personTaskActions';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import '../assets/css/App.css';

const TareasPendientes = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const tareasAsignadas = useSelector((state) => state.tareasAsignadas);
    const isOpen = useSelector((state) => state.modalIsOpen);
    const [loading, setLoading] = useState(true);
    const [tareasSeleccionadas, setTareasSeleccionadas] = useState([]);

    // Declarar la función fetchTareas fuera del bloque useEffect
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

    useEffect(() => {
        // Llamar a la función de obtener tareas al montar el componente
        fetchTareas();
    }, [dispatch]);

    const handleCloseModal = () => {
        navigate('/');
    };

    const handleUpdateFechaTermino = (tareaPersonaId) => {
        const tareaIndex = tareasSeleccionadas.indexOf(tareaPersonaId);
        if (tareaIndex === -1) {
            setTareasSeleccionadas([...tareasSeleccionadas, tareaPersonaId]);
        } else {
            setTareasSeleccionadas(tareasSeleccionadas.filter((id) => id !== tareaPersonaId));
        }
    };

    const handleEnviarTareasSeleccionadas = () => {
        const promises = tareasSeleccionadas.map((tareaId) => dispatch(updateFechaTermino(tareaId)));

        Promise.all(promises)
            .then(() => {
                // Utilizar la función fetchTareas en lugar de copiar el código
                fetchTareas();
                setTareasSeleccionadas([]);

                // Utilizar SweetAlert2 para mostrar la alerta de éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Las tareas han sido actualizadas correctamente.',
                });
            })
            .catch((error) => {
                console.error('Error al actualizar las fechas de término:', error);
            });
    };

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
                    <p ClassName="subtitulo"> Marca las tareas que ya has realizado </p>
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
                                            !tarea.fecha_termino && (
                                                <div key={tarea.id_tarea_persona} className="col-md-12 mb-3">
                                                    <label>
                                                        {` ${tarea.nombre_tarea || "Sin nombre"}`}
                                                        <input
                                                            type="checkbox"
                                                            onChange={() => handleUpdateFechaTermino(tarea.id_tarea_persona)}
                                                            checked={tareasSeleccionadas.includes(tarea.id_tarea_persona)}
                                                        />
                                                    </label>
                                                </div>
                                            )
                                        ))
                                    )}
                                    <div className="col-md-12 mb-3">
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleEnviarTareasSeleccionadas}
                                            disabled={tareasSeleccionadas.length === 0}
                                        >
                                            Enviar Tareas Seleccionadas
                                        </button>
                                    </div>
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










