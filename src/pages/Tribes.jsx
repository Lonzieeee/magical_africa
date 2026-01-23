

{/* 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchSection from '../components/SearchSection';

import '../styles/tribes2.css';
import '../styles/contribute.css';

const communitiesData = [

    [
    { name: 'Maasai', image: 'maasai', location: 'Kenya, Tanzania', population: '1.5M+ people', language: 'Maa', desc: 'Semi-nomadic warriors known for distinctive customs and dress.' },
    { name: 'Ashanti', image: 'ashanti', location: 'Ghana', population: '11M+ people', language: 'Twi', desc: 'Known for their gold craftsmanship and the powerful Ashanti Empire.' },
    { name: 'Hausa', image: 'hausa', location: 'Nigeria, Niger', population: '80M+ people', language: 'Hausa', desc: 'One of the largest ethnic groups in Africa, known for trade and commerce.' }
  ],
  [
    { name: 'Zulu', image: 'zulu', location: 'South Africa', population: '12M+ people', language: 'Zulu', desc: 'Known for their warrior culture, beadwork, and the famous Zulu Kingdom.' },
    { name: 'Yoruba', image: 'yoruba', location: 'Nigeria, Benin', population: '45M+ people', language: 'Yoruba', desc: 'Rich in mythology, art, and ancient city-states like Ife and Oyo.' },
    { name: 'Kikuyu', image: 'kikuyu', location: 'Kenya', population: '8M+ people', language: 'Kikuyu', desc: 'The largest ethnic group in Kenya, known for agriculture and trade.' }
  ],

  [
    { name: 'Igbo', image: 'igbo', location: 'Nigeria', population: '45M+ people', language: 'Igbo', desc: 'Known for their entrepreneurial spirit and rich artistic traditions across generations.' },
    { name: 'Amhara', image: 'amhara', location: 'Ethiopia', population: '32M+ people', language: 'Amharic', desc: 'Historically dominant group in Ethiopia with ancient Christian heritage.' },
    { name: 'Berber', image: 'berber', location: 'Morocco, Algeria, Libya', population: '30M+ people', language: 'Tamazight', desc: 'Indigenous people of North Africa with ancient traditions and languages.' }
  ],
  [
    { name: 'Swahili', image: 'swahili', location: 'Kenya, Tanzania, Zanzibar', population: '2M+ people', language: 'Kiswahili', desc: 'Coastal people known for their maritime trade and cultural fusion for centeries.' },
    { name: 'Wolof', image: 'wolof', location: 'Senegal, Gambia', population: '6M+ people', language: 'Wolof', desc: 'Dominant ethnic group in Senegal known for their hospitality and unity.' },
    { name: 'Fulani', image: 'fulani', location: 'West Africa (20+ countries)', population: '40M+ people', language: 'Fulfulde', desc: 'Nomadic pastoralists spread across West Africa with distinct traditions.' }
  ]
];

const Tribes = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % communitiesData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + communitiesData.length) % communitiesData.length);
  };

  return (
    <>
      <div className="heroSection" style={{ backgroundImage: 'url(/images/pyramids.jpg)' }}>
        <Navbar />
        
        <div className="tribes-hero-content">
          <div className="tribes-hero-content-text">
            <h1>Explore African Communities</h1>
            <p>
              Discover the rich diversity of African cultures, traditions, and heritage across the continent.
            </p>
          </div>
        </div>
      </div>

       <SearchSection />

      
      <section className="communities-section">
        <h1 className="community-heading">African Communities</h1>
        <p className="community-sub">
          Explore the diverse cultures, traditions, and stories of African communities from across the continent.
        </p>

        <div className="community">
          <div className="prev-button" onClick={prevSlide}>
            <i className="fa-solid fa-chevron-left"></i>
          </div>

          <div className="carousel-container">
            <div 
              className="the-communities"
              style={{ transform: `translateX(-${currentSlide * 25}%)` }}
            >
              {communitiesData.map((slide, slideIndex) => (
                <div className="community-slide" key={slideIndex}>
                  {slide.map((community, index) => (
                    <div className="community1" key={index}>
                      <div className={`community-image ${community.image}`}></div>
                      <div className="community-content">
                        <h1>{community.name}</h1>
                        <p>{community.desc}</p>
                        <div className="community-content-spans">
                          <span className="info1">📍<p className="info-p">{community.location}</p></span>
                          <span className="info1">👥<p className="info-p">{community.population}</p></span>
                          <span className="info1">📖<p className="info-p">Language: {community.language}</p></span>
                        </div>
                        <button 
                          className="info-button"
                          onClick={() => navigate('/maasai')}
                        >
                          Explore Culture
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="next-button" onClick={nextSlide}>
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        </div>

        <div className="pagination-dots">
          {communitiesData.map((_, index) => (
            <div 
              key={index}
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </section>

    
      <section className="contribute-story">
        <div className="contribute-text">
          <h1>Is Your Community Missing?</h1>
          <p>Help us preserve and share your culture. Add your tribe's story, traditions, language, and heritage to Magical.Africa.</p>
          <button className="contribute-btn">Contribute Story</button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Tribes;
*/}




import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchSection from '../components/SearchSection';

import '../styles/tribes2.css';
import '../styles/contribute.css';

const Tribes = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  
  const communitiesData = [
    [
      { name: t('tribesPage.communities.maasai.name'), image: 'maasai', location: t('tribesPage.communities.maasai.location'), population: t('tribesPage.communities.maasai.population'), language: t('tribesPage.communities.maasai.language'), desc: t('tribesPage.communities.maasai.desc') },
      { name: t('tribesPage.communities.ashanti.name'), image: 'ashanti', location: t('tribesPage.communities.ashanti.location'), population: t('tribesPage.communities.ashanti.population'), language: t('tribesPage.communities.ashanti.language'), desc: t('tribesPage.communities.ashanti.desc') },
      { name: t('tribesPage.communities.hausa.name'), image: 'hausa', location: t('tribesPage.communities.hausa.location'), population: t('tribesPage.communities.hausa.population'), language: t('tribesPage.communities.hausa.language'), desc: t('tribesPage.communities.hausa.desc') }
    ],
    [
      { name: t('tribesPage.communities.zulu.name'), image: 'zulu', location: t('tribesPage.communities.zulu.location'), population: t('tribesPage.communities.zulu.population'), language: t('tribesPage.communities.zulu.language'), desc: t('tribesPage.communities.zulu.desc') },
      { name: t('tribesPage.communities.yoruba.name'), image: 'yoruba', location: t('tribesPage.communities.yoruba.location'), population: t('tribesPage.communities.yoruba.population'), language: t('tribesPage.communities.yoruba.language'), desc: t('tribesPage.communities.yoruba.desc') },
      { name: t('tribesPage.communities.kikuyu.name'), image: 'kikuyu', location: t('tribesPage.communities.kikuyu.location'), population: t('tribesPage.communities.kikuyu.population'), language: t('tribesPage.communities.kikuyu.language'), desc: t('tribesPage.communities.kikuyu.desc') }
    ],
    [
      { name: t('tribesPage.communities.igbo.name'), image: 'igbo', location: t('tribesPage.communities.igbo.location'), population: t('tribesPage.communities.igbo.population'), language: t('tribesPage.communities.igbo.language'), desc: t('tribesPage.communities.igbo.desc') },
      { name: t('tribesPage.communities.amhara.name'), image: 'amhara', location: t('tribesPage.communities.amhara.location'), population: t('tribesPage.communities.amhara.population'), language: t('tribesPage.communities.amhara.language'), desc: t('tribesPage.communities.amhara.desc') },
      { name: t('tribesPage.communities.berber.name'), image: 'berber', location: t('tribesPage.communities.berber.location'), population: t('tribesPage.communities.berber.population'), language: t('tribesPage.communities.berber.language'), desc: t('tribesPage.communities.berber.desc') }
    ],
    [
      { name: t('tribesPage.communities.swahili.name'), image: 'swahili', location: t('tribesPage.communities.swahili.location'), population: t('tribesPage.communities.swahili.population'), language: t('tribesPage.communities.swahili.language'), desc: t('tribesPage.communities.swahili.desc') },
      { name: t('tribesPage.communities.wolof.name'), image: 'wolof', location: t('tribesPage.communities.wolof.location'), population: t('tribesPage.communities.wolof.population'), language: t('tribesPage.communities.wolof.language'), desc: t('tribesPage.communities.wolof.desc') },
      { name: t('tribesPage.communities.fulani.name'), image: 'fulani', location: t('tribesPage.communities.fulani.location'), population: t('tribesPage.communities.fulani.population'), language: t('tribesPage.communities.fulani.language'), desc: t('tribesPage.communities.fulani.desc') }
    ]
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % communitiesData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + communitiesData.length) % communitiesData.length);
  };

  return (
    <>
      <div className="heroSection" style={{ backgroundImage: 'url(/images/pyramids.jpg)' }}>
        <Navbar />
        
        <div className="tribes-hero-content">
          <div className="tribes-hero-content-text">
            <h1>{t('tribesPage.hero.title')}</h1>
            <p>{t('tribesPage.hero.subtitle')}</p>
          </div>
        </div>
      </div>

      <SearchSection />

      <section className="communities-section">
        <h1 className="community-heading">{t('tribesPage.section.title')}</h1>
        <p className="community-sub">{t('tribesPage.section.subtitle')}</p>

        <div className="community">
          <div className="prev-button" onClick={prevSlide}>
            <i className="fa-solid fa-chevron-left"></i>
          </div>

          <div className="carousel-container2">
            <div 
              className="the-communities"
              style={{ transform: `translateX(-${currentSlide * 25}%)` }}
            >
              {communitiesData.map((slide, slideIndex) => (
                <div className="community-slide" key={slideIndex}>
                  {slide.map((community, index) => (
                    <div className="community1" key={index}>
                      <div className={`community-image ${community.image}`}></div>
                      <div className="community-content">
                        <h1>{community.name}</h1>
                        <p>{community.desc}</p>
                        <div className="community-content-spans">
                          <span className="info1">📍<p className="info-p">{community.location}</p></span>
                          <span className="info1">👥<p className="info-p">{community.population}</p></span>
                          <span className="info1">📖<p className="info-p">{t('tribesPage.language')}: {community.language}</p></span>
                        </div>
                        <button 
                          className="info-button"
                          onClick={() => navigate('/maasai')}
                        >
                          {t('tribesPage.exploreCulture')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="next-button" onClick={nextSlide}>
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        </div>

        <div className="pagination-dots">
          {communitiesData.map((_, index) => (
            <div 
              key={index}
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </section>

      <section className="contribute-story">
        <div className="contribute-text">
          <h1>{t('tribesPage.contribute.title')}</h1>
          <p>{t('tribesPage.contribute.description')}</p>
          <button className="contribute-btn">{t('tribesPage.contribute.button')}</button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Tribes;