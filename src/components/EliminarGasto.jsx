import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { deleteExpenseFromDatabase, getExpensesByUnit, saveFetchedExpensesData } from '../flux/expenseActions';
import { useNavigate } from 'react-router-dom';

const EliminarGasto = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modalIsOpen);
  const [factura, setFactura] = useState('');
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unitId = localStorage.getItem('id_unidad');
        if (unitId) {
          const { gastos } = await dispatch(getExpensesByUnit(unitId));
          setExpensesList(gastos);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al obtener la lista de gastos:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleEliminarGasto = (id) => {
    // Eliminar el gasto
    dispatch(deleteExpenseFromDatabase(id))
      .then((deletedGastoId) => {
        if (deletedGastoId) {
          console.log('Gasto eliminado con éxito:', deletedGastoId);
  
          // Después de eliminar, obtener la lista actualizada
          dispatch(getExpensesByUnit(localStorage.getItem('id_unidad')))
            .then((updatedExpenses) => {
              // Actualizar el estado local con la lista actualizada
              setExpensesList(updatedExpenses);
            })
            .catch((error) => {
              console.error('Error al obtener la lista actualizada de gastos:', error);
            });
        } else {
          console.error('Error al eliminar el gasto:', id);
        }
      })
      .catch((error) => {
        console.error('Error al procesar la eliminación del gasto:', error);
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
          <h2 className="form-titulo">Eliminar Gasto</h2>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="row g-3">
              {/* Muestra la lista de gastos */}
              {expensesList && expensesList.length > 0 ? (
                expensesList.map((expense) => (
                  <div key={expense.id} className="col-md-12 mb-3">
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





