


import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import '../styles/events.css'
import MusicDance from '../components/MusicDance';
import Ceremonies from '../components/Ceremonies';
import Foods from '../components/Foods';
import Footer from '../components/Footer'
import '../styles/month.css'

const Events = () => {
  const { t } = useTranslation();

  const [activeIndex, setActiveIndex] = useState(1);
  const [janClicked, setJanClicked] = useState(false);
  const monthEventRef = useRef(null);

  const handleJanClick = () => {
    setJanClicked(true);
    setTimeout(() => {
      monthEventRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <>
      <Helmet>
        <title>Events | Magical Africa</title>
        <meta name="description" content="Discover and attend authentic African cultural events happening across the continent and around the world. Celebrate African music, art, food, dance and traditions." />
        <meta name="keywords" content="African events, African cultural events, African festivals, African music events, African art events, African dance, celebrate Africa" />
        <meta property="og:title" content="African Cultural Events — Discover & Celebrate Africa" />
        <meta property="og:description" content="Discover authentic African cultural events happening across the continent and around the world." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/events" />
      </Helmet>

      {/* Hero */}
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
          <h1>{t('events.hero.titleStart')} <span>{t('events.hero.titleAccent')}</span></h1>
          <p>{t('events.hero.description')}</p>
        </div>
      </div>

      {/* Explore Events */}
      <div className='events-div'>
        <div className='events-div1'>
          <hr />
          <h1>{t('events.explore.title')}</h1>
        </div>

        <div className='event-lists'>
          <ul>
            <li className={activeIndex === 1 ? "active" : ""} onClick={() => setActiveIndex(1)}>
              <span>1</span>{t('events.explore.categories.music')}
            </li>
            <li className={activeIndex === 2 ? "active" : ""} onClick={() => setActiveIndex(2)}>
              <span>2</span>{t('events.explore.categories.ceremonies')}
            </li>
            <li className={activeIndex === 3 ? "active" : ""} onClick={() => setActiveIndex(3)}>
              <span>3</span>{t('events.explore.categories.food')}
            </li>
            <li className={activeIndex === 4 ? "active" : ""} onClick={() => setActiveIndex(4)}>
              <span>4</span>{t('events.explore.categories.art')}
            </li>
            <li className={activeIndex === 5 ? "active" : ""} onClick={() => setActiveIndex(5)}>
              <span>5</span>{t('events.explore.categories.film')}
            </li>
          </ul>
        </div>

        {activeIndex === 1 && <MusicDance />}
        {activeIndex === 2 && <Ceremonies />}
        {activeIndex === 3 && <Foods />}
      </div>

      {/* Events by Month */}
      <div className='event-month'>
        <h1>{t('events.byMonth.title')}</h1>
        <p className='event-month-p'>{t('events.byMonth.subtitle')}</p>

        <div className='months'>
          <div
            className={`jan ${janClicked ? 'month-active' : ''}`}
            onClick={handleJanClick}
            style={{ cursor: 'pointer' }}
          >
            <h1>{t('events.byMonth.months.january')}</h1>
            <p>{t('events.byMonth.eventCount.two')}</p>
          </div>
          <div className='feb'>
            <h1>{t('events.byMonth.months.february')}</h1>
            <p>{t('events.byMonth.eventCount.three')}</p>
          </div>
          <div className='march'>
            <h1>{t('events.byMonth.months.march')}</h1>
            <p>{t('events.byMonth.eventCount.one')}</p>
          </div>
          <div className='april'>
            <h1>{t('events.byMonth.months.april')}</h1>
            <p>{t('events.byMonth.eventCount.four')}</p>
          </div>
        </div>

        <div className='months2'>
          <div className='jan'>
            <h1>{t('events.byMonth.months.may')}</h1>
            <p>{t('events.byMonth.eventCount.zero')}</p>
          </div>
          <div className='feb'>
            <h1>{t('events.byMonth.months.june')}</h1>
            <p>{t('events.byMonth.eventCount.two')}</p>
          </div>
          <div className='march'>
            <h1>{t('events.byMonth.months.july')}</h1>
            <p>{t('events.byMonth.eventCount.five')}</p>
          </div>
          <div className='april'>
            <h1>{t('events.byMonth.months.august')}</h1>
            <p>{t('events.byMonth.eventCount.three')}</p>
          </div>
        </div>

        <div className='months2'>
          <div className='jan'>
            <h1>{t('events.byMonth.months.september')}</h1>
            <p>{t('events.byMonth.eventCount.one')}</p>
          </div>
          <div className='feb'>
            <h1>{t('events.byMonth.months.october')}</h1>
            <p>{t('events.byMonth.eventCount.four')}</p>
          </div>
          <div className='march'>
            <h1>{t('events.byMonth.months.november')}</h1>
            <p>{t('events.byMonth.eventCount.three')}</p>
          </div>
          <div className='april'>
            <h1>{t('events.byMonth.months.december')}</h1>
            <p>{t('events.byMonth.eventCount.six')}</p>
          </div>
        </div>

        <div className='click-here'>
          <p className='click-here-p'>{t('events.byMonth.selectPrompt')}</p>
        </div>

        {/* January Events */}
        <div className='month-event' ref={monthEventRef}>
          {janClicked && (
            <>
              <h1 className='jan-heading month-ev-slideup month-ev-delay-1'>
                {t('events.byMonth.janEvents.title')}
              </h1>

              <div className='jan-events'>
                <div className='jan-event1 month-ev-slideup month-ev-delay-2'>
                  <h2>{t('events.byMonth.janEvents.event1.category')}</h2>
                  <h1>{t('events.byMonth.janEvents.event1.name')}</h1>
                  <p>{t('events.byMonth.janEvents.event1.description')}</p>
                  <hr />
                  <div className='jan-event-location'>
                    <p>📍 {t('events.byMonth.janEvents.event1.location')}</p>
                    <button>{t('events.byMonth.bookNow')}</button>
                  </div>
                </div>

                <div className='jan-event2 month-ev-slideup month-ev-delay-3'>
                  <h2>{t('events.byMonth.janEvents.event2.category')}</h2>
                  <h1>{t('events.byMonth.janEvents.event2.name')}</h1>
                  <p>{t('events.byMonth.janEvents.event2.description')}</p>
                  <hr />
                  <div className='jan-event-location'>
                    <p>📍 {t('events.byMonth.janEvents.event2.location')}</p>
                    <button>{t('events.byMonth.bookNow')}</button>
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