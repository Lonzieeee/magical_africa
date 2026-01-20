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

      {/* Communities Section */}
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

      {/* Contribute Section */}
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
