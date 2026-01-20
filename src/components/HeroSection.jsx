import { useState, useEffect } from 'react';
import Navbar from './Navbar';

const heroSlides = [
  {
    image: '/images/pyramids.jpg',
    title: 'Welcome To Magical Africa',
    subtitle: 'The Real African Story',
    name: '',
    flag: null
  },
  {
    image: '/images/swahili-community.jpg',
    title: 'Karibu Magical Africa',
    subtitle: 'Safari Halisi ya Afrika',
    name: '(Swahili)',
    flag: '/images/Kenyan-flag.png'
  },
  {
    image: '/images/maasai.jpg',
    title: 'Pooki sidai eitu oshi',
    subtitle: 'Nwee ahụmịhe omenala bara ụba',
    name: '(Maasai)',
    flag: '/images/Kenyan-flag.png'
  },
  {
    image: '/images/Igbo.jpg',
    title: 'Mee ka ịmata omenala bara ụba',
    subtitle: 'Mee emume ihe nketa Afrịka',
    name: '(Igbo)',
    flag: '/images/Nigeria-flag.png'
  },
  {
    image: '/images/zulu.jpg',
    title: 'Hlola izimangaliso zemvelo',
    subtitle: 'Ubuhle obudlula umcabango',
    name: '(Zulu)',
    flag: '/images/South-African-flag.png'
  }
];

const HeroSection = ({ children, customContent, backgroundImage }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Only run the slideshow if no custom backgroundImage is provided
  useEffect(() => {
    if (backgroundImage) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [backgroundImage]);

  // Determine the current slide data
  const slide = heroSlides[currentSlide];
  
  // Determine which background image to use
  // If a custom backgroundImage prop is passed, use that; otherwise use the current slide's image
  const bgImage = backgroundImage || slide.image;

  return (
    <div 
      className="heroSection" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Navbar />

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
              <div className="hero-box">
                <i className="fa-solid fa-comments"></i>
                <p>Learn Language</p>
              </div>

              <div className="hero-box">
                <i className="fa-solid fa-mask"></i>
                <p>Explore Culture</p>
              </div>

              <div className="hero-box">
                <i className="fa-solid fa-scroll"></i>
                <p>Visit Antiques</p>
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