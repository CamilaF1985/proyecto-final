import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { deleteExpenseFromDatabase, getExpensesByUnit } from '../flux/expenseActions';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CronometroSesion from '../components/CronometroSesion.jsx';

const EliminarGasto = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modalIsOpen);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [updatedExpenses, setUpdatedExpenses] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      const unitId = localStorage.getItem('id_unidad');
      if (unitId) {
        dispatch(getExpensesByUnit(unitId))
          .then(({ gastos }) => {
            setUpdatedExpenses(gastos);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error al obtener la lista de gastos:', error);
            setLoading(false);
          });
      }
    };

    fetchData();
  }, [dispatch]);

  const handleEliminarGasto = (id) => {
    // Eliminar el gasto
    dispatch(deleteExpenseFromDatabase(id))
      .then(() => {
        // Después de eliminar, obtener la lista actualizada
        dispatch(getExpensesByUnit(localStorage.getItem('id_unidad')))
          .then(({ gastos }) => {
            // Actualizar el estado local con la lista actualizada
            setUpdatedExpenses(gastos);

            // Mostrar mensaje de éxito
            Swal.fire({
              icon: 'success',
              title: '¡Gasto Eliminado!',
              text: 'El gasto se ha eliminado correctamente.',
            });
          })
          .catch((error) => {
            console.error('Error al obtener la lista actualizada de gastos:', error);
          });
      })
      .catch((error) => {
        console.error('Error al procesar la eliminación del gasto:', error);

        // Mostrar mensaje de error
        Swal.fire({
          icon: 'error',
          title: '¡Error al Eliminar Gasto!',
          text: error.message || 'Ocurrió un error al eliminar el gasto.',
        });
      });
  };

  const handleCloseModal = () => {
    const path = '/administrar-panel';
    dispatch(closeModalAndRedirect(path, navigate));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="EliminarGasto Modal"
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
          <h2 className="form-titulo">Eliminar Gasto</h2>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="row g-3">
              {/* Muestra la lista de gastos */}
              {updatedExpenses && updatedExpenses.length > 0 ? (
                updatedExpenses.map((expense) => (
                  <div key={expense.id} className="col-md-12" style={{ marginRight: '10px !important' }}>
                    <p>{`Monto: ${expense.monto || 'No disponible'}, Descripción: ${expense.descripcion || 'No disponible'}`}</p>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleEliminarGasto(expense.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              ) : (
                <p>No hay gastos disponibles.</p>
              )}
            </div>
          )}

        </div>
      </div>
    </Modal>
  );
};

export default EliminarGasto;









