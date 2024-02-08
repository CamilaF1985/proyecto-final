import React from 'react';
import carrousel1 from '../assets/img/carrousel 1.png';
import carrousel2 from '../assets/img/carrousel 2.png';
import carrousel3 from '../assets/img/carrousel 3.png';
import carrousel4 from '../assets/img/carrousel 4.png';
import carrousel5 from '../assets/img/carrousel 5.png';
import carrousel6 from '../assets/img/carrousel 6.png';
import carrousel7 from '../assets/img/carrousel 7.png';
import carrousel8 from '../assets/img/carrousel 8.png';

function ImageCarousel() {
  return (
    <div id="carouselExampleControls" className="carousel slide me-5" data-bs-ride="carousel" data-bs-interval="3000">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <div className="row carousel-row">
            <div className="col-md-4 col-12">
              <img src={carrousel1} className="d-block w-100" alt="Slide 1" />
            </div>
            <div className="col-md-4 col-12">
              <img src={carrousel2} className="d-block w-100" alt="Slide 2" />
            </div>
            <div className="col-md-4 col-12">
              <img src={carrousel3} className="d-block w-100" alt="Slide 3" />
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <div className="row carousel-row">
            <div className="col-md-4 col-12">
              <img src={carrousel4} className="d-block w-100" alt="Slide 4" />
            </div>
            <div className="col-md-4 col-12">
              <img src={carrousel5} className="d-block w-100" alt="Slide 5" />
            </div>
            <div className="col-md-4 col-12">
              <img src={carrousel6} className="d-block w-100" alt="Slide 6" />
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <div className="row carousel-row">
            <div className="col-md-4 col-12">
              <img src={carrousel7} className="d-block w-100" alt="Slide 7" />
            </div>
            <div className="col-md-4 col-12">
              <img src={carrousel8} className="d-block w-100" alt="Slide 8" />
            </div>
            <div className="col-md-4 col-12">
              <img src={carrousel1} className="d-block w-100" alt="Slide 1" />
            </div>
          </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default ImageCarousel;





