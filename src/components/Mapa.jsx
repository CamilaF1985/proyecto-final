import React, { useRef, useEffect } from 'react';

const Mapa = () => {
  const iframeRef = useRef(null);

  const loadMap = () => {
    const location = {
      latitude: -33.374064,
      longitude: -70.503642,
    };

    const apiKey = 'AIzaSyAZmMpwdOFx6kNgtzVo9ckmcJAnnxviLU4';

    let mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}`;
    mapUrl += `&q=${location.latitude},${location.longitude}&zoom=15`;

    if (iframeRef.current) {
      iframeRef.current.src = mapUrl;
    }
  };

  useEffect(() => {
    // Cargar el mapa cuando el componente se monta
    loadMap();
  }, []);

  return (
    <div className="google-maps-iframe">
      <iframe
        title="Incrustación de Google Maps"
        width="100%"
        height="100%"
        style={{ border: '0' }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        ref={iframeRef}
      />
    </div>
  );
};

export default Mapa;
























