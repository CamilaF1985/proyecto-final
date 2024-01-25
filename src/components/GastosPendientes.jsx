import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getGastosPersona, updateEstadoGastoPersona } from '../flux/personExpenseActions';
import '../assets/css/App.css';

const GastosPendientes = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isOpen = useSelector((state) => state.modalIsOpen);
    const gastosPersonaListAsync = useSelector((state) => state.gastosPersonaListAsync);

    useEffect(() => {
        // Función para obtener los gastos asignados cuando el componente se monta
        const fetchGastosPersona = () => {
            dispatch(getGastosPersona())
                .catch((error) => {
                    console.error('Error al obtener los gastos persona:', error);
                });
        };
        // Llama a la función de obtener gastos al montar el componente
        fetchGastosPersona();
    }, [dispatch]);

    const handleCloseModal = () => {
        navigate('/');
    };

    const handlePagoClick = (gastoPersona) => {
        // Llamar a la acción para actualizar el estado en la base de datos
        dispatch(updateEstadoGastoPersona(gastoPersona))
            .then(() => {
                // Actualizar el estado directamente después de la acción exitosa
                // Utilizamos el nuevo estado después de la actualización
                const updatedGastosList = gastosPersonaListAsync.filter((gasto) => gasto.id !== gastoPersona.id);
                dispatch({ type: 'SET_GASTOS_PERSONA_LIST', payload: updatedGastosList });
            })
            .catch((error) => {
                console.error('Error al actualizar el estado del gasto persona:', error);
            });
    };

    // Verifica si todos los gastos están pagados
    const todosGastosPagados = gastosPersonaListAsync.every((gasto) => gasto.estado);

    return (
        <Modal
            isOpen={isOpen ?? false}
            onRequestClose={handleCloseModal}
            contentLabel="GastosPendientes Modal"
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
                    <h2 className="form-titulo">Gastos Pendientes</h2>
                    <p className="subtitulo"> Marca los pagos que ya hayas realizado </p>
                    <div className="row g-3">
                        {gastosPersonaListAsync && gastosPersonaListAsync.length > 0 ? (
                            <div className="col-md-12 mb-3">
                                {gastosPersonaListAsync
                                    .filter((gastoPersona) => !gastoPersona.estado) // Filtra solo los no pagados
                                    .map((gastoPersona, index) => (
                                        <div className="d-flex align-items-center" key={index}>
                                            <label>
                                                {`Concepto: ${gastoPersona.descripcion_gasto || "Sin nombre"} `}
                                                {`| Monto a pagar: ${gastoPersona.monto_prorrateado || 0}`}
                                                <input
                                                    type="checkbox"
                                                    onChange={() => handlePagoClick(gastoPersona)}
                                                    disabled={gastoPersona.estado}
                                                    defaultChecked={gastoPersona.estado}
                                                />

                                            </label>
                                        </div>
                                    ))}
                                {todosGastosPagados && (
                                    <p>No hay gastos pendientes.</p>
                                )}
                            </div>
                        ) : (
                            <div className="col-md-12 mb-3" key="noGastosAsignados">
                                <p>No hay gastos asignados al usuario.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default GastosPendientes;

















