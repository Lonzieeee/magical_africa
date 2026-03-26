
{/* 
import React from 'react'
import '../styles/music.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Music = () => {
  return (
    <>
    
      <div className="music-hero">
        <Navbar />
        <div className='music-hero-content'>
          <h1 className='music-hero-title'>
            African <span className='music-hero-highlight'>Musical</span><br />Heritage
          </h1>
          <p className='music-hero-subtitle'>
            From the ancient beat of the djembe to the global rise of Afrobeats
            and Amapiano — discover the sounds that shaped the world.
          </p>
        </div>
      </div>

    
      <section className="music-section">
        <h2 className="music-section-title">Explore <span className="music-gold">Music</span></h2>
        <p className="music-section-sub">Discover African sounds, artists, instruments and global influence</p>

      
        <div className="music-genre-feature">
          <div className="music-genre-img">
            <div className="music-img-placeholder place1"></div>
          </div>
          <div className="music-genre-text">
            <p className="music-region-badge">📍 Nigeria & Ghana — West Africa</p>
            <h3>Afrobeats</h3>
            <p>A global phenomenon blending highlife, funk, and hip-hop. Born in Lagos, Afrobeats has become one of the world's most dominant music forces — infectious rhythms that took over dancefloors from Nairobi to New York.</p>
            <p className="music-artists-line"><strong>Key Artists:</strong> Burna Boy, Wizkid, Davido, Tems, Omah Lay</p>
          </div>
        </div>

       
        <div className="music-genre-feature music-genre-reverse">
          <div className="music-genre-img">
            <div className="music-img-placeholder place2"></div>
          </div>
          <div className="music-genre-text">
            <p className="music-region-badge">📍 South Africa</p>
            <h3>Amapiano</h3>
            <p>A hypnotic blend of deep house, jazz, and log drum percussion. Born in Soweto's townships, Amapiano has swept the continent and is now dominating global charts and streaming platforms.</p>
            <p className="music-artists-line"><strong>Key Artists:</strong> Kabza De Small, DJ Maphorisa, Tyler ICU, Focalistic</p>
          </div>
        </div>

       
        <div className="music-genre-feature">
          <div className="music-genre-img">
            <div className="music-img-placeholder place3"></div>
          </div>
          <div className="music-genre-text">
            <p className="music-region-badge">📍 Kenya — East Africa</p>
            <h3>Benga</h3>
            <p>Kenya's indigenous pop style — driving acoustic guitar rhythms layered over traditional Luo melodies. Benga is the foundation of Kenyan popular music and one of East Africa's most distinctive sounds.</p>
            <p className="music-artists-line"><strong>Key Artists:</strong> D.O. Misiani, Ochieng Kabaselleh, Victoria Kings</p>
          </div>
        </div>

   
        <div className="music-genre-feature music-genre-reverse">
          <div className="music-genre-img">
            <div className="music-img-placeholder place4"></div>
          </div>
          <div className="music-genre-text">
            <p className="music-region-badge">📍 Ghana — West Africa</p>
            <h3>Highlife</h3>
            <p>One of Africa's oldest modern genres, mixing brass band sounds with Ghanaian folk rhythms. Sophisticated, joyful, and timeless — a genre that laid the foundation for much of West African pop.</p>
            <p className="music-artists-line"><strong>Key Artists:</strong> E.T. Mensah, Amakye Dede, Daddy Lumba</p>
          </div>
        </div>
      </section>

      <section className="music-section music-section-alt">
        <h2 className="music-section-title">Instruments of <span className="music-gold">Africa</span></h2>
        <p className="music-section-sub">Ancient tools of sound that carry centuries of culture and story</p>
        <div className="music-instruments-grid">
          <div className="music-instrument-card instrument1">
            <div className="music-instrument-icon"></div>
            <h4>Kora</h4>
            <p>21-string harp-lute from West Africa. The instrument of griots — storytellers and historians.</p>
          </div>
          <div className="music-instrument-card instrument2">
            <div className="music-instrument-icon"></div>
            <h4>Djembe</h4>
            <p>The world-famous goblet drum from Guinea. Central to ceremonies and community celebrations.</p>
          </div>
          <div className="music-instrument-card instrument3">
            <div className="music-instrument-icon"></div>
            <h4>Mbira</h4>
            <p>Zimbabwe's thumb piano — a spiritual instrument used to communicate with ancestors.</p>
          </div>
          <div className="music-instrument-card instrument4">
            <div className="music-instrument-icon"></div>
            <h4>Talking Drum</h4>
            <p>Hour-glass shaped drum that mimics tonal languages, used for long-distance communication.</p>
          </div>
          <div className="music-instrument-card instrument5">
            <div className="music-instrument-icon"></div>
            <h4>Krar</h4>
            <p>A five-string lyre from Ethiopia and Eritrea with a rich resonant sound tied to ancient tradition.</p>
          </div>
          <div className="music-instrument-card instrument6">
            <div className="music-instrument-icon"></div>
            <h4>Balafon</h4>
            <p>A wooden xylophone beloved across Mali, Senegal, and Côte d'Ivoire.</p>
          </div>
        </div>
      </section>

     
      <section className="music-section">
        <h2 className="music-section-title">Featured <span className="music-gold">Artists</span></h2>
        <p className="music-section-sub">Legends and rising stars from across the continent</p>
        <div className="music-artists-grid">

          <div className="music-artist-card artist1">
            <div className="music-artist-overlay">
              <h4>Fela Kuti</h4>
              <span className="music-artist-genre">Afrobeat • Nigeria</span>
              <p>Father of Afrobeat. His music was revolutionary, political, and immortal.</p>
            </div>
          </div>

          <div className="music-artist-card artist2">
            <div className="music-artist-overlay">
              <h4>Miriam Makeba</h4>
              <span className="music-artist-genre">Afropop • South Africa</span>
              <p>"Mama Africa" — a voice of beauty and resistance heard around the world.</p>
            </div>
          </div>

          <div className="music-artist-card artist3">
            <div className="music-artist-overlay">
              <h4>Burna Boy</h4>
              <span className="music-artist-genre">Afrobeats • Nigeria</span>
              <p>Grammy-winning African Giant who brought Afrobeats to every continent.</p>
            </div>
          </div>

          <div className="music-artist-card artist4">
            <div className="music-artist-overlay">
              <h4>Tems</h4>
              <span className="music-artist-genre">Afro-soul • Nigeria</span>
              <p>A generation-defining voice blending soul, R&B, and Afrobeats.</p>
            </div>
          </div>

          <div className="music-artist-card artist5">
            <div className="music-artist-overlay">
              <h4>Ali Farka Touré</h4>
              <span className="music-artist-genre">Blues • Mali</span>
              <p>Proved the deep connection between West African music and American blues.</p>
            </div>
          </div>

          <div className="music-artist-card artist6">
            <div className="music-artist-overlay">
              <h4>Youssou N'Dour</h4>
              <span className="music-artist-genre">Mbalax • Senegal</span>
              <p>One of Africa's most celebrated voices, fusing Wolof tradition with global sound.</p>
            </div>
          </div>


          <div className="music-artist-card artist7">
            <div className="music-artist-overlay">
              <h4>Ima Thomas</h4>
              <span className="music-artist-genre">Blues • Mali</span>
              <p>Proved the deep connection between West African music and American blues.</p>
            </div>
          </div>

        </div>
      </section>

     
      <section className="music-section music-section-alt">
        <h2 className="music-section-title">Africa's Global <span className="music-gold">Influence</span></h2>
        <p className="music-section-sub">How African rhythms shaped the music the whole world listens to</p>
        <div className="music-influence-grid">
          <div className="music-influence-card">
            <h4>Jazz & Blues</h4>
            <p>The pentatonic scales, call-and-response patterns, and rhythmic complexity of African music are the direct ancestors of Jazz and Blues.</p>
          </div>
          <div className="music-influence-card">
            <h4>Reggae</h4>
            <p>Jamaican reggae carries deep African rhythmic heritage through the diaspora, with Rastafari explicitly rooted in Ethiopian traditions.</p>
          </div>
          <div className="music-influence-card">
            <h4>Hip-Hop</h4>
            <p>The griot tradition of spoken word, storytelling, and call-and-response is widely acknowledged as a spiritual ancestor of hip-hop.</p>
          </div>
          <div className="music-influence-card">
            <h4>Electronic Music</h4>
            <p>From Amapiano to Afrobeats, African rhythm structures are reshaping global club culture and mainstream pop production.</p>
          </div>
        </div>
      </section>


      <Footer />
    </>
  )
}

export default Music
*/}

import React from 'react'
import '../styles/music.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useTranslation } from 'react-i18next'

const Music = () => {
  const { t } = useTranslation();

  return (
    <>

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



