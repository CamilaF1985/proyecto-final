import React from 'react';
import { useGeolocated } from 'react-geolocated';

// Componente funcional para mostrar un mapa de Google
const Mapa = () => {
  // Obtiene las coordenadas actuales del usuario utilizando el hook useGeolocated
  const { coords } = useGeolocated();
  // Clave de la API de Google Maps
  const apiKey = 'AIzaSyAZmMpwdOFx6kNgtzVo9ckmcJAnnxviLU4';

  // URL base para la incrustación del mapa de Google
  let mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}`;

  // Agrega las coordenadas del usuario al URL si están disponibles
  if (coords && coords.latitude && coords.longitude) {
    const { latitude, longitude } = coords;
    mapUrl += `&q=${latitude},${longitude}&zoom=15`;
  } else {
    // Agrega un valor de ejemplo si las coordenadas no están disponibles
    mapUrl += `&q=ExampleLocation&zoom=15`;
  }

  // Retorna un contenedor con un iframe que muestra el mapa de Google
  return (
    <div className="google-maps-iframe">
      <iframe
        title="Incrustación de Google Maps"
        width="100%"
        height="100%"
        style={{ border: '0' }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
      />
    </div>
  );
};

export default Mapa;








