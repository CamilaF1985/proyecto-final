import React from 'react';

const Mapa = () => {
  return (
    <div className="google-maps-iframe" style={{ height: '300px' }}>
      <iframe
        title="Incrustación de Google Maps"
        width="100%"
        height="100%"
        style={{ border: '0' }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/place?q=-33.374064%2C-70.503642&key=AIzaSyAZmMpwdOFx6kNgtzVo9ckmcJAnnxviLU4"
      />
    </div>
  );
};

export default Mapa;
































