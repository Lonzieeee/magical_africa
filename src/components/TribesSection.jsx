{/* 

import '../styles/tribes.css';

const TribesSection = () => {
  return (
    <section className="tribes">
      <h1>Explore Our Tribes</h1>
      <p>Journey through Africa's diverse tribes and timeless traditions</p>

      <div className="tribes-section">
        <div className="tribe1">
          <h1>Oromo</h1>
          <p>Rooted in Ethiopia, the Oromo people carry a proud legacy of tradition, unity, and cultural identity. They are the country's largest ethnic group, making up about one-third of the population with around 40 million people.</p>
        </div>

        <div className="tribe2">
          <h1>Zulu</h1>
          <p>From South Africa, the Zulu people carry a powerful legacy of tradition, resilience, and identity, representing over 11 million people.</p>
        </div>

        <div className="tribe3">
          <h1>Igbo</h1>
          <p>Rooted in Nigeria, the Igbo people are one of the country's largest ethnic groups, numbering over 30 million, known for their rich traditions, entrepreneurship, and strong communal values.</p>
        </div>
      </div>

      <div className="view-more2">
        <hr />
        <button className="show-btn3">
          <span>View All</span>
        </button>
       
      </div>
    </section>
  );
};

export default TribesSection;
*/}

{/*

import { useTranslation } from 'react-i18next';
import '../styles/tribes.css';

const TribesSection = () => {
  const { t } = useTranslation();

  return (
    <section className="tribes">
      <h1>{t('tribes.title')}</h1>
      <p>{t('tribes.subtitle')}</p>

      <div className="tribes-section">
        <div className="tribe1">
          <h1>{t('tribes.oromo.name')}</h1>
          <p>{t('tribes.oromo.description')}</p>
        </div>

        <div className="tribe2">
          <h1>{t('tribes.zulu.name')}</h1>
          <p>{t('tribes.zulu.description')}</p>
        </div>

        <div className="tribe3">
          <h1>{t('tribes.igbo.name')}</h1>
          <p>{t('tribes.igbo.description')}</p>
        </div>
      </div>

      <div className="view-more2">
        <hr />
        <button className="show-btn3">
          <span>{t('tribes.viewAll')}</span>
        </button>
      </div>
    </section>
  );
};

export default TribesSection;
 */}


 import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../styles/tribes.css';

const TribesSection = () => {
  const { t } = useTranslation();
  const tribesRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const tribes = entry.target.querySelectorAll('.tribe1, .tribe2, .tribe3');

          if (entry.isIntersecting) {
            tribes.forEach((tribe, index) => {
              setTimeout(() => {
                tribe.classList.add('tribe-visible');
              }, index * 200);
            });
          } else {
            tribes.forEach((tribe) => {
              tribe.classList.remove('tribe-visible');
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (tribesRef.current) observer.observe(tribesRef.current);
    return () => observer.disconnect();
  }, []);

    const navigate = useNavigate(); // 👈 1. create navigate
  
    // 👈 2. define the handler
    const handleNavigation = (path) => {
      navigate(path);
    };
  

  return (
    <section className="tribes">
      <h1>{t('tribes.title')}</h1>
      <p>{t('tribes.subtitle')}</p>

      <div className="tribes-section" ref={tribesRef}>
        <div className="tribe1">
          <h1>{t('tribes.oromo.name')}</h1>
          <p>{t('tribes.oromo.description')}</p>
        </div>

        <div className="tribe2">
          <h1>{t('tribes.zulu.name')}</h1>
          <p>{t('tribes.zulu.description')}</p>
        </div>

        <div className="tribe3">
          <h1>{t('tribes.igbo.name')}</h1>
          <p>{t('tribes.igbo.description')}</p>
        </div>
      </div>

      <div className="view-more2">
        <hr />
        <button className="show-btn3" onClick={()=> handleNavigation('/tribes')}>
          <span>{t('tribes.viewAll')}</span>
        </button>
      </div>
    </section>
  );
};

export default TribesSection;