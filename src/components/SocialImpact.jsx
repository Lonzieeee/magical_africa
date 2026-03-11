
{/*
import '../styles/social-impact.css';

const SocialImpact = () => {
  return (
    <section className="social-impact">
      <div className="text">
        <h1>Our Social Impact</h1>
        <p>
          We believe in giving back to the communities that inspire us. Through our platform, we support local artisans, preserve cultural heritage, and create economic opportunities across Africa.
        </p>
        <span>
          Learn More <i className="fa-solid fa-arrow-right"></i>
        </span>
     
      </div>

      <div className="impacts">
        <div className="impact1">
          <div className="impact-text">
            <h1>Supporting Local Artisans</h1>
            <p>We connect local craftspeople directly with global markets, ensuring fair compensation for their work.</p>
            <button className="read-more">Read More</button>
          </div>
        </div>

        <div className="impact2">
          <div className="impact-text">
            <h1>Preserving Heritage</h1>
            <p>Our digital archive helps preserve endangered languages, traditions, and cultural practices for future generations.</p>
            <button className="read-more">Read More</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialImpact;
 */}

{/* 
 import { useTranslation } from 'react-i18next';
import '../styles/social-impact.css';

const SocialImpact = () => {
  const { t } = useTranslation();

  return (
    <section className="social-impact">
      <div className="text">
        <h1>{t('socialImpact.title')}</h1>
        <p>{t('socialImpact.description')}</p>
        <span>
          {t('socialImpact.learnMore')} <i className="fa-solid fa-arrow-right"></i>
        </span>
      </div>

      <div className="impacts">
        <div className="impact1">
          <div className="impact-text">
            <h1>{t('socialImpact.artisans.title')}</h1>
            <p>{t('socialImpact.artisans.description')}</p>
            <button className="read-more">{t('socialImpact.readMore')}</button>
          </div>
        </div>

        <div className="impact2">
          <div className="impact-text">
            <h1>{t('socialImpact.heritage.title')}</h1>
            <p>{t('socialImpact.heritage.description')}</p>
            <button className="read-more">{t('socialImpact.readMore')}</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialImpact;
*/}


import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../styles/social-impact.css';

const SocialImpact = () => {
  const { t } = useTranslation();
  const impactsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // ✅ Defined outside if/else so both blocks can access them
          const impact1 = entry.target.querySelector('.impact1');
          const impact2 = entry.target.querySelector('.impact2');

          if (entry.isIntersecting) {
            setTimeout(() => impact1?.classList.add('impact-visible'), 0);
            setTimeout(() => impact2?.classList.add('impact-visible'), 200);
          } else {
            impact1?.classList.remove('impact-visible');
            impact2?.classList.remove('impact-visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (impactsRef.current) observer.observe(impactsRef.current);
    return () => observer.disconnect();
  }, []);

    const navigate = useNavigate(); // 👈 1. create navigate
  
    // 👈 2. define the handler
    const handleNavigation = (path) => {
      navigate(path);
    };
  

  return (
    <section className="social-impact">
      <div className="text">
        <h1>{t('socialImpact.title')}</h1>
        <p>{t('socialImpact.description')}</p>
        <span onClick={()=> handleNavigation('/about')}>
          {t('socialImpact.learnMore')} <i className="fa-solid fa-arrow-right"></i>
        </span>
      </div>

      <div className="impacts" ref={impactsRef}>
        <div className="impact1">
          <div className="impact-text">
            <h1>{t('socialImpact.artisans.title')}</h1>
            <p>{t('socialImpact.artisans.description')}</p>
            <button className="read-more">{t('socialImpact.readMore')}</button>
          </div>
        </div>

        <div className="impact2">
          <div className="impact-text">
            <h1>{t('socialImpact.heritage.title')}</h1>
            <p>{t('socialImpact.heritage.description')}</p>
            <button className="read-more">{t('socialImpact.readMore')}</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialImpact;