import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { closeModalAndRedirect } from '../flux/modalActions';
import { getUsersByUnit } from '../flux/userActions';
import { useNavigate } from 'react-router-dom';
import '../assets/css/App.css';

// Importa el selector de datos de usuarios
import { selectUsersDataSelector } from '../flux/selectors';

const EliminarInquilino = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.modalIsOpen);

  // Utiliza el selector para obtener los datos de usuarios
  const localUsersData = useSelector(selectUsersDataSelector);
  const [loading, setLoading] = useState(true);

  // Obtener el id de la unidad desde el localStorage
  const unidadId = localStorage.getItem('id_unidad');

  useEffect(() => {
    const fetchData = () => {
      try {
        if (unidadId) {
          // Obtener directamente la Promesa del dispatch
          const responsePromise = dispatch(getUsersByUnit(unidadId));

          // Esperar a que la Promesa se resuelva
          responsePromise.then((responseData) => {
            // Verificar si responseData es un array (los datos reales)
            if (Array.isArray(responseData)) {
              console.log('Datos de usuarios actualizados:', responseData);
              setLoading(false);
            } else if (responseData && responseData.error) {
              console.error('Error al obtener usuarios por unidad:', responseData.error);
              setLoading(false);
            } else {
              console.error('Respuesta de getUsersByUnit sin datos válidos:', responseData);
              setLoading(false);
            }
          });
        }
      } catch (error) {
        console.error('Error al obtener usuarios por unidad:', error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, unidadId]);

  const handleCloseModal = () => {
    const path = '/administrar-panel';
    dispatch(closeModalAndRedirect(path, navigate));
  };

  const handleEliminarInquilino = (rut) => {
    // Implementa la lógica de eliminación aquí
    console.log(`Eliminar inquilino con RUT: ${rut}`);
  };

  return (
    <Modal
      isOpen={isOpen ?? false}
      onRequestClose={handleCloseModal}
      contentLabel="EliminarInquilino Modal"
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
          <h2 className="form-titulo">Eliminar Inquilino</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="row g-3">
              {/* Filtra y muestra solo a los inquilinos */}
              {localUsersData && localUsersData.length > 0 ? (
                localUsersData
                  .filter((user) => user.id_perfil === 2)
                  .map((inquilino) => (
                    <div key={inquilino.id} className="col-md-12 mb-3">
                      <p>{`Nombre: ${inquilino.nombre}, Rut: ${inquilino.rut}`}</p>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleEliminarInquilino(inquilino.rut)}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
              ) : (
                <p>No hay inquilinos disponibles.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EliminarInquilino;












