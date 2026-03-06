
{/* 
import '../styles/partners.css';

const Partners = () => {
  return (
    <section className="partners">


        <div className="partners-boxes">
        <div className="box1">
          <img src="/images/aws.webp" alt="Partner 1" />
        </div>
        <div className="box2">
          <img src="/images/kuLogo.webp" alt="Partner 2" />
        </div>
      </div>
      
      <div className="partners-text">
        <h1>Our Partners</h1>
        <p>
          We collaborate with organizations that share our vision of preserving and celebrating African culture. Together, we're making a bigger impact.
        </p>
      </div>

      

      <div className="partners-text2">
        <h1>Our Partners</h1>
        <p>
          We collaborate with organizations that share our vision of preserving and celebrating African culture. Together, we're making a bigger impact.
        </p>
      </div>

     
    </section>
  );
};

export default Partners;
*/}


{/* 
import { useTranslation } from 'react-i18next';
import '../styles/partners.css';

const Partners = () => {
  const { t } = useTranslation();

  return (
    <section className="partners">
      <div className="partners-boxes">
        <div className="box1">
          <img src="/images/aws.webp" alt="Partner 1" />
        </div>
        <div className="box2">
          <img src="/images/kuLogo.webp" alt="Partner 2" />
        </div>
      </div>
      
      <div className="partners-text">
        <h1>{t('partners.title')}</h1>
        <p>{t('partners.description')}</p>
      </div>

      <div className="partners-text2">
        <h1>{t('partners.title')}</h1>
        <p>{t('partners.description')}</p>
      </div>
    </section>
  );
};

export default Partners;

*/}


import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/partners.css';

const Partners = () => {
  const { t } = useTranslation();
  const partnersRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelector('.partners-boxes')?.classList.add('slide-in-left');
            entry.target.querySelector('.partners-text')?.classList.add('slide-in-right');
            entry.target.querySelector('.partners-text2')?.classList.add('slide-in-right');
          }
          else {
  entry.target.querySelector('.partners-boxes')?.classList.remove('slide-in-left');
  entry.target.querySelector('.partners-text')?.classList.remove('slide-in-right');
  entry.target.querySelector('.partners-text2')?.classList.remove('slide-in-right');
}
        });
      },
      { threshold: 0.2 }
    );

    if (partnersRef.current) observer.observe(partnersRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="partners" ref={partnersRef}>
      <div className="partners-boxes">
        <div className="box1">
          <img src="/images/aws.webp" alt="Partner 1" />
        </div>
        <div className="box2">
          <img src="/images/kuLogo.webp" alt="Partner 2" />
        </div>
      </div>

      <div className="partners-text">
        <h1>{t('partners.title')}</h1>
        <p>{t('partners.description')}</p>
      </div>

      <div className="partners-text2">
        <h1>{t('partners.title')}</h1>
        <p>{t('partners.description')}</p>
      </div>
    </section>
  );
};

export default Partners;