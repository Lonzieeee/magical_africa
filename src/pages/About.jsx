import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/about-page.css';
import '../styles/impact.css';
import '../styles/team.css';
import '../styles/AI.css';

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
  { number: 'fa-hands-helping', label: 'Community Ownership' },
  { number: 'fa-shield-halved', label: 'Ethical Stewardship' },
  { number: 'fa-seedling', label: 'Sustainable Impact' },
  { number: 'fa-globe-africa', label: 'Local & Pan-African' }
];

const achievements = [
  'Pan-African by design - Grounded locally, connected continent-wide ',
  'Community First - Communities are collaborators, not data sources ', 
  'Ethical by Default - Consent, fairness, and privacy are non-negotiable',
  'Cultural Respect - Language and culture are living systems  ',
  'Open & Collaborative - We support open knowledge and shared learning  ',
  'Human-Centered AI - Technology must serve people, not extract from them ',
  
];

const team = [
  { name: 'Gloria Machoka', role: 'Cofounder', image: '/images/Oromo.jpg' },
  { name: 'Steve Kombo', role: 'Founder', image: '/images/Zulu3.jpg' },
  { name: 'Joel Makori', role: 'Community Engagement Manager', image: '/images/Joel-Makori.jpeg' }
];

const About = () => {
  const [solutionSlide, setSolutionSlide] = useState(0);

  const nextSolution = () => {
    setSolutionSlide((prev) => (prev + 1) % 3);
  };

  const prevSolution = () => {
    setSolutionSlide((prev) => (prev - 1 + 3) % 3);
  };

  return (
    <>
      <div className="heroSection" style={{ backgroundImage: 'url(/images/pyramids.jpg)' }}>
        <Navbar />
        
        <div className="mission-vision">
          <h1>About Magical Africa</h1>
          {/*
          <p className="mission">
            Mission: To protect, preserve, and share the Real African Story, while empowering communities to own and profit from their culture.
          </p>
          <p className="vission">
            Vission: A world where every African child anywhere can access their culture, language, and identity with one click.
          </p>
           */}
    
         <p className='about-tagline'>

          Preserving African Languages. Empowering communities. Building the future.

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
         

          <h1>Our <span>Background</span></h1>
           
        <div className='background-text'>
         <p>
          Magical.africa is a pan-African organization working at the intersection of African languages, culture, education, and technology. We exist to support the continued use, growth, and sustainability of community languages across the continent.
         </p>

         <p>
          African languages are central to education, livelihoods, and social cohesion, yet many remain underrepresented in formal systems and digital spaces. Magical Africa addresses this gap through a community-centered, partnership-driven approach that brings together local knowledge holders, educators, researchers, and technology partners.
         </p>

         <p>
          By using technology as an enabling tool not a replacement we help integrate African languages and cultural knowledge into modern systems in ethical, inclusive, and sustainable ways.
         </p>

         </div>

        </div>
      </section>


       {/* Impact Section */}
      <section className="our-impact">
        <h1>Our Approach</h1>
        <p>We combine culture, technology, and education to empower communities and preserve African heritage.</p>

      

        <div className="impact-boxes">
          {impacts.map((impact, index) => (
            <div className="impact-div" key={index}>
              <i className={`fa-solid ${impact.number}  impact-icon`}></i>
              <p>{impact.label}</p>
            </div>
          ))}
        </div>
      </section>

     


      <section className="our-solution">
  <h1>What We do</h1>
 

  <div className="solution-box">
    <div className="chev-prev2" onClick={prevSolution}>
      <i className="fa-solid fa-chevron-left"></i>
    </div>

    <div className="solutions-carousel">
      <div 
        className="solutions-wrapper"
        style={{ transform: `translateX(-${solutionSlide * 100}%)` }}
      >
        {/* Pair 1 */}
        <div className="solution-pair">
          <div className="solution-text">
            <h2>African Language & Cultural Data Stewardship </h2>
            <p>We partner with communities to document, curate, and steward African languages and cultural practices in ways that respect local norms, histories, and priorities. Our work includes: </p>

            <ul>
              <li> <span></span>Spoken language and oral traditions </li>
              <li> <span></span>Visual culture and everyday practices </li>
              <li> <span></span>Visual culture and everyday practices </li>
              <li> <span></span>Multilingual documentation across African contexts </li>

            </ul>
          </div>
          <div 
            className="solution-image"
            style={{ backgroundImage: `url('public/images/kitenge.jpg')` }}
          ></div>
        </div>

        {/* Pair 2 */}
        <div className="solution-pair">
          <div className="solution-text">
              <h2>Community-Centered AI & Data Collection </h2>
            <p> Magical Africa designs and leads ethical, community-driven data collection processes that support inclusive AI development for African languages. We focus on: </p>

            <ul>
              <li> <span></span>Voice, text, and multimodal data  </li>
              <li><span></span>Real-world use contexts (education, culture, livelihoods) </li>
              <li> <span></span>Fair participation and compensation  </li>
              <li><span></span>Transparent data governance </li>

            </ul>
          </div>
          <div 
            className="solution-image"
            style={{ backgroundImage: `url('public/images/learn-language.jpg')` }}
          ></div>
        </div>

        {/* Pair 3 */}
        <div className="solution-pair">
          <div className="solution-text">
              <h2>Education & Cultural Knowledge Projects </h2>
            <p> We work in schools, learning spaces, and cultural settings across different African regions to support language learning, knowledge transmission, and intergenerational exchange. We focus on:  </p>

            <ul>
              <li> <span></span>Multilingual learning environments   </li>
              <li><span></span>Oral knowledge and storytelling  </li>
              <li><span></span>Cultural events and practices   </li>
              <li><span></span>Youth engagement and creative expression </li>

            </ul>
          </div>
          <div 
            className="solution-image"
            style={{ backgroundImage: `url('public/images/Oromo.jpg')` }}
          ></div>
        </div>
      </div>
    </div>

    <div className="chev-next2" onClick={nextSolution}>
      <i className="fa-solid fa-chevron-right"></i>
    </div>
  </div>
</section>

     

      {/* Achievements Section */}
      <section className="magical-achievements">
        <h1>Our Principles</h1>

        <div className="achievements">
          {achievements.map((achievement, index) => (
            <div className="achievement1" key={index}>
              <p>{achievement}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Section */}
      <div className='AI-section' style={{ backgroundImage: `url('public/images/drums2.jpg')`}}>

       <h1>How We Use AI</h1>

       <div className='AI-boxes'>

        <div className='AI-1'>
           <h1>Preparing Data for Inclusive AI </h1>
           <div>
            <p><span></span>Speech recognition (ASR) </p>
            <p><span></span>Text-to-speech (TTS) </p>
            <p><span></span>Voice-based learning tools </p>
            <p><span></span>Multimodal educational and cultural applications </p>
           </div>
        </div>
        <div className='AI-1'>

         <h1>AI-Assisted Research & Quality Review </h1>
           <div>
            <p><span></span>Assist with transcription and annotation workflows </p>
            <p><span></span>Identify gaps in language coverage </p>
            <p><span></span>Support quality checks always paired with human validation </p>
            
           </div>

        </div>
        <div className='AI-1'>
          <h1>Community-Driven Tools </h1>
           <div>
            <p><span></span>AI-enabled learning resources </p>
            <p><span></span>Voice-based and multimodal educational tools </p>
            <p><span></span>Cultural documentation platforms </p>
           
           </div>

        </div>

       </div>

      </div>


      <div className='working-with'>

        <h1>Who We Work With</h1>
        <p>We collaborate across Africa with</p>

      <div className='partnering img-a'>
        <div className='partner-a'>
           <img src="public/images/aws.webp" alt="AWS" />
        </div>

        <div className='partner-a img-b'>
           <img src="public/images/kuLogo.webp" alt="Kenyatta Univerity" />
        </div>

        <div className='partner-a img-c'>

         <img src="public/images/download.png" alt="UNESCO" width={80} />
        </div>

        <div className='partner-a img-d'>
          <img src="public/images/wikimedia.png" alt="Wikimedia-foundation" width={30} />

        </div>

        </div>

      </div>



      {/* Team Section */}
      <section className="team">
        <h1>Meet The Team</h1>
        <p>The passionate minds behind Magical Africa</p>

        <div className="team-section">
          {team.map((member, index) => (
            <div className="team1" key={index}>
              <div className="team1-image" style={{ backgroundImage: `url(${member.image})` }}></div>
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
