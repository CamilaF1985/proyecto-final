import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const CronometroSesion = () => {
  const [tiempoRestante, setTiempoRestante] = useState(null);

  // Función para mostrar la advertencia con SweetAlert2
  const mostrarAdvertencia = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Su sesión expirará en 2 minutos. Por favor, guarde su trabajo.',
    });
  };

  // Función auxiliar para formatear el tiempo
  const formatearTiempo = (valor) => {
    return valor < 10 ? `0${valor}` : valor;
  };

  // Función para calcular el tiempo restante
  const calcularTiempoRestante = () => {
    const expirationTimestamp = sessionStorage.getItem('tokenExpiration');
    if (!expirationTimestamp) {
      setTiempoRestante(null);
      return;
    }

    const currentTimestamp = new Date().getTime();
    const tiempoRestanteMs = Math.max(0, parseInt(expirationTimestamp, 10) - currentTimestamp);

    // Calcular minutos y segundos
    const minutos = Math.floor(tiempoRestanteMs / (60 * 1000));
    const segundos = Math.floor((tiempoRestanteMs % (60 * 1000)) / 1000);

    // Mostrar advertencia cuando queden 2 minutos
    if (minutos === 2 && segundos === 0) {
      mostrarAdvertencia();
    }

    // Formatear el tiempo restante en minutos:segundos
    const tiempoRestanteFormateado = `${formatearTiempo(minutos)}:${formatearTiempo(segundos)}`;

    setTiempoRestante(tiempoRestanteFormateado);
  };

  useEffect(() => {
    // Calcular el tiempo restante al montar el componente
    calcularTiempoRestante();

    // Actualizar el tiempo restante cada segundo
    const intervalId = setInterval(calcularTiempoRestante, 1000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="cronometro-container text-end">
      {tiempoRestante !== null && (
        <p><strong>La sesión expirará en {tiempoRestante}</strong></p>
      )}
    </div>
  );
};

export default CronometroSesion;



