import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Helmet } from 'react-helmet-async';
import '../styles/events.css'
import MusicDance from '../components/MusicDance';
import Ceremonies from '../components/Ceremonies';
import Foods from '../components/Foods';
import Footer from '../components/Footer'
import '../styles/month.css'

const Events = () => {

  const [activeIndex, setActiveIndex] = useState(1);
  
  const [janClicked, setJanClicked] = useState(false);
  const monthEventRef = useRef(null);

  const handleJanClick = () => {
    setJanClicked(true);
    setTimeout(() => {
      monthEventRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };


/*  
      useEffect(() => {
      document.title = ' Discover African Cultural Events';
    }, []);

 */

    

  return (
    <>


    <Helmet>
  <title>African Cultural Events — Discover & Celebrate Africa</title>
  <meta name="description" content="Discover and attend authentic African cultural events happening across the continent and around the world. Celebrate African music, art, food, dance and traditions." />
  <meta name="keywords" content="African events, African cultural events, African festivals, African music events, African art events, African dance, celebrate Africa" />
  <meta property="og:title" content="African Cultural Events — Discover & Celebrate Africa" />
  <meta property="og:description" content="Discover authentic African cultural events happening across the continent and around the world." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://yourwebsite.com/events" />
</Helmet>

      <div className='events-hero'>

         <video
    autoPlay
    muted
    loop
    playsInline
    className="events-hero-video"
    src="/images/afrcan-events-video.mp4"
  />
        <Navbar />
        <div className='events-hero-text'>
          <h1>African <span>Cultural Events</span></h1>
          <p>From thundering drum festivals on the Sahel to glittering masquerade nights in lagos - dive into the living hearbeat of the continent</p>
        </div>
      </div>

      <div className='events-div'>
        <div className='events-div1'>
          <hr />
          <h1>Explore Events</h1>
        </div>

        <div className='event-lists'>
          <ul>
            <li className={activeIndex === 1 ? "active" : ""} onClick={() => setActiveIndex(1)}>
              <span>1</span>Music and Dance
            </li>
            <li className={activeIndex === 2 ? "active" : ""} onClick={() => setActiveIndex(2)}>
              <span>2</span>Traditional Ceremonies
            </li>
            <li className={activeIndex === 3 ? "active" : ""} onClick={() => setActiveIndex(3)}>
              <span>3</span>Food Festivals
            </li>
            <li className={activeIndex === 4 ? "active" : ""} onClick={() => setActiveIndex(4)}>
              <span>4</span>Art and Craft
            </li>
            <li className={activeIndex === 5 ? "active" : ""} onClick={() => setActiveIndex(5)}>
              <span>5</span>Film and Theatre
            </li>
          </ul>
        </div>

        {activeIndex === 1 && <MusicDance />}
        {activeIndex === 2 && <Ceremonies />}
        {activeIndex === 3 && <Foods />}
      </div>

      <div className='event-month'>

        <h1>Find Events by Month</h1>
        <p className='event-month-p'>Browse African cultural events happening throughout the year</p>

        <div className='months'>

          {/* JANUARY — has the click handler */}
         <div
  className={`jan ${janClicked ? 'month-active' : ''}`}
  onClick={handleJanClick}
  style={{ cursor: 'pointer' }}
>
  <h1>January</h1>
  <p>2 Events</p>
</div>

          <div className='feb'>
            <h1>February</h1>
            <p>3 Events</p>
          </div>
          <div className='march'>
            <h1>March</h1>
            <p>1 Event</p>
          </div>
          <div className='april'>
            <h1>April</h1>
            <p>4 Events</p>
          </div>
        </div>

        <div className='months2'>
          <div className='jan'>
            <h1>May</h1>
            <p>0 Events</p>
          </div>
          <div className='feb'>
            <h1>June</h1>
            <p>2 Events</p>
          </div>
          <div className='march'>
            <h1>July</h1>
            <p>5 Events</p>
          </div>
          <div className='april'>
            <h1>August</h1>
            <p>3 Events</p>
          </div>
        </div>

        <div className='months2'>
          <div className='jan'>
            <h1>September</h1>
            <p>1 Event</p>
          </div>
          <div className='feb'>
            <h1>October</h1>
            <p>4 Events</p>
          </div>
          <div className='march'>
            <h1>November</h1>
            <p>3 Events</p>
          </div>
          <div className='april'>
            <h1>December</h1>
            <p>6 Events</p>
          </div>
        </div>

        <div className='click-here'>

          <p className='click-here-p'>
            👆 Select a month above to see events
          </p>

        </div>

        {/* EVENTS — only show after January is clicked */}
        <div className='month-event' ref={monthEventRef}>

          {janClicked && (
            <>
              <h1 className='jan-heading month-ev-slideup month-ev-delay-1'>Events in January</h1>

              <div className='jan-events'>
                <div className='jan-event1 month-ev-slideup month-ev-delay-2'>
                  <h2>Music · Southern Africa</h2>
                  <h1>Bushfire Festival</h1>
                  <p>
                    An extraordinary gathering of African artists and performers in the Kingdom of Eswatini. Music, storytelling, and community spirit in one mountain setting.
                  </p>

                  <hr />
                  <div className='jan-event-location'>
                    <p>📍 Malkerns, Eswatini</p>
                    <button>Book Now</button>
                  </div>
                </div>

                <div className='jan-event2 month-ev-slideup month-ev-delay-3'>
                  <h2>Ceremony · West Africa</h2>
                  <h1>Odwira Festival</h1>
                  <p>
                    The Ashanti people of Ghana purify their stools and honour ancestors in this week-long ceremony filled with processions, dancing, drumming, singing and feasting.
                  </p>

                  <hr />

                  <div className='jan-event-location'>
                    <p>📍 Kumasi, Ghana</p>
                    <button>Book Now</button>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

      </div>


      <Footer />
    </>
  )
}

export default Events