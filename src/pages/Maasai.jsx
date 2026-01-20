import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/maasai.css';
import '../styles/community-description.css';
import '../styles/language-content.css';
import '../styles/culture.css';
import '../styles/leaders.css';
import '../styles/nature.css';
import '../styles/antiques.css';


// Tab configuration - 6 tabs matching the HTML
const tabs = [
  'Overview',
  'Language',
  'Culture & Traditions',
  'Leaders',
  'Nature & Wildlife',
  'Antiques'
];

// Data arrays
const phrases = [
  { phrase: 'Sopa', meaning: 'Hello (to one person)' },
  { phrase: 'Serian', meaning: 'Hello (to many people)' },
  { phrase: 'Asho Oleng', meaning: 'Thank you very much' },
  { phrase: 'Iko', meaning: 'Yes' },
  { phrase: 'Takwenya', meaning: 'Goodbye' }
];

const proverbs = [
  { phrase: 'Enkitoria enkerai', meaning: 'God does not sleep' },
  { phrase: 'Meidim enkai nalepo', meaning: 'Respect begets respect' },
  { phrase: 'Meishoo iyiook enkerai o\'nkera enkitoria', meaning: 'It takes a village to raise a child' }
];

const ceremonies = [
  { image: 'img1', title: 'Eunoto', desc: 'Coming of age ceremony where warriors transition to junior elders' },
  { image: 'img2', title: 'Enkipaata', desc: 'Pre-circumcision ceremony for young men' },
  { image: 'img3', title: 'Emuratare', desc: 'Circumcision ceremony marking transition to warrior status' },
  { image: 'img4', title: 'Enkang oo-nkiri', desc: 'Marriage ceremonies with traditional blessings' },
  { image: 'img5', title: 'Olngesherr', desc: 'Marriage ceremonies with traditional blessings' }
];

const foods = [
  { title: 'Nyama Choma', desc: 'Roasted meat, especially goat and beef' },
  { title: 'Olpurda', desc: 'Soup made from meat, bones, and herbs' },
  { title: 'Emuroto', desc: 'Ceremonial meat dishes' }
];

const leadersData = [
  [
    { name: 'Laibon Lenana', period: '1860 - 1911', desc: 'A powerful Maasai spiritual leader who played a key role during British colonization.', image: 'leader-img1' },
    { name: 'Olonana', period: '1870 - 1918', desc: 'Chief and Laibon who negotiated treaties to protect Maasai lands.', image: 'leader-img2' },
    { name: 'Mbatian', period: '1820 - 1890', desc: 'The most famous Laibon, known for his prophecies and unifying the Maasai.', image: 'leader-img3' }
  ],
  [
    { name: 'Ole Saibul', period: '1935 - 2012', desc: 'A prominent Maasai politician and advocate for pastoralist rights in Kenya.', image: 'leader-img4' },
    { name: 'William Ole Ntimama', period: '1927 - 2016', desc: 'Kenyan politician who championed Maasai land rights for decades.', image: 'leader-img5' },
    { name: 'Joseph Ole Lenku', period: '1966 - Present', desc: 'Current Governor of Kajiado County and former Cabinet Secretary.', image: 'leader-img6' }
  ]
];

const animals = [
  { name: 'Cattle', desc: 'Sacred gift from Enkai (God), central to Maasai identity and survival' },
  { name: 'Lions', desc: 'Respected as symbols of bravery; historically hunted by warriors in coming-of-age rituals' },
  { name: 'Elephants', desc: 'Revered for wisdom and strength; protected through traditional conservation' },
  { name: 'Giraffes', desc: 'Seen as graceful beings sharing their grazing lands' }
];

const antiques = [
  { name: 'Rungu (Throwing Club)', desc: 'Traditional wooden club used by warriors for protection and hunting' },
  { name: 'Shuka (Red Cloth)', desc: 'Iconic red checkered cloth worn as traditional dress' },
  { name: 'Beaded Jewelry', desc: 'Intricate beadwork representing status, age, and identity' },
  { name: 'Spear (Enkudi)', desc: 'Symbol of manhood and primary weapon of Maasai warriors' },
  { name: 'Shield (Olongu)', desc: 'Oval shields painted with distinctive patterns representing clan identity' },
  { name: 'Calabash (Enkukuri)', desc: 'Gourd containers used for storing milk and blood mixtures' }
];

const Maasai = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [leaderSlide, setLeaderSlide] = useState(0);
  const [expandedPhrases, setExpandedPhrases] = useState({});

  const nextLeaders = () => {
    setLeaderSlide((prev) => (prev + 1) % leadersData.length);
  };

  const prevLeaders = () => {
    setLeaderSlide((prev) => (prev - 1 + leadersData.length) % leadersData.length);
  };

  const togglePhrase = (id) => {
    setExpandedPhrases(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <>
      {/* Hero Section */}
      <div className="heroSection">
        <Navbar />
        
        <div className="Tribe-name">
          <h1>Maasai</h1>
          <p>The warriors of East Africa</p>
        </div>
      </div>

      {/* Location Overview */}
      <div className="location-page">
        <h1>Community <span>Overview</span></h1>

        <div className="location-page-icons">
          <div className="page-icon">
            <i className="fa-solid fa-location-dot"></i>
            <p className="p-1">LOCATION</p>
            <p className="p-2">Kenya, Tanzania</p>
          </div>

          <div className="page-icon">
            <i className="fa-solid fa-users"></i>
            <p className="p-1">POPULATION</p>
            <p className="p-2">1.5 million +</p>
          </div>

          <div className="page-icon">
            <i className="fa-solid fa-book-open"></i>
            <p className="p-1">LANGUAGE</p>
            <p className="p-2">Maa (Nilotic)</p>
          </div>

          <div className="page-icon">
            <i className="fa-solid fa-globe"></i>
            <p className="p-1">REGION</p>
            <p className="p-2">East Africa</p>
          </div>
        </div>
      </div>

      {/* Community Descriptions - Tab Navigation */}
      <div className="community-descriptions">
        <h1>About the Community</h1>

        <ul>
          {tabs.map((tab, index) => (
            <li
              key={index}
              className={activeTab === index ? 'active' : ''}
              onClick={() => setActiveTab(index)}
            >
              <span>{index + 1}</span>
              {tab}
            </li>
          ))}
        </ul>

        {/* ===== TAB 0: Overview Content ===== */}
        <div 
          className="overview-content" 
          style={{ display: activeTab === 0 ? 'flex' : 'none' }}
        >
          <div className="history-migration">
            <div className="history-text">
              <h1>History & Migration</h1>
              <p>
                The Maasai are a Nilotic ethnic group inhabiting northern, central and southern Kenya and northern Tanzania. They are among the best known local populations internationally due to their residence near many game parks of the African Great Lakes and their distinctive customs and dress.
              </p>
              <p>
                The Maasai speak the Maa language, a member of the Nilotic language family related to Dinka and Nuer. They are known for their unique culture, customs, and dress, as well as their reputation as fierce warriors and cattle herders. The Maasai have maintained much of their traditional lifestyle despite pressure from modern development.
              </p>
            </div>
            <div className="history-image"></div>
          </div>

          <div className="identity-life">
            <div className="identity-images">
              <div className="identity-image1"></div>
              <div className="identity-image2"></div>
            </div>
            <div className="identity-text">
              <h1>Identity & Lifestyle</h1>
              <p>
                The Maasai are semi-nomadic pastoralists who have traditionally relied on cattle, sheep, and goats for their livelihood. Cattle hold special significance in Maasai culture, representing wealth, status, and sustenance. The Maasai measure a man's wealth by the number of cattle and children he has.
              </p>
            </div>
          </div>
        </div>

        {/* ===== TAB 1: Language Content ===== */}
        <div 
          className="language-content" 
          style={{ display: activeTab === 1 ? 'flex' : 'none' }}
        >
          <div className="langauge-content-text">
            <h1>The Maa <span>Language</span></h1>
            <p>
              The Maa language is the traditional language of the Maasai people of East Africa.
              It is spoken mainly in Kenya and northern Tanzania, and it belongs to the Nilotic language family. Maa is more than just a means of communication — it plays a central role in preserving Maasai culture, identity, and oral traditions.
            </p>
            <div className="langauge-buttons">
              <button>Learn The Language</button>
              <button>Listen Audios</button>
            </div>
          </div>

          <div className="Common-phrases">
            <h1>Common Phrases & <span>Proverbs</span></h1>

            <div className="phrases">
              <div className="phrase-boxes">
                {phrases.map((item, index) => (
                  <div className="boxy" key={`phrase-${index}`}>
                    <p className="boxy-p1">
                      {item.phrase}
                      <i
                        className={`fa-solid fa-chevron-down toggle-icon ${expandedPhrases[`phrase-${index}`] ? 'rotate' : ''}`}
                        onClick={() => togglePhrase(`phrase-${index}`)}
                      ></i>
                    </p>
                    <p
                      className="boxy-p2"
                      style={{ display: expandedPhrases[`phrase-${index}`] ? 'block' : 'none' }}
                    >
                      {item.meaning}
                    </p>
                  </div>
                ))}
              </div>

              <div className="phrase-image">
                <div className="phrase-boxes">
                  {proverbs.map((item, index) => (
                    <div className="boxy" key={`proverb-${index}`}>
                      <p className="boxy-p1">
                        {item.phrase}
                        <i
                          className={`fa-solid fa-chevron-down toggle-icon ${expandedPhrases[`proverb-${index}`] ? 'rotate' : ''}`}
                          onClick={() => togglePhrase(`proverb-${index}`)}
                        ></i>
                      </p>
                      <p
                        className="boxy-p2"
                        style={{ display: expandedPhrases[`proverb-${index}`] ? 'block' : 'none' }}
                      >
                        {item.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="listen-audio">
            <div className="listen-audio-text">
              <h1>Listen to Traditional Greetings</h1>
              <p>
                Learn authentic Maa pronunciation directly from native speakers, preserving the true sounds, rhythm, and cultural meaning of the Maasai language.
              </p>
              <button className="play">Play Video</button>
            </div>
            <div className="listen-audio-video"></div>
          </div>
        </div>

        {/* ===== TAB 2: Culture & Traditions Content ===== */}
        <div 
          className="culture-traditions" 
          style={{ display: activeTab === 2 ? 'flex' : 'none' }}
        >
          <div className="culture1">
            <h1>Traditional Clothing & Adornment</h1>
            <p>
              The Maasai are renowned for their distinctive red clothing called "shuka." Red is the most important color, symbolizing bravery, unity, and blood. Both men and women wear elaborate beaded jewelry, with different colors and patterns signifying age, marital status, and social position.
            </p>
            <div className="beadwork-meaning">
              <button>Get Color Meanings</button>
            </div>
          </div>

          <div className="ceremonies">
            <h1>Ceremonies & Rites of Passage</h1>

            <div className="ceremonies-div">
              <div className="ceremonies-div1"></div>

              <div className="ceremonies-div2">
                {ceremonies.map((ceremony, index) => (
                  <div className="ceremony" key={index}>
                    <div className={`ceremony-image ${ceremony.image}`}></div>
                    <div className="ceremony-text">
                      <h1>{ceremony.title}</h1>
                      <p>{ceremony.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="foods">
            <h1>Foods & Cuisine</h1>

            <div className="food-section">
              {foods.map((food, index) => (
                <div className="food1" key={index}>
                  <div className="food-description">
                    <h1>{food.title}</h1>
                    <p>{food.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== TAB 3: Leaders Section ===== */}
        <section 
          className="leaders-section" 
          style={{ display: activeTab === 3 ? 'flex' : 'none' }}
        >
          <h1>Notable Leaders Past & Present</h1>

          <div className="leaders-container">
            <div className="chev-prev" onClick={prevLeaders}>
              <i className="fa-solid fa-chevron-left"></i>
            </div>

            <div className="leaders-carousel">
              <div
                className="leaders-wrappers"
                style={{ transform: `translateX(-${leaderSlide * 50}%)` }}
              >
                {leadersData.map((slide, slideIndex) => (
                  <div className="leaders-slide" key={slideIndex}>
                    {slide.map((leader, index) => (
                      <div className="leader1" key={index}>
                        <div className={`leader-image ${leader.image}`}></div>
                        <div className="leader-info">
                          <h2>{leader.name}</h2>
                          <p className="period">{leader.period}</p>
                          <p className="leader-desc">{leader.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="chev-next" onClick={nextLeaders}>
              <i className="fa-solid fa-chevron-right"></i>
            </div>
          </div>
        </section>

        {/* ===== TAB 4: Nature & Wildlife Section ===== */}
        <section 
          className="nature-interaction" 
          style={{ display: activeTab === 4 ? 'flex' : 'none' }}
        >
          <div className="nature-div">
            <div className="nature-text">
              <h1>Relationship with Nature</h1>
              <p>
                The Maasai have lived in harmony with wildlife for centuries, sharing the same ecosystem with lions, elephants, and other wildlife. Their pastoral lifestyle and traditional beliefs have helped preserve vast areas of wilderness.
              </p>
            </div>
            <div className="nature-image"></div>
          </div>

          <div className="sacred-animals">
            <h1>Sacred Animals & Beliefs</h1>

            <div className="animals">
              {animals.map((animal, index) => (
                <div className="animal1" key={index}>
                  <p>
                    <span>{animal.name}</span> - {animal.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TAB 5: Antiques Section (NEW) ===== */}
        <section 
          className="antiques-section" 
          style={{ display: activeTab === 5 ? 'flex' : 'none' }}
        >
          <div className="antiques-header">
            <h1>Traditional Artifacts & Antiques</h1>
            <p>
              The Maasai people have crafted distinctive tools, weapons, and adornments for centuries. These artifacts represent their rich cultural heritage and continue to be symbols of identity and tradition.
            </p>
          </div>

          <div className="antiques-grid">
            {antiques.map((item, index) => (
              <div className="antique-item" key={index}>
                <div className={`antique-image antique-img${index + 1}`}></div>
                <div className="antique-info">
                  <h2>{item.name}</h2>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="antiques-cta">
            
            <button>Visit Marketplace</button>
          </div>
        </section>
      </div>

      {/* Preserve Section - Always visible */}
      <section className="preserve-maasai">
        <div className="preserve-box">
          <h1>Help Us Preserve Maasai Heritage</h1>
          <p>Do you have stories, photos, or knowledge to share about Maasai culture?</p>
          <button>Contribute to This Page</button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Maasai;
