import React from 'react'
import '../styles/music.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Music = () => {
  return (
    <>
      {/* HERO */}
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

      {/* GENRES SECTION */}
      <section className="music-section">
        <h2 className="music-section-title">Explore <span className="music-gold">Music</span></h2>
        <p className="music-section-sub">Discover African sounds, artists, instruments and global influence</p>

        {/* Genre 1 */}
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

        {/* Genre 2 */}
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

        {/* Genre 3 */}
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

        {/* Genre 4 */}
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

      {/* INSTRUMENTS SECTION */}
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

      {/* FEATURED ARTISTS SECTION */}
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

      {/* GLOBAL INFLUENCE SECTION */}
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