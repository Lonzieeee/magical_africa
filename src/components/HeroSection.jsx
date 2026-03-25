import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import CultureCard from './CultureCard';

const heroSlides = [
  {
    image: '/images/african-pottery2.jpg',
    title: 'Welcome To Magical Africa',
    subtitle: 'The Real African Story',
    name: '',
    flag: null
  },
  {
    image: '/images/wood_carving.webp',
    title: 'Karibu Magical Africa',
    subtitle: 'Safari Halisi ya Afrika',
    name: '(Swahili)',
    flag: '/images/Kenyan-flag.png'
  },
  {
    image: '/images/african-basketry.jpg',
    title: 'Pooki sidai eitu oshi',
    subtitle: 'Nwee ahụmịhe omenala bara ụba',
    name: '(Maasai)',
    flag: '/images/Kenyan-flag.png'
  },
  
  {
    image: '/images/african-instrument.avif',
    title: 'Mee ka ịmata omenala bara ụba',
    subtitle: 'Mee emume ihe nketa Afrịka',
    name: '(Igbo)',
    flag: '/images/Nigeria-flag.png'
  },
  {
    image: '/images/zulu2.jpg',
    title: 'Hlola izimangaliso zemvelo',
    subtitle: 'Ubuhle obudlula umcabango',
    name: '(Zulu)',
    flag: '/images/South-African-flag.png'
  }
];

const HeroSection = ({ children, customContent, backgroundImage }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate(); // 👈 1. create navigate

  // 👈 2. define the handler
  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (backgroundImage) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [backgroundImage]);

  const slide = heroSlides[currentSlide];
  const bgImage = backgroundImage || slide.image;

  return (
    <div 
      className="heroSection" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >

      <Navbar />

      <CultureCard />


{customContent ? (
        customContent
      ) : (
        <>
          <div className="hero-stuff">
            <div className="hero-text">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
            </div>

            <div className="hero-boxes">
              <div className="hero-box" onClick={()=> handleNavigation('/academy2')}>
                <i className="fa-solid fa-comments"></i>
                <p>{t('hero.learnLanguage')}</p>
              </div>

              <div className="hero-box" onClick={()=> handleNavigation('/tribes')}>
                <i className="fa-solid fa-mask"></i>
                <p>{t('hero.exploreCulture')}</p>
              </div>

              <div className="hero-box" onClick={()=> handleNavigation('/market')}>
                <i className="fa-solid fa-scroll"></i>
                <p>{t('hero.visitAntiques')}</p>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <span className="community-name">{slide.name}</span>
            {slide.flag && (
              <img src={slide.flag} alt="" className="hero-img" style={{ display: 'block' }} />
            )}
          </div>
        </>
      )}

      {children}
    </div>
  );
};

export default HeroSection;