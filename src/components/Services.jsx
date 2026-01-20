import { useState } from 'react';
import '../styles/services.css';

const services = [
  {
    title: "Learn Language",
    description: "Discover the beauty of African languages and connect with diverse cultures across the continent.",
    image: "/images/Learn-Language2.jpg"
  },
  {
    title: "Explore identity and tradition",
    description: "Uncover the journeys and movements that formed Africa's diverse cultures and united its people through time.",
    image: "/images/explore-identity.jpg"
  },
  {
    title: "Stream folklore, music, and storytelling",
    description: "Uncover the roots of African identity and the timeless traditions passed through generations.",
    image: "/images/African-storytelling.jpg"
  }
];

const Services = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const service = services[currentIndex];

  return (
    <section className="services">
      <div className="services-heading">
        <h1>Explore The Magic Behind Our culture</h1>
      </div>

      <div className="service-section">
        <div className="i">
          <i className="fa-solid fa-chevron-left" id="prev" onClick={handlePrev}></i>
        </div>

        <div className="service-wrap">
          <div className="wrap1">
            <h1>{service.title}</h1>
            <p>{service.description}</p>
            <button className="learn-more">Learn More</button>
          </div>

          <div 
            className="wrap2" 
            style={{ backgroundImage: `url(${service.image})` }}
          ></div>
        </div>

        <div className="i">
          <i className="fa-solid fa-chevron-right" id="next" onClick={handleNext}></i>
        </div>
      </div>

      <div className="show-all">
        <hr />
        <button className="show-btn">
          <span>View All</span>
        </button>
      </div>
    </section>
  );
};

export default Services;
