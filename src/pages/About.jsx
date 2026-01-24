import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/about-page.css';
import '../styles/impact.css';
import '../styles/team.css';
import '../styles/AI.css';

const About = () => {
  const { t } = useTranslation();
  const [solutionSlide, setSolutionSlide] = useState(0);

  const nextSolution = () => {
    setSolutionSlide((prev) => (prev + 1) % 3);
  };

  const prevSolution = () => {
    setSolutionSlide((prev) => (prev - 1 + 3) % 3);
  };

  const approaches = [
    { icon: 'fa-hands-helping', label: t('about.approach.items.communityOwnership') },
    { icon: 'fa-shield-halved', label: t('about.approach.items.ethicalStewardship') },
    { icon: 'fa-seedling', label: t('about.approach.items.sustainableImpact') },
    { icon: 'fa-globe-africa', label: t('about.approach.items.localPanAfrican') }
  ];

  const principles = t('about.principles.items', { returnObjects: true });

  const team = [
    { name: t('about.team.members.gloria.name'), role: t('about.team.members.gloria.role'), image: '/images/Gloria(1).jpeg' },
    { name: t('about.team.members.steve.name'), role: t('about.team.members.steve.role'), image: '/images/Steve.jpeg' },
    { name: t('about.team.members.joel.name'), role: t('about.team.members.joel.role'), image: '/images/Joel-Makori.jpeg' }
  ];

  return (
    <>
      <div className="heroSection" style={{ backgroundImage: 'url(/images/pyramids.jpg)' }}>
        <Navbar />
        
        <div className="mission-vision">
          <h1>{t('about.hero.title')}</h1>
          <p className='about-tagline'>
            {t('about.hero.tagline')}
          </p>
        </div>
      </div>

      {/* Problem Section */}
      <section className="problem-page">
        <div 
          className="problem-image"
          style={{ backgroundImage: 'url(/images/Learn-Language2.jpg)' }}
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

        <div className="impact-boxes">
          {approaches.map((item, index) => (
            <div className="impact-div" key={index}>
              <i className={`fa-solid ${item.icon} impact-icon`}></i>
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
                  style={{ backgroundImage: `url('/images/kitenge.jpg')` }}
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
                  style={{ backgroundImage: `url('/images/learn-language.jpg')` }}
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
                  style={{ backgroundImage: `url('/images/Oromo.jpg')` }}
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
      <div className='AI-section' style={{ backgroundImage: `url('/images/drums2.jpg')` }}>

    
        <h1>{t('about.ai.title')}</h1>
     <div className='AI-boxes'>
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

        <div className='partnering img-a'>
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

      {/* Team Section */}
      <section className="team">
        <h1>{t('about.team.title')}</h1>
        <p>{t('about.team.description')}</p>

        <div className="team-section">
          {team.map((member, index) => (
            <div className="team1" key={index}>
              <div className="team1-image">
                <img src={member.image} alt="" />
              </div>
              <div className="team1-text">
                <p className="team-name">{member.name}</p>
                <p>{member.role}</p>
              </div>
            </div>
          ))}
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