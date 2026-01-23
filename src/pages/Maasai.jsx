import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/maasai.css';
import '../styles/community-description.css';
import '../styles/language-content.css';
import '../styles/culture.css';
import '../styles/leaders.css';
import '../styles/nature.css';
import '../styles/antiques.css';

const Maasai = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [leaderSlide, setLeaderSlide] = useState(0);
  const [expandedPhrases, setExpandedPhrases] = useState({});
  const { t } = useTranslation();

  const tabs = [
    t('maasai.tabs.overview'),
    t('maasai.tabs.language'),
    t('maasai.tabs.culture'),
    t('maasai.tabs.leaders'),
    t('maasai.tabs.nature'),
    t('maasai.tabs.antiques')
  ];

  const phrases = [
    { phrase: 'Sopa', meaning: t('maasai.language.phrases.sopa') },
    { phrase: 'Serian', meaning: t('maasai.language.phrases.serian') },
    { phrase: 'Asho Oleng', meaning: t('maasai.language.phrases.ashoOleng') },
    { phrase: 'Iko', meaning: t('maasai.language.phrases.iko') },
    { phrase: 'Takwenya', meaning: t('maasai.language.phrases.takwenya') }
  ];

  const proverbs = [
    { phrase: 'Enkitoria enkerai', meaning: t('maasai.language.proverbs.enkitoria') },
    { phrase: 'Meidim enkai nalepo', meaning: t('maasai.language.proverbs.meidim') },
    { phrase: "Meishoo iyiook enkerai o'nkera enkitoria", meaning: t('maasai.language.proverbs.meishoo') }
  ];

  const ceremonies = [
    { image: 'img1', title: t('maasai.culture.ceremonies.eunoto.title'), desc: t('maasai.culture.ceremonies.eunoto.desc') },
    { image: 'img2', title: t('maasai.culture.ceremonies.enkipaata.title'), desc: t('maasai.culture.ceremonies.enkipaata.desc') },
    { image: 'img3', title: t('maasai.culture.ceremonies.emuratare.title'), desc: t('maasai.culture.ceremonies.emuratare.desc') },
    { image: 'img4', title: t('maasai.culture.ceremonies.enkang.title'), desc: t('maasai.culture.ceremonies.enkang.desc') },
    { image: 'img5', title: t('maasai.culture.ceremonies.olngesherr.title'), desc: t('maasai.culture.ceremonies.olngesherr.desc') }
  ];

  const foods = [
    { title: t('maasai.culture.foods.nyamaChoma.title'), desc: t('maasai.culture.foods.nyamaChoma.desc') },
    { title: t('maasai.culture.foods.olpurda.title'), desc: t('maasai.culture.foods.olpurda.desc') },
    { title: t('maasai.culture.foods.emuroto.title'), desc: t('maasai.culture.foods.emuroto.desc') }
  ];

  const leadersData = [
    [
      { name: t('maasai.leaders.laibonLenana.name'), period: '1860 - 1911', desc: t('maasai.leaders.laibonLenana.desc'), image: 'leader-img1' },
      { name: t('maasai.leaders.olonana.name'), period: '1870 - 1918', desc: t('maasai.leaders.olonana.desc'), image: 'leader-img2' },
      { name: t('maasai.leaders.mbatian.name'), period: '1820 - 1890', desc: t('maasai.leaders.mbatian.desc'), image: 'leader-img3' }
    ],
    [
      { name: t('maasai.leaders.oleSaibul.name'), period: '1935 - 2012', desc: t('maasai.leaders.oleSaibul.desc'), image: 'leader-img4' },
      { name: t('maasai.leaders.oleNtimama.name'), period: '1927 - 2016', desc: t('maasai.leaders.oleNtimama.desc'), image: 'leader-img5' },
      { name: t('maasai.leaders.oleLenku.name'), period: '1966 - Present', desc: t('maasai.leaders.oleLenku.desc'), image: 'leader-img6' }
    ]
  ];

  const animals = [
    { name: t('maasai.nature.animals.cattle.name'), desc: t('maasai.nature.animals.cattle.desc') },
    { name: t('maasai.nature.animals.lions.name'), desc: t('maasai.nature.animals.lions.desc') },
    { name: t('maasai.nature.animals.elephants.name'), desc: t('maasai.nature.animals.elephants.desc') },
    { name: t('maasai.nature.animals.giraffes.name'), desc: t('maasai.nature.animals.giraffes.desc') }
  ];

  const antiques = [
    { name: t('maasai.antiques.rungu.name'), desc: t('maasai.antiques.rungu.desc') },
    { name: t('maasai.antiques.shuka.name'), desc: t('maasai.antiques.shuka.desc') },
    { name: t('maasai.antiques.beadedJewelry.name'), desc: t('maasai.antiques.beadedJewelry.desc') },
    { name: t('maasai.antiques.spear.name'), desc: t('maasai.antiques.spear.desc') },
    { name: t('maasai.antiques.shield.name'), desc: t('maasai.antiques.shield.desc') },
    { name: t('maasai.antiques.calabash.name'), desc: t('maasai.antiques.calabash.desc') }
  ];

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
          <h1>{t('maasai.hero.title')}</h1>
          <p>{t('maasai.hero.subtitle')}</p>
        </div>
      </div>

      {/* Location Overview */}
      <div className="location-page">
        <h1>{t('maasai.overview.title')} <span>{t('maasai.overview.titleSpan')}</span></h1>

        <div className="location-page-icons">
          <div className="page-icon">
            <i className="fa-solid fa-location-dot"></i>
            <p className="p-1">{t('maasai.overview.location')}</p>
            <p className="p-2">Kenya, Tanzania</p>
          </div>

          <div className="page-icon">
            <i className="fa-solid fa-users"></i>
            <p className="p-1">{t('maasai.overview.population')}</p>
            <p className="p-2">1.5 million +</p>
          </div>

          <div className="page-icon">
            <i className="fa-solid fa-book-open"></i>
            <p className="p-1">{t('maasai.overview.language')}</p>
            <p className="p-2">Maa (Nilotic)</p>
          </div>

          <div className="page-icon">
            <i className="fa-solid fa-globe"></i>
            <p className="p-1">{t('maasai.overview.region')}</p>
            <p className="p-2">{t('maasai.overview.regionValue')}</p>
          </div>
        </div>
      </div>

      {/* Community Descriptions - Tab Navigation */}
      <div className="community-descriptions">
        <h1>{t('maasai.about.title')}</h1>

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
              <h1>{t('maasai.about.history.title')}</h1>
              <p>{t('maasai.about.history.p1')}</p>
              <p>{t('maasai.about.history.p2')}</p>
            </div>
            <div className="history-image"></div>
          </div>

          <div className="identity-life">
            <div className="identity-images">
              <div className="identity-image1"></div>
              <div className="identity-image2"></div>
            </div>
            <div className="identity-text">
              <h1>{t('maasai.about.identity.title')}</h1>
              <p>{t('maasai.about.identity.description')}</p>
            </div>
          </div>
        </div>

        {/* ===== TAB 1: Language Content ===== */}
        <div 
          className="language-content" 
          style={{ display: activeTab === 1 ? 'flex' : 'none' }}
        >
          <div className="langauge-content-text">
            <h1>{t('maasai.language.title')} <span>{t('maasai.language.titleSpan')}</span></h1>
            <p>{t('maasai.language.description')}</p>
            <div className="langauge-buttons">
              <button>{t('maasai.language.learnButton')}</button>
              <button>{t('maasai.language.listenButton')}</button>
            </div>
          </div>

          <div className="Common-phrases">
            <h1>{t('maasai.language.phrasesTitle')} <span>{t('maasai.language.proverbsSpan')}</span></h1>

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
              <h1>{t('maasai.language.audio.title')}</h1>
              <p>{t('maasai.language.audio.description')}</p>
              <button className="play">{t('maasai.language.audio.playButton')}</button>
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
            <h1>{t('maasai.culture.clothing.title')}</h1>
            <p>{t('maasai.culture.clothing.description')}</p>
            <div className="beadwork-meaning">
              <button>{t('maasai.culture.clothing.button')}</button>
            </div>
          </div>

          <div className="ceremonies">
            <h1>{t('maasai.culture.ceremoniesTitle')}</h1>

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
            <h1>{t('maasai.culture.foodsTitle')}</h1>

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
          <h1>{t('maasai.leaders.title')}</h1>

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
              <h1>{t('maasai.nature.title')}</h1>
              <p>{t('maasai.nature.description')}</p>
            </div>
            <div className="nature-image"></div>
          </div>

          <div className="sacred-animals">
            <h1>{t('maasai.nature.animalsTitle')}</h1>

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

        {/* ===== TAB 5: Antiques Section ===== */}
        <section 
          className="antiques-section" 
          style={{ display: activeTab === 5 ? 'flex' : 'none' }}
        >
          <div className="antiques-header">
            <h1>{t('maasai.antiques.title')}</h1>
            <p>{t('maasai.antiques.description')}</p>
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
            <button>{t('maasai.antiques.button')}</button>
          </div>
        </section>
      </div>

      {/* Preserve Section */}
      <section className="preserve-maasai">
        <div className="preserve-box">
          <h1>{t('maasai.preserve.title')}</h1>
          <p>{t('maasai.preserve.description')}</p>
          <button>{t('maasai.preserve.button')}</button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Maasai;