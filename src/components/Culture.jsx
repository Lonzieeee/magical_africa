



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

          {/* Card A - Music */}
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

          {/* Card B - Food & Culture */}
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

          {/* Card C - Art & Crafts */}
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