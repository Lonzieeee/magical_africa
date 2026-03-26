import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../styles/culture-card.css';
import useAcademyNavigation from "../hooks/useAcademyNavigation";

const CultureCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const [proverbLang, setProverbLang] = useState('eng'); // Track proverb language
  const { t } = useTranslation();
  const goToAcademy = useAcademyNavigation();
  const navigate = useNavigate(); // 👈 1. create navigate

  // 👈 2. define the handler
  const handleNavigation = (path) => {
    navigate(path);
  };



  // Proverb content in both languages
  const proverbContent = {
    eng: {
      proverb: "Curiosity killed the cat",
      explanation: "An expression suggesting that curiosity, when unchecked, can lead one into risky or dangerous situations.",
      teaching: "Some questions or actions can lead to trouble."
    },
    kisw: {
      proverb: "Udadisi uliua paka",
      explanation: "Msemo unaonyesha kwamba udadisi, unapokuwa haujauzuiwa, unaweza kusababisha mtu kuingia katika hali hatari.",
      teaching: "Maswali au vitendo fulani vinaweza kusababisha matatizo."
    }
  };

  return (
    <div className="culture-card">

      {/* SLIDER */}
      <div
        className="slider"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {/* SECTION 1 */}
        <div className='slide'>
          <h1><i className="fa-solid fa-lightbulb"></i>{t('cultureCard.phrases.title')}</h1>

          <div className='phrase'>
            <p>  
              <p className='phrase-head'> 
                <i className="fa-solid fa-check"></i>{t('cultureCard.phrases.proverbLabel')}

                <div className='phrase-language'>
                  <button 
                    className={proverbLang === 'eng' ? 'active' : ''}
                    onClick={() => setProverbLang('eng')}
                  >
                    Eng
                  </button>
                  <button 
                    className={proverbLang === 'kisw' ? 'active' : ''}
                    onClick={() => setProverbLang('kisw')}
                  >
                    Kisw
                  </button>
                </div>
              </p>

              <span className='proverb-itself'>
                {proverbContent[proverbLang].proverb}
              </span>
            </p>

            <p> 
              <p className='phrase-head'> 
                <i className="fa-solid fa-check"></i>{t('cultureCard.phrases.descriptionLabel')}
              </p>
              <span className='provern-explanation'>
                {proverbContent[proverbLang].explanation}
              </span>
            </p>

            <p> 
              <p className='phrase-head'> 
                <i className="fa-solid fa-check"></i>{t('cultureCard.phrases.teachingLabel')}
              </p>
              <span className='proverb-teaching'>
                {proverbContent[proverbLang].teaching}
              </span>
            </p>
          </div>

          <button className='get-more' onClick={goToAcademy}>{t('cultureCard.phrases.learnMore')}</button>
        </div>

        {/* SECTION 2 */}
        <div className='slide'>
          <h1> <i className="fa-solid fa-music"></i> {t('cultureCard.music.title')}</h1>

          <p className='music-text'>{t('cultureCard.music.intro')}</p> 

          <p className='some-music'>{t('cultureCard.music.popularGenres')} <span>{t('cultureCard.music.musicGenres')}</span></p>

          <div className='music-genres'>
            <span>{t('cultureCard.music.genres.djembe')} <p></p></span>
            <span>{t('cultureCard.music.genres.maasai')} <p></p></span>
            <span>{t('cultureCard.music.genres.isicathamiya')} <p></p></span>
            <span>{t('cultureCard.music.genres.benga')} <p></p></span>
          </div>

          <p className='listen-music'>{t('cultureCard.music.listenTitle')}</p>

          <div className='audio'>
            <div className='audio-item'>
              <p className='audio-title'>{t('cultureCard.music.tracks.djembe')}</p>
              <audio controls className='audio-player'>
                <source src="/audio/djembe-rhythm.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>

            <div className='audio-item'>
              <p className='audio-title'>{t('cultureCard.music.tracks.afrobeat')}</p>
              <audio controls className='audio-player'>
                <source src="/audio/afrobeat.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
          <p className='see-more2' onclick={()=> handleNavigation('/music')}>{t('cultureCard.music.learnMore')} <i className="fa-solid fa-arrow-right"></i></p>
        </div>

        {/* SECTION 3 */}
        <div className='slide'>
          <h1> <i className="fa-solid fa-masks-theater"></i>{t('cultureCard.events.title')}</h1>

          <p className='event-text'>{t('cultureCard.events.intro')}</p>

          <div className='event'>
            <span className='event-head'> 🎪 <p>{t('cultureCard.events.festivalTitle')}</p></span> 

            <span className='date-span'>📅 <p>{t('cultureCard.events.festivalDate')}</p></span>

            <p className='event-description'>{t('cultureCard.events.festivalDescription')}</p>

            <div className='event-buttons'>
              <div className='event-type'>
                <button>{t('cultureCard.events.categories.music')}</button>
                <button>{t('cultureCard.events.categories.dance')}</button>
                <button>{t('cultureCard.events.categories.food')}</button>
              </div>

              <button className='book-event'>{t('cultureCard.events.bookNow')}</button>
            </div>
          </div>
          <p className='see-more' onclick={()=> handleNavigation('/events')}>{t('cultureCard.events.seeMore')} <i className="fa-solid fa-arrow-right"></i></p>
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

{/* export default CultureCard; */}

export default React.memo(CultureCard);