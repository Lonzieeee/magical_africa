

{/* 
import React from 'react'
import '../styles/culture-card.css';

const CultureCard = () => {
  return (
    <>

  <div className='culture-card'>
    <div>

  <h1>Phrases </h1>
  

   <div className='phrase'>

    <p>

     Proverb of the day: <span> <span className='dot'></span>Curiosity killed the cat</span>

    
    </p>

    <p>
      Description: <span><span className='dot'></span>An expression suggesting that curiosity, when unchecked, can lead one into risky or dangerous situations.</span>
    </p>

    <p>Teaching: <span><span className='dot'>

    </span>
       some questions or actions can lead to trouble.
      </span></p>
   
    </div>
    </div>



    <div className='music'>

    </div>


    <div className='events'>

    </div>

  </div>

    </>
  )
}

export default CultureCard
*/}

import React, { useState } from 'react'
import '../styles/culture-card.css';

const CultureCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className='culture-card'>

      {/* SLIDER */}
      <div
        className="slider"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {/* SECTION 1 */}
        <div className='slide'>
          <h1>Phrases</h1>

          <div className='phrase'>
            <p>
              Proverb of the day:
              <span><span className='dot'></span>Curiosity killed the cat</span>
            </p>

            <p>
              Description:
              <span><span className='dot'></span>
                An expression suggesting that curiosity, when unchecked, can lead one into risky or dangerous situations.
              </span>
            </p>

            <p>
              Teaching:
              <span><span className='dot'></span>
                Some questions or actions can lead to trouble.
              </span>
            </p>
          </div>
        </div>

        {/* SECTION 2 */}
        <div className='slide slide2'>
          <h1>Cultural Music</h1>
        </div>

        {/* SECTION 3 */}
        <div className='slide'>
          <h1>Cultural Events</h1>
        </div>
      </div>

      {/* DOTS */}
      <div className="nav-dots">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`nav-dot ${activeIndex === i ? 'active' : ''}`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>

    </div>
  )
}

export default CultureCard;






