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
          <h1><i class="fa-solid fa-lightbulb"></i>Phrases</h1>

          <div className='phrase'>
            <p>  
              <p className='phrase-head'> <i class="fa-solid fa-check"></i>Proverb of the day:</p>
              <span>Curiosity killed the cat</span>
            </p>

            <p> 
              <p className='phrase-head'> <i class="fa-solid fa-check"></i>Description:</p>
              <span>
                An expression suggesting that curiosity, when unchecked, can lead one into risky or dangerous situations.
              </span>
            </p>

            <p> 
              <p className='phrase-head'> <i class="fa-solid fa-check"></i>Teaching:</p>
              <span>
                Some questions or actions can lead to trouble.
              </span>
            </p>
          </div>

          <button className='get-more'>Learn More</button>
        </div>

        {/* SECTION 2 */}
        <div className='slide'>
          <h1> <i class="fa-solid fa-music"></i> Cultural Music</h1>

          <p className='music-text'>African music is one of the world's oldest traditions, deeply woven into community life through ceremonies, celebrations, storytelling, dance, and spiritual practices.</p> 

          <p className='some-music'>Popular <span>Music Genres</span></p>

          <div className='music-genres'>
            <span>Djembe Music <p></p></span>
            <span>Maasai chants <p></p></span>
            <span>Isicathamiya <p></p></span>
            <span>Benga music <p></p></span>
          </div>

          <p className='listen-music'>Listen to African Music</p>

          <div className='audio'>
            <div className='audio-item'>
              <p className='audio-title'>Traditional Djembe Rhythms</p>
              <audio controls className='audio-player'>
                <source src="/audio/djembe-rhythm.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>

            <div className='audio-item'>
              <p className='audio-title'>Contemporary Afrobeat</p>
              <audio controls className='audio-player'>
                <source src="/audio/afrobeat.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
             <p className='see-more2'>Learn More <i class="fa-solid fa-arrow-right"></i></p>
          
        </div>

        {/* SECTION 3 */}
        <div className='slide'>
          <h1> <i class="fa-solid fa-masks-theater"></i>Cultural Events</h1>

          <p className='event-text'>
            African cultural events celebrate heritage by uniting communities through music, dance, art, food, and storytelling, honoring tradition while embracing modern African identity.
          </p>



          <div className='event'>

           <span className='event-head'> 🎪 <p>Annual Heritage Festival</p></span> 

           <span className='date-span'>📅 <p>July 2026</p></span>

           <p className='event-description'>A week-long celebration featuring traditional dance performances, drum circles, art exhibitions, and authentic African cuisine from across the continent.</p>

           <div className='event-buttons'>
            <div className='event-type'>
            <button>Music</button>
            <button>Dance</button>
            <button>Food</button>
            </div>

            <button className='book-event'>Book Now</button>
           </div>

          

          </div>
           <p className='see-more'>See More <i class="fa-solid fa-arrow-right"></i></p>
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