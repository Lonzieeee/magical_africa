import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlay, FaPause } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import '../styles/about-page.css';
import '../styles/impact.css';
import '../styles/team.css';
import '../styles/AI.css';




const About = () => {
  const { t } = useTranslation();
  const [solutionSlide, setSolutionSlide] = useState(0);
  const [hoveredMember, setHoveredMember] = useState(null);
  const [teamSlide, setTeamSlide] = useState(0);
  const [membersPerSlide, setMembersPerSlide] = useState(3);


  const problemRef = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const image = entry.target.querySelector('.problem-image');
        const text = entry.target.querySelector('.problem-text');

        if (entry.isIntersecting) {
          image?.classList.add('problem-image-visible');
          text?.classList.add('problem-text-visible');
        } else {
          image?.classList.remove('problem-image-visible');
          text?.classList.remove('problem-text-visible');
        }
      });
    },
    { threshold: 0.2 }
  );

  if (problemRef.current) observer.observe(problemRef.current);
  return () => observer.disconnect();
}, []);



const impactRef = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const divs = entry.target.querySelectorAll('.impact-div');

        if (entry.isIntersecting) {
          divs.forEach((div, index) => {
            setTimeout(() => {
              div.classList.add('impact-div-visible');
            }, index * 150);
          });
        } else {
          divs.forEach((div) => {
            div.classList.remove('impact-div-visible');
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  if (impactRef.current) observer.observe(impactRef.current);
  return () => observer.disconnect();
}, []);


const aiRef = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const boxes = entry.target.querySelectorAll('.AI-1');

        if (entry.isIntersecting) {
          boxes.forEach((box, index) => {
            setTimeout(() => {
              box.classList.add('ai-visible');
            }, index * 200);
          });
        } else {
          boxes.forEach((box) => {
            box.classList.remove('ai-visible');
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  if (aiRef.current) observer.observe(aiRef.current);
  return () => observer.disconnect();
}, []);


const partnersRef = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const partners = entry.target.querySelectorAll('.partner-a');

        if (entry.isIntersecting) {
          partners.forEach((partner, index) => {
            setTimeout(() => {
              partner.classList.add('partner-visible');
            }, index * 150);
          });
        } else {
          partners.forEach((partner) => {
            partner.classList.remove('partner-visible');
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  if (partnersRef.current) observer.observe(partnersRef.current);
  return () => observer.disconnect();
}, []);

  // Update members per slide based on screen width
  useEffect(() => {
    const updateMembersPerSlide = () => {
      if (window.innerWidth <= 480) {
        setMembersPerSlide(1); // Mobile: 1 at a time
      } else if (window.innerWidth <= 768) {
        setMembersPerSlide(1); // Tablet: 2 at a time
      } else {
        setMembersPerSlide(3); // Desktop: 3 at a time
      }
      setTeamSlide(0); // Reset to first slide
    };

    updateMembersPerSlide();
    window.addEventListener('resize', updateMembersPerSlide);
    
    return () => window.removeEventListener('resize', updateMembersPerSlide);
  }, []);

  const nextSolution = () => {
    setSolutionSlide((prev) => (prev + 1) % 3);
  };

  const prevSolution = () => {
    setSolutionSlide((prev) => (prev - 1 + 3) % 3);
  };


 //for the about page
/*
    useEffect(() => {
    document.title = 'About Magical Africa';
  }, []);
  
  */


  const approaches = [
    { icon: 'fa-hands-helping', label: t('about.approach.items.communityOwnership') },
    { icon: 'fa-shield-halved', label: t('about.approach.items.ethicalStewardship') },
    { icon: 'fa-seedling', label: t('about.approach.items.sustainableImpact') },
    { icon: 'fa-globe-africa', label: t('about.approach.items.localPanAfrican') }
  ];

  const principles = t('about.principles.items', { returnObjects: true });

  const team = [
     { 
      name: t('about.team.members.gloria.name'), 
      role: t('about.team.members.gloria.role'), 
      image: '/images/Gloria(1).jpeg',
      bio: t('about.team.members.gloria.bio'),
    },
       { 
      name: t('about.team.members.lorna.name'), 
      role: t('about.team.members.lorna.role'), 
      image: '/images/Joel-Makori.jpeg',
      bio: t('about.team.members.lorna.bio'),
    },
    { 
      name: t('about.team.members.steve.name'), 
      role: t('about.team.members.steve.role'), 
      image: '/images/Steve.jpeg',
      bio: t('about.team.members.steve.bio'),
    },
   
    { 
      name: t('about.team.members.joel.name'), 
      role: t('about.team.members.joel.role'), 
      image: '/images/Joel-Makori.jpeg',
      bio: t('about.team.members.joel.bio'),
    },
    { 
      name: t('about.team.members.Edewait.name'), 
      role: t('about.team.members.Edewait.role'), 
      image: '/images/kikiPhoto.jpg',
      bio: t('about.team.members.Edewait.bio'),
    },
    { 
      name: t('about.team.members.ian.name'), 
      role: t('about.team.members.ian.role'), 
      image: '/images/Gloria(1).jpeg',
      bio: t('about.team.members.ian.bio'),
    },
 

    { 
      name: t('about.team.members.collins.name'), 
      role: t('about.team.members.collins.role'), 
      image: '/images/Joel-Makori.jpeg',
      bio: t('about.team.members.collins.bio'),
    },


  ];

  const totalTeamSlides = Math.ceil(team.length / membersPerSlide);

  const nextTeam = () => {
    setTeamSlide((prev) => (prev + 1) % totalTeamSlides);
  };

  const prevTeam = () => {
    setTeamSlide((prev) => (prev - 1 + totalTeamSlides) % totalTeamSlides);
  };


const heroVideoRef = useRef(null);
const [isHeroPlaying, setIsHeroPlaying] = useState(true);

const toggleHeroVideo = () => {
  const video = heroVideoRef.current;
  if (!video) return;
  if (video.paused) {
    video.play();
    setIsHeroPlaying(true);
  } else {
    video.pause();
    setIsHeroPlaying(false);
  }
};

  return (
    <>


<Helmet>
  <title>About | Magical Africa</title>
  <meta name="description" content="Learn about Magical Africa — a pan-African platform dedicated to preserving and celebrating African languages, culture, knowledge and heritage." />
  <meta name="keywords" content="About Magical Africa, African platform, African heritage, pan-African, African culture preservation" />
  <meta property="og:title" content="About Magical Africa — Our Story & Mission" />
  <meta property="og:description" content="A pan-African platform dedicated to preserving and celebrating African languages, culture and heritage." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://magical.africa/about" />
</Helmet>



{/* 
      <div className="heroSection" style={{ backgroundImage: 'url(/images/pyramids2.jpg)' }}>
        <Navbar />
        
        <div className="mission-vision">
          <h1>{t('about.hero.title')}</h1>
          <p className='about-tagline'>
            {t('about.hero.tagline')}
          </p>
        </div>
      </div>

      */}


  <div className="heroSection2 heroSection--video">
  <Navbar />

  {/* Background Video */}
  <video
    ref={heroVideoRef}
    className="hero-video"
    src="/images/about-video.mp4"   // 👈 replace with your actual video path
    autoPlay
   
    loop
    playsInline
  />

  {/* Dark overlay */}
  <div className="hero-overlay" />

  {/* Play/Pause Button */}
  <button
    className="hero-play-btn"
    onClick={toggleHeroVideo}
    aria-label={isHeroPlaying ? 'Pause video' : 'Play video'}
  >
    {isHeroPlaying ? <FaPause /> : <FaPlay />}
  </button>

  <div className="mission-vision">
    <h1>{t('about.hero.title')}</h1>
    <p className='about-tagline'>{t('about.hero.tagline')}</p>
  </div>
</div>

      {/* Problem Section */}
      <section className="problem-page" ref={problemRef}>
        <div 
          className="problem-image"
          style={{ backgroundImage: 'url(/images/Learn-Language3.jpg)' }}
        ></div>
        
        <div className="problem-text">
          <h1>{t('about.background.sectionTitle')} <span>{t('about.background.sectionTitleHighlight')}</span></h1>
           
          <div className='background-text'>
            <p>{t('about.background.paragraph1')}</p>
            <p>{t('about.background.paragraph2')}</p>
            <p>{t('about.background.paragraph3')}</p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="our-impact">
        <h1>{t('about.approach.title')}</h1>
        <p>{t('about.approach.description')}</p>

        <div className="impact-boxes" ref={impactRef}>
          {approaches.map((item, index) => (
            <div className="impact-div" key={index}>
              <span className='impact-icon-span
              '>
              <i className={`fa-solid ${item.icon} impact-icon`}></i>
              </span>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What We Do Section */}
      <section className="our-solution">
        <h1>{t('about.whatWeDo.title')}</h1>

        <div className="solution-box">
          <div className="chev-prev2" onClick={prevSolution}>
            <i className="fa-solid fa-chevron-left"></i>
          </div>

          <div className="solutions-carousel">
            <div 
              className="solutions-wrapper"
              style={{ transform: `translateX(-${solutionSlide * 100}%)` }}
            >
              {/* Pair 1 - Data Stewardship */}
              <div className="solution-pair">
                <div className="solution-text">
                  <h2>{t('about.whatWeDo.slides.datastewardship.title')}</h2>
                  <p>{t('about.whatWeDo.slides.datastewardship.description')}</p>
                  <ul>
                    {t('about.whatWeDo.slides.datastewardship.items', { returnObjects: true }).map((item, idx) => (
                      <li key={idx}><span></span>{item}</li>
                    ))}
                  </ul>
                </div>
                <div 
                  className="solution-image"
                  style={{ backgroundImage: `url('/images/kitenge-latest.jpg')` }}
                ></div>
              </div>

              {/* Pair 2 - AI & Data Collection */}
              <div className="solution-pair">
                <div className="solution-text">
                  <h2>{t('about.whatWeDo.slides.aiDataCollection.title')}</h2>
                  <p>{t('about.whatWeDo.slides.aiDataCollection.description')}</p>
                  <ul>
                    {t('about.whatWeDo.slides.aiDataCollection.items', { returnObjects: true }).map((item, idx) => (
                      <li key={idx}><span></span>{item}</li>
                    ))}
                  </ul>
                </div>
                <div 
                  className="solution-image"
                  style={{ backgroundImage: `url('/images/learn-language-kids.jpg')` }}
                ></div>
              </div>

              {/* Pair 3 - Education */}
              <div className="solution-pair">
                <div className="solution-text">
                  <h2>{t('about.whatWeDo.slides.education.title')}</h2>
                  <p>{t('about.whatWeDo.slides.education.description')}</p>
                  <ul>
                    {t('about.whatWeDo.slides.education.items', { returnObjects: true }).map((item, idx) => (
                      <li key={idx}><span></span>{item}</li>
                    ))}
                  </ul>
                </div>
                <div 
                  className="solution-image"
                  style={{ backgroundImage: `url('/images/Oromo2.jpg')` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="chev-next2" onClick={nextSolution}>
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="magical-achievements">
        <h1>{t('about.principles.title')}</h1>

        <div className="achievements">
          {principles.map((principle, index) => (
            <div className="achievement1" key={index}>
              <p>{principle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Section */}
      <div className='AI-section' style={{ backgroundImage: `url('/images/drums2-latest.jpg')` }}>
        <h1>{t('about.ai.title')}</h1>
        <div className='AI-boxes' ref={aiRef}>
          <div className='AI-1'>
            <div className='AI-heading'>
              <h1>{t('about.ai.sections.preparingData.title')}</h1>
            </div>
            <div>
              {t('about.ai.sections.preparingData.items', { returnObjects: true }).map((item, idx) => (
                <p key={idx}><span></span>{item}</p>
              ))}
            </div>
          </div>

          <div className='AI-1'>
            <div className='AI-heading'>
              <h1>{t('about.ai.sections.research.title')}</h1>
            </div>
            <div>
              {t('about.ai.sections.research.items', { returnObjects: true }).map((item, idx) => (
                <p key={idx}><span></span>{item}</p>
              ))}
            </div>
          </div>

          <div className='AI-1'>
            <div className='AI-heading'>
              <h1>{t('about.ai.sections.communityTools.title')}</h1>
            </div>
            <div>
              {t('about.ai.sections.communityTools.items', { returnObjects: true }).map((item, idx) => (
                <p key={idx}><span></span>{item}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className='working-with'>
        <h1>{t('about.partners.title')}</h1>
        <p>{t('about.partners.description')}</p>

        <div className='partnering img-a' ref={partnersRef}>
          <div className='partner-a'>
            <img src="/images/aws.webp" alt="AWS" />
          </div>
          <div className='partner-a img-b'>
            <img src="/images/kuLogo.webp" alt="Kenyatta University" />
          </div>
          <div className='partner-a img-c'>
            <img src="/images/download.png" alt="UNESCO" width={80} />
          </div>
          <div className='partner-a img-d'>
            <img src="/images/wikimedia.png" alt="Wikimedia Foundation" width={30} />
          </div>
        </div>
      </div>

      {/* Team Section with Carousel */}
      <section className="team">
        <h1>{t('about.team.title')}</h1>
        <p>{t('about.team.description')}</p>

        <div className='team-carousel'>
          <div className='chev-prev5' onClick={prevTeam}>
            <i className="fa-solid fa-chevron-left" id='prev-btn5'></i>
          </div>

          <div className="team-section-wrapper">
            <div 
              className="team-section"
              style={{ 
                transform: `translateX(-${teamSlide * 100}%)`,
              }}
            >
              {team.map((member, index) => (
                <div 
                  className="team1" 
                  key={index}
                  onMouseEnter={() => setHoveredMember(index)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <div className="team1-image">
                    <img src={member.image} alt={member.name} />
                    
                    {/* Hover Modal Overlay */}
                    <div className={`team-modal-overlay ${hoveredMember === index ? 'active' : ''}`}>
                      <div className="team-modal-content">
                        <p className="modal-bio">{member.bio}</p>
                      </div>
                    </div>
                  </div>

                  <div className="team1-text">
                    <p className="team-name">{member.name}</p>
                    <p>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='chev-next5' onClick={nextTeam}>
            <i className="fa-solid fa-chevron-right" id='next-btn5'></i>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="about-footer">
        <div className="about-footer-box">
          <h1>{t('about.cta.title')}</h1>
          <p>{t('about.cta.description')}</p>

          <div className="about-footer-buttons">
            <button className="btn1">{t('about.cta.buttons.contribute')}</button>
            <button className="btn2">{t('about.cta.buttons.explore')}</button>
          </div>

          <button className="btn3">{t('about.cta.buttons.contact')}</button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;