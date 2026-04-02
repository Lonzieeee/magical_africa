import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import CultureCard from './CultureCard';
import useAcademyNavigation from "../hooks/useAcademyNavigation";

const heroSlides = [
  {
    image: '/images/Igbo2.jpg',
    title: 'The Real African Story',
   
    subtitle: 'Welcome To Magical Africa',
    name: '(Igbo)',
    flag: '/images/Nigeria-flag.png'
  },
  {
    image: '/images/photorealistic-portrait-african-woman.jpg',
     subtitle: 'Learn African Languages',
    title: 'Develop practical speaking skills from the very beginning',
   
    name: '(Swahili)',
    flag: '/images/Kenyan-flag.png'
  },
  {
    image: '/images/african-basketry.jpg',
    subtitle: 'Learn African Culture & Skills',
    title: 'Discover traditions while building hands-on creative skills',
    name: '(Maasai)',
    flag: '/images/Kenyan-flag.png'
  },
  
  {
    image: '/images/goods.jpg',
    subtitle: 'Exclusive African Artifacts & Material Marketplace',
    title: 'Shop rare cultural items and traditional craft materials',
    name: '(Igbo)',
    flag: '/images/Nigeria-flag.png'
  },
  {
    image: '/images/AI-woman.png',
    subtitle: 'AI Language Preservation',
    title: 'Using technology to safeguard Africa’s linguistic heritage',
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