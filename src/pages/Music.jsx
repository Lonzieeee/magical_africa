


import React from 'react'
import '../styles/music.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useTranslation } from 'react-i18next'

const Music = () => {
  const { t } = useTranslation();

  return (
    <>

    <Helmet>
  <title>African Music | Magical Africa</title>
  <meta name="description" content="Explore the rich world of African music — from Afrobeats and Highlife to traditional instruments like the Djembe, Kora and Mbira. Discover iconic African artists and their global influence." />
  <meta name="keywords" content="African music, Afrobeats, African instruments, Djembe, Kora, Mbira, African artists, Fela Kuti, Burna Boy, African culture music" />
  <meta property="og:title" content="African Music — Explore Genres, Instruments & Artists" />
  <meta property="og:description" content="Explore the rich world of African music — from Afrobeats and Highlife to traditional instruments like the Djembe, Kora and Mbira." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://magical.africa/music" />
  <meta property="og:image" content="https://magical.africa/images/drums2-latest.jpg" />
</Helmet>

      <div className="music-hero">
        <Navbar />
        <div className='music-hero-content'>
          <h1 className='music-hero-title'>
            {t('music.hero.titleStart')} <span className='music-hero-highlight'>{t('music.hero.titleAccent')}</span><br />{t('music.hero.titleEnd')}
          </h1>
          <p className='music-hero-subtitle'>
            {t('music.hero.subtitle')}
          </p>
        </div>
      </div>


      <section className="music-section">
        <h2 className="music-section-title">{t('music.explore.title')} <span className="music-gold">{t('music.explore.titleAccent')}</span></h2>
        <p className="music-section-sub">{t('music.explore.subtitle')}</p>


        <div className="music-genre-feature">
          <div className="music-genre-img">
            <div className="music-img-placeholder place1"></div>
          </div>
          <div className="music-genre-text">
            <p className="music-region-badge">📍 {t('music.explore.genre1.location')}</p>
            <h3>{t('music.explore.genre1.name')}</h3>
            <p>{t('music.explore.genre1.description')}</p>
            <p className="music-artists-line"><strong>{t('music.explore.keyArtists')}</strong> {t('music.explore.genre1.artists')}</p>
          </div>
        </div>


        <div className="music-genre-feature music-genre-reverse">
          <div className="music-genre-img">
            <div className="music-img-placeholder place2"></div>
          </div>
          <div className="music-genre-text">
            <p className="music-region-badge">📍 {t('music.explore.genre2.location')}</p>
            <h3>{t('music.explore.genre2.name')}</h3>
            <p>{t('music.explore.genre2.description')}</p>
            <p className="music-artists-line"><strong>{t('music.explore.keyArtists')}</strong> {t('music.explore.genre2.artists')}</p>
          </div>
        </div>


        <div className="music-genre-feature">
          <div className="music-genre-img">
            <div className="music-img-placeholder place3"></div>
          </div>
          <div className="music-genre-text">
            <p className="music-region-badge">📍 {t('music.explore.genre3.location')}</p>
            <h3>{t('music.explore.genre3.name')}</h3>
            <p>{t('music.explore.genre3.description')}</p>
            <p className="music-artists-line"><strong>{t('music.explore.keyArtists')}</strong> {t('music.explore.genre3.artists')}</p>
          </div>
        </div>


        <div className="music-genre-feature music-genre-reverse">
          <div className="music-genre-img">
            <div className="music-img-placeholder place4"></div>
          </div>
          <div className="music-genre-text">
            <p className="music-region-badge">📍 {t('music.explore.genre4.location')}</p>
            <h3>{t('music.explore.genre4.name')}</h3>
            <p>{t('music.explore.genre4.description')}</p>
            <p className="music-artists-line"><strong>{t('music.explore.keyArtists')}</strong> {t('music.explore.genre4.artists')}</p>
          </div>
        </div>
      </section>

      <section className="music-section music-section-alt">
        <h2 className="music-section-title">{t('music.instruments.title')} <span className="music-gold">{t('music.instruments.titleAccent')}</span></h2>
        <p className="music-section-sub">{t('music.instruments.subtitle')}</p>
        <div className="music-instruments-grid">
          <div className="music-instrument-card instrument1">
            <div className="music-instrument-icon"></div>
            <h4>{t('music.instruments.kora.name')}</h4>
            <p>{t('music.instruments.kora.description')}</p>
          </div>
          <div className="music-instrument-card instrument2">
            <div className="music-instrument-icon"></div>
            <h4>{t('music.instruments.djembe.name')}</h4>
            <p>{t('music.instruments.djembe.description')}</p>
          </div>
          <div className="music-instrument-card instrument3">
            <div className="music-instrument-icon"></div>
            <h4>{t('music.instruments.mbira.name')}</h4>
            <p>{t('music.instruments.mbira.description')}</p>
          </div>
          <div className="music-instrument-card instrument4">
            <div className="music-instrument-icon"></div>
            <h4>{t('music.instruments.talkingDrum.name')}</h4>
            <p>{t('music.instruments.talkingDrum.description')}</p>
          </div>
          <div className="music-instrument-card instrument5">
            <div className="music-instrument-icon"></div>
            <h4>{t('music.instruments.krar.name')}</h4>
            <p>{t('music.instruments.krar.description')}</p>
          </div>
          <div className="music-instrument-card instrument6">
            <div className="music-instrument-icon"></div>
            <h4>{t('music.instruments.balafon.name')}</h4>
            <p>{t('music.instruments.balafon.description')}</p>
          </div>
        </div>
      </section>


      <section className="music-section">
        <h2 className="music-section-title">{t('music.artists.title')} <span className="music-gold">{t('music.artists.titleAccent')}</span></h2>
        <p className="music-section-sub">{t('music.artists.subtitle')}</p>
        <div className="music-artists-grid">

          <div className="music-artist-card artist1">
            <div className="music-artist-overlay">
              <h4>Fela Kuti</h4>
              <span className="music-artist-genre">{t('music.artists.artist1.genre')}</span>
              <p>{t('music.artists.artist1.description')}</p>
            </div>
          </div>

          <div className="music-artist-card artist2">
            <div className="music-artist-overlay">
              <h4>Miriam Makeba</h4>
              <span className="music-artist-genre">{t('music.artists.artist2.genre')}</span>
              <p>{t('music.artists.artist2.description')}</p>
            </div>
          </div>

          <div className="music-artist-card artist3">
            <div className="music-artist-overlay">
              <h4>Burna Boy</h4>
              <span className="music-artist-genre">{t('music.artists.artist3.genre')}</span>
              <p>{t('music.artists.artist3.description')}</p>
            </div>
          </div>

          <div className="music-artist-card artist4">
            <div className="music-artist-overlay">
              <h4>Tems</h4>
              <span className="music-artist-genre">{t('music.artists.artist4.genre')}</span>
              <p>{t('music.artists.artist4.description')}</p>
            </div>
          </div>

          <div className="music-artist-card artist5">
            <div className="music-artist-overlay">
              <h4>Ali Farka Touré</h4>
              <span className="music-artist-genre">{t('music.artists.artist5.genre')}</span>
              <p>{t('music.artists.artist5.description')}</p>
            </div>
          </div>

          <div className="music-artist-card artist6">
            <div className="music-artist-overlay">
              <h4>Youssou N'Dour</h4>
              <span className="music-artist-genre">{t('music.artists.artist6.genre')}</span>
              <p>{t('music.artists.artist6.description')}</p>
            </div>
          </div>

          <div className="music-artist-card artist7">
            <div className="music-artist-overlay">
              <h4>Ima Thomas</h4>
              <span className="music-artist-genre">{t('music.artists.artist7.genre')}</span>
              <p>{t('music.artists.artist7.description')}</p>
            </div>
          </div>

        </div>
      </section>


      <section className="music-section music-section-alt">
        <h2 className="music-section-title">{t('music.influence.title')} <span className="music-gold">{t('music.influence.titleAccent')}</span></h2>
        <p className="music-section-sub">{t('music.influence.subtitle')}</p>
        <div className="music-influence-grid">
          <div className="music-influence-card">
            <h4>{t('music.influence.jazz.name')}</h4>
            <p>{t('music.influence.jazz.description')}</p>
          </div>
          <div className="music-influence-card">
            <h4>{t('music.influence.reggae.name')}</h4>
            <p>{t('music.influence.reggae.description')}</p>
          </div>
          <div className="music-influence-card">
            <h4>{t('music.influence.hiphop.name')}</h4>
            <p>{t('music.influence.hiphop.description')}</p>
          </div>
          <div className="music-influence-card">
            <h4>{t('music.influence.electronic.name')}</h4>
            <p>{t('music.influence.electronic.description')}</p>
          </div>
        </div>
      </section>


      <Footer />
    </>
  )
}

export default Music



