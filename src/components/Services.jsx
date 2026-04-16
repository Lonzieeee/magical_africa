

 import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useAcademyNavigation from "../hooks/useAcademyNavigation";

import '../styles/services.css';

const Services = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();
   const goToAcademy = useAcademyNavigation();

  const services = [
    {
      title: t('services.learnLanguage.title'),
      description: t('services.learnLanguage.description'),
      image: "/images/Learn-Language3.jpg"
    },
    {
      title: t('services.exploreIdentity.title'),
      description: t('services.exploreIdentity.description'),
      image: "/images/explore-identity2.jpg"
    },
    {
      title: t('services.streamFolklore.title'),
      description: t('services.streamFolklore.description'),
      image: "/images/African-storytelling2.jpg"
    },
    {

      title: t('services.exploreCourses.title'),
      description: t('services.exploreCourses.description'),
      image: "/images/photorealistic-portrait-african-woman.jpg"
      
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const service = services[currentIndex];

    const navigate = useNavigate(); 
  
  
    const handleNavigation = (path) => {
      navigate(path);
    };
  


  return (
    <section className="services">
      <div className="services-heading">
        <h1>{t('services.heading')}</h1>
      </div>

      <div className="service-section">
        <div className="i">
          <i className="fa-solid fa-chevron-left" id="prev" onClick={handlePrev}></i>
        </div>

        <div className="service-wrap">
          <div className="wrap1" >
            <h1>{service.title}</h1>
            <p>{service.description}</p>
            <button className="learn-more" onClick={goToAcademy}>{t('services.learnMore')}</button>
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
          <span>{t('services.viewAll')}</span>
        </button>
      </div>
    </section>
  );
};

export default Services;