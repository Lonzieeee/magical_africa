{/* 

import React from 'react'
import Events from '../pages/Events'
import '../styles/music-dance.css'

const MusicDance = () => {
  return (
    <>
   
 <div className='music-div'>

<div className='music-wrapper'>

<div className='wrapper1'>

</div>


<div className='wrapper2'>

  <h1>Sauti za Busara - Zanzibar Music Festival</h1>

  <p>
    Africa's most beloved Swahili music celebration, held within the ancient stone walls of Zanzibar's Old Fort. Four days of hypnotic taarab, bongo flava, and Afro-fusion under Indian Ocean stars.
  </p>


   <ul>

    <li> <span>📍</span>Zanzibar, Tanzania</li>
    <li> <span>
    📅</span>February</li>
    <li> <span>🎫</span>4 Days</li>

   </ul>

   <div className='book-event'>

    <button>Book Now</button>

   </div>

</div>


</div>



<div className='music-dots'>

  <span></span>
  <span></span>
  <span></span>

</div>


 </div>
   
    </>
  )
}

export default MusicDance

*/}


import React, { useState, useEffect } from 'react'
import '../styles/music-dance.css'

const slides = [
  {
    image: '/images/Oromo.jpg',
    title: 'Sauti za Busara — Zanzibar Music Festival',
    description:
      "Africa's most beloved Swahili music celebration, held within the ancient stone walls of Zanzibar's Old Fort. Four days of hypnotic taarab, bongo flava, and Afro-fusion under Indian Ocean stars.",
    location: 'Zanzibar, Tanzania',
    date: 'February',
    duration: '4 Days',
  },
  {
    image: '/images/Igbo.jpg',
    title: 'Gnaoua World Music Festival',
    description:
      "Ancient Gnaoua spiritual music fuses with jazz, blues, and world rhythms in Essaouira's windswept Atlantic squares. One of Morocco's most iconic cultural celebrations.",
    location: 'Essaouira, Morocco',
    date: 'June',
    duration: '4 Days',
  },
  {
    image: '/images/side-view-people-garage-sale.jpg',
    title: 'Bushfire Festival',
    description:
      'An extraordinary gathering of African artists, activists, and performers in the Kingdom of Eswatini. Music, storytelling, and community spirit blended in one breathtaking mountain setting.',
    location: 'Malkerns, Eswatini',
    date: 'May',
    duration: '3 Days',
  },
]

const MusicDance = () => {
  const [current, setCurrent] = useState(0)

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className='music-div'>

      {/* Slider track */}
      <div className='music-slider'>
        <div
          className='music-track'
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div className='music-wrapper' key={i}>

              <div
                className='wrapper1'
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              <div className='wrapper2'>
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>

                <ul>
                  <li><span>📍</span>{slide.location}</li>
                  <li><span>📅</span>{slide.date}</li>
                  <li><span>🎫</span>{slide.duration}</li>
                </ul>

                <div className='book-event'>
                  <button>Book Now</button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Dot navigation */}
      <div className='music-dots'>
        {slides.map((_, i) => (
          <span
            key={i}
            className={i === current ? 'active' : ''}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

    </div>
  )
}

export default MusicDance