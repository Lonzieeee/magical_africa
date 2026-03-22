
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


    const navigate = useNavigate();
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