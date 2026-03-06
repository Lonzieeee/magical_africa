
{/*
import React from 'react'
import '../styles/culture-page.css'

const Culture = () => {
  return (


    <div className='culture-page'>


      <h1 className='culture-page-heading'>African Cultural Events</h1>

      <p className='culture-page-para'>

        African cultural events celebrate heritage by uniting communities through music, dance, art, food, and storytelling, honoring tradition while embracing modern African identity.
      </p>



      <div className='culture-cards'>

        <div className='culture-card1'>
         <h1>
         <span>Music</span>  festivals
         </h1>

         <ul className='culture-list'>
            <li>Afropolis Music Festival</li>
            <li>Lagos Jazz Series</li>
            <li>Sauti za Busara</li>
            <li>Bushfire Festival</li>
            <li>Fiesta de la Música</li>
          </ul>

        
        </div>

        <div className='culture-card2'>
          <h1>
            Food & <span>Cultural festivals</span>
          </h1>

           <ul className='culture-list'>
            <li>Cape Town Food & Wine Festival</li>
            <li>Nairobi Food Festival</li>
            <li>Chale Wote Street Art Festival</li>
            <li>Zanzibar Cultural Festival</li>
            <li>Festival sur le Niger</li>
          </ul>
        </div>

        <div className='culture-card3'>

          <h1>
            Art and Craft fairs
          </h1>

           <ul className='culture-list'>
            <li>Kigali Art Exhibition</li>
            <li>African Craft Market</li>
            <li>Dakar Biennale</li>
            <li>Zimbabwe International Trade Fair</li>
            <li>Accra Art Week</li>
          </ul>

        </div>



      </div>


      <div className='culture-page-button'>
  
      <button>
        Learn More
      </button>

      </div>





    </div>
  )
}

export default Culture

 */}


 import React, { useEffect, useRef } from 'react'
import '../styles/culture-page.css'

const Culture = () => {
  const cardsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // ✅ cards defined OUTSIDE if/else so both blocks can access it
          const cards = entry.target.querySelectorAll('.culture-card1, .culture-card2, .culture-card3');

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
    <div className='culture-page'>
      <h1 className='culture-page-heading'>African Cultural Events</h1>
      <p className='culture-page-para'>
        African cultural events celebrate heritage by uniting communities through music, dance, art, food, and storytelling, honoring tradition while embracing modern African identity.
      </p>

      <div className='culture-cards' ref={cardsRef}>

        <div className='culture-card1'>
          <h1><span>Music</span> festivals</h1>
          <ul className='culture-list'>
            <li>Afropolis Music Festival</li>
            <li>Lagos Jazz Series</li>
            <li>Sauti za Busara</li>
            <li>Bushfire Festival</li>
            <li>Fiesta de la Música</li>
          </ul>
        </div>

        <div className='culture-card2'>
          <h1>Food & <span>Cultural festivals</span></h1>
          <ul className='culture-list'>
            <li>Cape Town Food & Wine Festival</li>
            <li>Nairobi Food Festival</li>
            <li>Chale Wote Street Art Festival</li>
            <li>Zanzibar Cultural Festival</li>
            <li>Festival sur le Niger</li>
          </ul>
        </div>

        <div className='culture-card3'>
          <h1>Art and Craft fairs</h1>
          <ul className='culture-list'>
            <li>Kigali Art Exhibition</li>
            <li>African Craft Market</li>
            <li>Dakar Biennale</li>
            <li>Zimbabwe International Trade Fair</li>
            <li>Accra Art Week</li>
          </ul>
        </div>

      </div>

      <div className='culture-page-button'>
        <button>Learn More</button>
      </div>
    </div>
  );
}

export default Culture