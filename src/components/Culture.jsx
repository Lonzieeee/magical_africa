


{/* 
import React, { useEffect, useRef } from 'react'
import '../styles/culture-page.css'

const Culture = () => {
  const cardsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cards = entry.target.querySelectorAll('.culture-section2-a, .culture-section2-b, .culture-section2-c');
          if (entry.isIntersecting) {
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('card-visible');
              }, index * 200);
            });
          } else {
            cards.forEach((card) => card.classList.remove('card-visible'));
          }
        });
      },
      { threshold: 0.2 }
    );

    if (cardsRef.current) observer.observe(cardsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className='culture-section'>

        <div className='culture-section1'>

          <div className='culture-section-heading'>
            <hr />
            <h3>Celebrate the Continent</h3>
          </div>

          <h1>African <span>Cultural</span> Events</h1>

          <p>
            African cultural events celebrate heritage by uniting communities through music, dance, art, food, and storytelling — honoring tradition while embracing modern African identity.
          </p>

        </div>

        <div className='culture-section2' ref={cardsRef}>

        
          <div className='culture-section2-a'>
            <div className='card-icon'>🎵</div>
            <h2><span className='card-title-accent'>Music</span> Festivals</h2>
            <div className='card-divider card-divider-orange' />

            <div className='festivals-list'>

           

           <div className='festivals-info'>
           
           <h4>Afropolis Music Festival</h4>
           <p>📍 Lagos, Nigeria</p>
           <hr />


           </div>

           <div className='festivals-info'>
           
           <h4>Sauti za Busara</h4>
           <p>📍 Zanzibar, Tanzania</p>
           <hr />


           </div>
           <div className='festivals-info'>
           
           <h4>Bushfire Festival</h4>
           <p>📍 Malkerns, Eswatini</p>
           <hr />


           </div>

            </div>
            
          </div>

         
          <div className='culture-section2-b'>
            <div className='card-icon card-icon-orange'>🍲</div>
            <h2>Food & <span className='card-title-block'>Cultural Festivals</span></h2>
            <div className='card-divider card-divider-white' />

             <div className='festivals-list'>

           

           <div className='festivals-info2'>
           
           <h4>Cape Town Food & Wine Festival</h4>
           <p>📍 Cape Town, SA</p>
           <hr />


           </div>

           <div className='festivals-info2'>
           
           <h4>Nairobi Food Festival</h4>
           <p>📍 Nairobi, Kenya</p>
           <hr />


           </div>
           <div className='festivals-info2'>
           
           <h4>Zanzibar Cultural Festival</h4>
           <p>📍 Zanzibar, Tanzania</p>
           <hr />


           </div>

            </div>

            
          </div>

          
          <div className='culture-section2-c'>
            <div className='card-icon'>🎨</div>
            <h2>Art and <span className='card-title-accent'>Craft Fairs</span></h2>
            <div className='card-divider card-divider-orange' />


             <div className='festivals-list'>

           

           <div className='festivals-info'>
           
           <h4>Accra Art Week</h4>
           <p>📍 Accra, Ghana</p>
           <hr className='art-hr' />


           </div>

           <div className='festivals-info'>
           
           <h4>Kigali Art Exhibition</h4>
           <p>📍 Kigali, Rwanda</p>
           <hr className='art-hr' />


           </div>
           <div className='festivals-info'>
           
           <h4>African Craft Market</h4>
           <p>📍 Pan-Africa</p>
           <hr  className='art-hr'/>


           </div>

            </div>
          
          </div>

        </div>

        <div className='culture-page-button'>
          <button>Learn More</button>
        </div>

      </div>
    </>
  )
}

export default Culture

*/}
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next';
import '../styles/culture-page.css'
import { useNavigate } from 'react-router-dom';

const Culture = () => {
  const { t } = useTranslation();
  const cardsRef = useRef(null);
   const navigate = useNavigate(); // 👈 1. create navigate
      
        // 👈 2. define the handler
        const handleNavigation = (path) => {
          navigate(path);
        };
  

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cards = entry.target.querySelectorAll('.culture-section2-a, .culture-section2-b, .culture-section2-c');
          if (entry.isIntersecting) {
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('card-visible');
              }, index * 200);
            });
          } else {
            cards.forEach((card) => card.classList.remove('card-visible'));
          }
        });
      },
      { threshold: 0.2 }
    );

    if (cardsRef.current) observer.observe(cardsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className='culture-section'>

        <div className='culture-section1'>

          <div className='culture-section-heading'>
            <hr />
            <h3>{t('culture.tagline')}</h3>
          </div>

          <h1>{t('culture.titleStart')} <span>{t('culture.titleAccent')}</span> {t('culture.titleEnd')}</h1>

          <p>{t('culture.description')}</p>

        </div>

        <div className='culture-section2' ref={cardsRef}>

          {/* Card A - Music */}
          <div className='culture-section2-a'>
            <div className='card-icon'>🎵</div>
            <h2><span className='card-title-accent'>{t('culture.music.titleAccent')}</span> {t('culture.music.titleRest')}</h2>
            <div className='card-divider card-divider-orange' />

            <div className='festivals-list'>

              <div className='festivals-info'>
                <h4>{t('culture.music.festival1.name')}</h4>
                <p>📍 {t('culture.music.festival1.location')}</p>
                <hr />
              </div>

              <div className='festivals-info'>
                <h4>{t('culture.music.festival2.name')}</h4>
                <p>📍 {t('culture.music.festival2.location')}</p>
                <hr />
              </div>

              <div className='festivals-info'>
                <h4>{t('culture.music.festival3.name')}</h4>
                <p>📍 {t('culture.music.festival3.location')}</p>
                <hr />
              </div>

            </div>
          </div>

          {/* Card B - Food & Culture */}
          <div className='culture-section2-b'>
            <div className='card-icon card-icon-orange'>🍲</div>
            <h2>{t('culture.food.titleStart')} <span className='card-title-block'>{t('culture.food.titleAccent')}</span></h2>
            <div className='card-divider card-divider-white' />

            <div className='festivals-list'>

              <div className='festivals-info2'>
                <h4>{t('culture.food.festival1.name')}</h4>
                <p>📍 {t('culture.food.festival1.location')}</p>
                <hr />
              </div>

              <div className='festivals-info2'>
                <h4>{t('culture.food.festival2.name')}</h4>
                <p>📍 {t('culture.food.festival2.location')}</p>
                <hr />
              </div>

              <div className='festivals-info2'>
                <h4>{t('culture.food.festival3.name')}</h4>
                <p>📍 {t('culture.food.festival3.location')}</p>
                <hr />
              </div>

            </div>
          </div>

          {/* Card C - Art & Crafts */}
          <div className='culture-section2-c'>
            <div className='card-icon'>🎨</div>
            <h2>{t('culture.art.titleStart')} <span className='card-title-accent'>{t('culture.art.titleAccent')}</span></h2>
            <div className='card-divider card-divider-orange' />

            <div className='festivals-list'>

              <div className='festivals-info'>
                <h4>{t('culture.art.festival1.name')}</h4>
                <p>📍 {t('culture.art.festival1.location')}</p>
                <hr className='art-hr' />
              </div>

              <div className='festivals-info'>
                <h4>{t('culture.art.festival2.name')}</h4>
                <p>📍 {t('culture.art.festival2.location')}</p>
                <hr className='art-hr' />
              </div>

              <div className='festivals-info'>
                <h4>{t('culture.art.festival3.name')}</h4>
                <p>📍 {t('culture.art.festival3.location')}</p>
                <hr className='art-hr' />
              </div>

            </div>
          </div>

        </div>

        <div className='culture-page-button' onClick={()=> handleNavigation('/events')}>
          <button>{t('culture.learnMore')}</button>
        </div>

      </div>
    </>
  )
}

export default Culture


