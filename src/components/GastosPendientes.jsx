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
    const [loading, setLoading] = useState(true);
    const [todosGastosPagados, setTodosGastosPagados] = useState(false);
    const gastosPersonaListAsync = useSelector((state) => state.gastosPersonaListAsync);

    useEffect(() => {
        const fetchGastosPersona = () => {
            dispatch(getGastosPersona())
                .then(() => {
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error al obtener los gastos persona:', error);
                    setLoading(false);
                });
        };

        fetchGastosPersona();
    }, [dispatch]);

    const handleCloseModal = () => {
        navigate('/');
    };

    const handlePagoClick = (gastoPersona) => {
        dispatch(updateEstadoGastoPersona(gastoPersona))
            .then(() => dispatch(getGastosPersona()))
            .then((updatedGastosList) => {
                // Verifica si updatedGastosList es undefined o no tiene la propiedad "every"
                const pagados = Array.isArray(updatedGastosList) && updatedGastosList.every(gasto => gasto.estado);
                setTodosGastosPagados(pagados);
            })
            .catch((error) => {
                console.error('Error al actualizar el estado del gasto persona:', error);
            });
    };

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
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <div className="row g-3">
                            {gastosPersonaListAsync && gastosPersonaListAsync.length > 0 ? (
                                <>
                                    {gastosPersonaListAsync.map((gastoPersona, index) => (
                                        // Filtra los gastos que ya están pagados
                                        !gastoPersona.estado && (
                                            <div className="col-md-12 mb-3" key={index}>
                                                <p>{`Concepto: ${gastoPersona.descripcion_gasto || "Sin nombre"}`}</p>
                                                <p>{`Monto a pagar: ${gastoPersona.monto_prorrateado || 0}`}</p>
                                                <button
                                                    onClick={() => handlePagoClick(gastoPersona)}
                                                    disabled={gastoPersona.estado}
                                                >
                                                    Ya lo pagué
                                                </button>
                                            </div>
                                        )
                                    ))}
                                    {todosGastosPagados && (
                                        <div className="col-md-12 mb-3" key="todosGastosPagados">
                                            <p>No hay gastos pendientes para este usuario.</p>
                                        </div>
                                    )}
                                    {!todosGastosPagados && gastosPersonaListAsync.every(gasto => gasto.estado) && (
                                        <div className="col-md-12 mb-3" key="noGastosPendientes">
                                            <p>No hay gastos pendientes.</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="col-md-12 mb-3" key="noGastosAsignados">
                                    <p>No hay gastos asignados al usuario.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default GastosPendientes;








