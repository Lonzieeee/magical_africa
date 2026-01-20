import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/about-page.css';
import '../styles/impact.css';
import '../styles/team.css';

const problems = [
  { icon: 'fa-earth-africa', title: 'Misrepresented Globally', desc: 'African stories told through foreign lenses, lacking authenticity and truth.' },
  { icon: 'fa-school', title: 'Under-taught in Schools', desc: 'Rich African history missing from educational curricula worldwide.' },
  { icon: 'fa-circle-dollar-to-slot', title: 'Commercialized by Outsiders', desc: 'African culture exploited for profit without benefiting its creators.' },
  { icon: 'fa-feather', title: 'Oral Tradition Fading', desc: 'Elders pass away, languages disappear, and stories fade into silence.' },
  { icon: 'fa-chain-broken', title: 'Lost Through Colonization', desc: 'Centuries of cultural erasure and systematic destruction of heritage.' },
  {icon: 'fa-people-arrows', title: 'Disconnected Diaspora', desc: 'Millions unable to access their roots and ancestral identity.' }

];

const solutions = [
  [
    { image: '/images/explore-identity.jpg', title: 'Learn Language', desc: 'Discover the beauty of African languages and connect with diverse cultures across the continent.' },
    { image: '/images/African-storytelling.jpg', title: 'Explore identity and tradition', desc: 'Uncover the journeys and movements that formed Africa’s diverse cultures and united its people through time.' },
    { image: '/images/drums.jpg', title: 'Stream folklore, music, and storytelling', desc: 'Uncover the roots of African identity and the timeless traditions passed through generations.' }
  ],
  [
    { image: '/images/hammer.jpg', title: 'Buy cultural merchandise made by Africans', desc: 'Buy authentic cultural merchandise handcrafted by Africans, celebrating heritage, creativity, and vibrant traditions.' },
    { image: '/images/Igbo.jpg', title: 'Book cultural experts, events', desc: 'Buy authentic cultural merchandise handcrafted by Africans, celebrating heritage, creativity, and vibrant traditions.' },
    { image: '/images/maasai-land.jpg', title: 'Discover history and migration', desc: 'Discover Africa\'s history and migration, uncovering cultures, journeys, traditions, and ancestral stories worldwide.' }
  ]
];

const impacts = [
  { number: '3000+', label: 'African tribes' },
  { number: '2000+', label: 'Languages Spoken' },
  { number: '200+', label: 'Stories to Preserve' },
  { number: '54', label: 'African countries' }
];

const achievements = [
  'Preserves endangered languages',
  'Digitizes history held by elders',
  'Creates jobs for local creators',
  'Connects diaspora to identity',
  'Promotes unity and pride',
  'Restores dignity to African storytelling',
  'Protects environmental wisdom',
  'Teaches real African history to the world'
];

const team = [
  { name: 'Gloria Machoka', role: 'Lead Developer' },
  { name: 'Steve Kombo', role: 'Founder' },
  { name: 'Benjamin Beto', role: 'UI/UX Designer' }
];

const About = () => {
  const [solutionSlide, setSolutionSlide] = useState(0);

  const nextSolution = () => {
    setSolutionSlide((prev) => (prev + 1) % solutions.length);
  };

  const prevSolution = () => {
    setSolutionSlide((prev) => (prev - 1 + solutions.length) % solutions.length);
  };

  return (
    <>
      <div className="heroSection" style={{ backgroundImage: 'url(/images/pyramids.jpg)' }}>
        <Navbar />
        
        <div className="mission-vision">
          <h1>About Magical Africa</h1>
          <p className="mission">
            Mission: To protect, preserve, and share the Real African Story, while empowering communities to own and profit from their culture.
          </p>
          <p className="vission">
            Vission: A world where every African child anywhere can access their culture, language, and identity with one click.
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
          <h1>The Problem We're Solving</h1>
          <p className="problem-text-p">
            Africa's rich cultural heritage is at risk. Languages are dying, traditions are fading, and the authentic African story is being lost or misrepresented.
          </p>
          
          <div className="problems">
            {problems.map((problem, index) => (
              <div className="problem1" key={index}>
                <span>
                  <i className={`fa-solid ${problem.icon}`}></i>
                </span>
                <div className="text2">
                  <h1>{problem.title}</h1>
                  <p>{problem.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="our-solution">
        <h1>Our Solution</h1>
        <p>
          Magical Africa is a comprehensive platform that preserves, celebrates, and shares African culture with the world.
        </p>

        <div className="solution-box">
          <div className="chev-prev2" onClick={prevSolution}>
            <i className="fa-solid fa-chevron-left"></i>
          </div>

          <div className="solutions-carousel">
            <div 
              className="solutions-wrapper"
              style={{ transform: `translateX(-${solutionSlide * 50}%)` }}
            >
              {solutions.map((slide, slideIndex) => (
                <div className="solutions-slide" key={slideIndex}>
                  {slide.map((solution, index) => (
                    <div 
                      className="solution1" 
                      key={index}
                      style={{ backgroundImage: `url(${solution.image})` }}
                    >
                      <div className="solution-content">
                        <h2>{solution.title}</h2>
                        <p>{solution.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="chev-next2" onClick={nextSolution}>
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="our-impact">
        <h1>Our Impact</h1>
        <p>Magical Africa blends culture, technology, education, economy, and legacy into one powerful experience</p>

        <div className="impact-boxes">
          {impacts.map((impact, index) => (
            <div className="impact-div" key={index}>
              <h1>{impact.number}</h1>
              <p>{impact.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="magical-achievements">
        <h1>What We Wish to Achieve</h1>

        <div className="achievements">
          {achievements.map((achievement, index) => (
            <div className="achievement1" key={index}>
              <p>{achievement}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="team">
        <h1>Meet The Team</h1>
        <p>The passionate minds behind Magical Africa</p>

        <div className="team-section">
          {team.map((member, index) => (
            <div className="team1" key={index}>
              <div className="team1-image"></div>
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
          <h1>Join Us in Preserving The Real African Story</h1>
          <p>Africa doesn't need to be explained by outsiders. We will tell our own story with dignity, accuracy, creativity, and pride.</p>

          <div className="about-footer-buttons">
            <button className="btn1">Contribute Your Story</button>
            <button className="btn2">Explore Communities</button>
          </div>

          <button className="btn3">Contact Us</button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
