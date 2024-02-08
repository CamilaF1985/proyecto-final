import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getGastosPersona, updateEstadoGastoPersona, updateEstadoGastoPersonaEnBD } from '../flux/personExpenseActions';
import Swal from 'sweetalert2';
import '../assets/css/App.css';
import CronometroSesion from '../components/CronometroSesion.jsx';

const GastosPendientes = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isOpen = useSelector((state) => state.modalIsOpen);
    const gastosPersonaListAsync = useSelector((state) => state.gastosPersonaListAsync);
    const gastosPersonaListActualizado = useSelector((state) => state.gastosPersonaListActualizado);
    const [selectedGastos, setSelectedGastos] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(getGastosPersona());
                setDataLoaded(true);
            } catch (error) {
                console.error('Error al obtener los gastos persona:', error);
            }
        };

        fetchData();
    }, [dispatch]);

    const handleCloseModal = () => {
        navigate('/');
    };

    const handlePagoClick = async (gastoPersona) => {
        if ('id_gasto' in gastoPersona && 'id_persona' in gastoPersona) {
            try {
                const isSelected = selectedGastos.includes(gastoPersona.id_gasto);

                dispatch(updateEstadoGastoPersona(gastoPersona));

                setSelectedGastos((prevSelected) => {
                    if (isSelected) {
                        return prevSelected.filter((id) => id !== gastoPersona.id_gasto);
                    } else {
                        return [...prevSelected, gastoPersona.id_gasto];
                    }
                });
            } catch (error) {
                console.error('Error al actualizar el estado de los gastos:', error);
            }
        } else {
            console.error('Objeto seleccionado no tiene los valores necesarios.');
        }
    };

    const handleEnviarGastosSeleccionados = async () => {
        try {
            // Obtén el id_persona de la lista actualizada de gastos
            const idPersona = gastosPersonaListActualizado.length > 0 ? gastosPersonaListActualizado[0].id_persona : null;

            // Envía los datos al hacer clic en el botón
            const promises = selectedGastos.map((gastoId) => {
                return dispatch(updateEstadoGastoPersonaEnBD({
                    id_gasto: gastoId,
                    id_persona: idPersona
                }));
            });
            await Promise.all(promises);

            // Espera un breve momento antes de actualizar los datos
            await new Promise(resolve => setTimeout(resolve, 100));

            // Actualiza los datos después del envío
            dispatch(getGastosPersona());

            // Ahora, los datos deberían estar actualizados
            setDataLoaded(false);
            setSelectedGastos([]);

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Los gastos han sido actualizados correctamente.',
            });
        } catch (error) {
            console.error('Error al actualizar los estados de los gastos:', error);
        }
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
                    {/* Componente CronometroSesion */}
                    <CronometroSesion />
                    <h2 className="form-titulo">Gastos Pendientes</h2>
                    <p className="subtitulo"> <strong>Marca los pagos que ya hayas realizado</strong></p>
                    <div className="row">
                        {gastosPersonaListAsync && gastosPersonaListAsync.length > 0 ? (
                            <>
                                {gastosPersonaListAsync.every((gastoPersona) => gastoPersona.estado) ? (
                                    <div key="noGastosPendientes" className="col-md-12 mb-3">
                                        <p><strong>No hay gastos pendientes.</strong></p>
                                    </div>
                                ) : (
                                    gastosPersonaListAsync
                                        .filter((gastoPersona) => !gastoPersona.estado)
                                        .map((gastoPersona) => (
                                            <div key={gastoPersona.id_gasto} className="col-md-12 mb-3">
                                                <div className="row align-items-center">
                                                    <div className="col-md-10">
                                                        <strong>{`Concepto: ${gastoPersona.descripcion_gasto || 'Sin nombre'} | Monto a pagar: ${gastoPersona.monto_prorrateado || 0}`}</strong>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                onChange={() => handlePagoClick(gastoPersona)}
                                                                checked={selectedGastos.includes(gastoPersona.id_gasto)}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                )}
                            </>
                        ) : (
                            <div key="noGastosAsignados" className="col-md-12 mb-3">
                                <p><strong>No hay gastos asignados al usuario.</strong></p>
                            </div>
                        )}
                    </div>

                    {/* Botón siempre visible para enviar gastos seleccionados */}
                    <div className="col-md-12 mb-3">
                        <button
                            className="btn btn-primary"
                            onClick={handleEnviarGastosSeleccionados}
                            disabled={selectedGastos.length === 0}
                        >
                            Enviar Gastos Seleccionados
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default GastosPendientes;




























