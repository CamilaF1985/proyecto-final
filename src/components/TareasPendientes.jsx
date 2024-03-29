import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeModalAndRedirect } from '../flux/modalActions';
import { getTareasAsignadas, updateFechaTermino } from '../flux/personTaskActions';
import Swal from 'sweetalert2';
import '../assets/css/App.css';
import CronometroSesion from '../components/CronometroSesion.jsx';

const TareasPendientes = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const tareasAsignadas = useSelector((state) => state.tareasAsignadas);
    const modalIsOpen = useSelector((state) => state.modalIsOpen);
    const user = useSelector((state) => state.user);
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
        //Cerrar el modal y redirigir al home correspodiente al tipo de usuario
        const path = user.userType === 'Administrador' ? '/home-administrador' : '/home-inquilino';
        dispatch(closeModalAndRedirect(path, navigate));
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
            isOpen={modalIsOpen}
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
                    {/* Componente CronometroSesion */}
                    <CronometroSesion />
                    <h2 className="form-titulo">Tareas Pendientes</h2>
                    <p className="subtitulo"> <strong>Marca las tareas que ya has realizado</strong> </p>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <div className="row g-3">
                            {tareasAsignadas && tareasAsignadas.length > 0 ? (
                                <>
                                    {todasTienenFechaTermino ? (
                                        <div className="col-md-12 mb-3">
                                            <p><strong>No hay tareas pendientes.</strong></p>
                                        </div>
                                    ) : (
                                        tareasAsignadas.map((tarea) => (
                                            !tarea.fecha_termino && (
                                                <div key={tarea.id_tarea_persona} className="col-md-12 mb-3">
                                                    <label>
                                                        <strong>{`${tarea.nombre_tarea || "Sin nombre"}`}</strong>
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
                                    <p><strong>No hay tareas asignadas.</strong></p>
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










