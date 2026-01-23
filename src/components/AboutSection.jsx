
{/* 
import { useNavigate } from 'react-router-dom';
import '../styles/about.css';

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <section className="about-section">
      <h1>About Magical Africa</h1>

      <p>
        Magical Africa celebrates the beauty, culture, and stories of Africa. We showcase the continent's rich traditions, diverse landscapes, and vibrant spirit, sharing what makes Africa truly magical.
      </p>

      <button className="learn-more2" onClick={() => navigate('/about')}>
        Learn More
      </button>
    </section>
  );
};

export default AboutSection;
*/}

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/about.css';

const AboutSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="about-section">
      <h1>{t('about2.title')}</h1>

      <p>{t('about2.description')}</p>

      <button className="learn-more2" onClick={() => navigate('/about')}>
        {t('about2.learnMore')}
      </button>
    </section>
  );
};

export default AboutSection;
