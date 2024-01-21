import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTareasAsignadas } from '../flux/personTaskActions';
import '../assets/css/App.css';

const TareasPendientes = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.modalIsOpen);
    const navigate = useNavigate();
    // Extraer el estado de las tareas directamente
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


    useEffect(() => {
        console.log('Tareas asignadas en el componente TareasPendientes:', tareasAsignadas);
    }, [tareasAsignadas]);

    const handleCloseModal = () => {
        navigate('/');
    };

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
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <div className="row g-3">
                            {tareasAsignadas && tareasAsignadas.length > 0 ? (
                                <>
                                    {tareasAsignadas.map((tarea) => {
                                        console.log('Tarea:', tarea);
                                        return (
                                            <div key={tarea.id_tarea_persona} className="col-md-12 mb-3">
                                                <p>{`Nombre de la tarea: ${tarea.nombre_tarea || "Sin nombre"}`}</p>
                                            </div>
                                        );
                                    })}
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





