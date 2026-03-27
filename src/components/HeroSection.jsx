import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import CultureCard from './CultureCard';
import useAcademyNavigation from "../hooks/useAcademyNavigation";

const heroSlides = [
  {
    image: '/images/Igbo2.jpg',
    title: 'Learn Valuable Traditional Skills Online - Traditional skills reimagined for today',
   
    subtitle: 'Welcome To Magical Africa',
    name: '(Igbo)',
    flag: '/images/Nigeria-flag.png'
  },
  {
    image: '/images/wood_carving.webp',
     subtitle: 'Wood Carving',
    title: 'Build hands-on carving skills from scratch',
   
    name: '(Swahili)',
    flag: '/images/Kenyan-flag.png'
  },
  {
    image: '/images/african-basketry.jpg',
    subtitle: 'Basket Weaving',
    title: 'Learn Basket Weaving Techniques',
    name: '(Maasai)',
    flag: '/images/Kenyan-flag.png'
  },
  
  {
    image: '/images/african-instrument.avif',
    subtitle: 'Instrument Making',
    title: 'Master the Art of Instrument Making',
    name: '(Igbo)',
    flag: '/images/Nigeria-flag.png'
  },
  {
    image: '/images/african-pottery2.jpg',
    subtitle: 'Pottery',
    title: 'Create and shape ceramics from clay',
    name: '(Zulu)',
    flag: '/images/South-African-flag.png'
  }
];

const HeroSection = ({ children, customContent, backgroundImage }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();
  const goToAcademy = useAcademyNavigation();
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


  // Add this useEffect in HeroSection, alongside your existing one
useEffect(() => {
  heroSlides.forEach((slide) => {
    const img = new Image();
    img.src = slide.image;
  });
}, []);

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
              <h1>{slide.subtitle}</h1>
              <p>{slide.title}</p>
             
            
            </div>

            <div className="hero-boxes">
              <div className="hero-box" onClick={goToAcademy}>
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