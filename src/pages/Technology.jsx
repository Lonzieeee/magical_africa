
{/* 
import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Helmet } from 'react-helmet-async';
import useAcademyNavigation from "../hooks/useAcademyNavigation";
import '../styles/technology.css'

const aiFeatures = [
  {
    id: 'speech',
    icon: 'fa-microphone',
    tag: 'Recognition',
    title: 'Speech Recognition',
    description:
      'Specialized AI models trained on tonal African languages and dialects — languages often ignored by mainstream platforms like Google and OpenAI. Our models understand the tonal nuances that make each language unique.',
    stat: '2,000+',
    statLabel: 'African languages in scope',
    color: 'green',
  },
  {
    id: 'transcription',
    icon: 'fa-file-audio',
    tag: 'Digitization',
    title: 'Oral Transcription',
    description:
      'Automated digitization of oral storytelling — converting spoken heritage from elders into searchable, archivable, and shareable text. Centuries of wisdom, preserved before it is lost forever.',
    stat: '100%',
    statLabel: 'Automated pipeline',
    color: 'orange',
  },
  {
    id: 'indexing',
    icon: 'fa-layer-group',
    tag: 'Organization',
    title: 'Cultural Indexing',
    description:
      'Semantic AI that organizes proverbs, historical narratives, and cultural knowledge by community, region, and era — making African heritage discoverable in a way never before possible.',
    stat: '54',
    statLabel: 'African countries covered',
    color: 'green',
  },
  {
    id: 'recommendations',
    icon: 'fa-brain',
    tag: 'Personalization',
    title: 'Smart Recommendations',
    description:
      'AI-driven learning paths that match every user with the most relevant cultural stories, language lessons, and native speakers — adapting in real time to their progress and interests.',
    stat: '10M+',
    statLabel: 'Target active users by Year 3',
    color: 'orange',
  },
  {
    id: 'regeneration',
    icon: 'fa-magic',
    tag: 'Creation',
    title: 'Content Regeneration',
    description:
      'AI-assisted reconstruction of fragmented oral histories and automatic adaptation of traditional folklore into modern children\'s content — bridging generations through technology.',
    stat: '500+',
    statLabel: 'Cultural creators at launch',
    color: 'green',
  },
  {
    id: 'tools',
    icon: 'fa-tools',
    tag: 'Empowerment',
    title: 'Creator AI Tools',
    description:
      'A full suite of tools empowering elders, artists, and storytellers to publish, monetize, and preserve their heritage digitally — no technical knowledge required. The platform does the heavy lifting.',
    stat: '10-20%',
    statLabel: 'Revenue share for creators',
    color: 'orange',
  },
]

const pillars = [
  { icon: 'fa-shield-alt', label: 'Ethical AI', desc: 'Community-first development' },
  { icon: 'fa-globe-africa', label: 'Pan-African', desc: 'All 54 nations in scope' },
  { icon: 'fa-lock', label: 'Data Sovereignty', desc: 'Communities own their data' },
  { icon: 'fa-chart-line', label: 'Scalable', desc: 'Built for 10M+ users' },
]

const Technology = () => {
  const [visibleCards, setVisibleCards] = useState(new Set())
  const cardRefs = useRef([])
  const pillarsRef = useRef(null)
  const [pillarsVisible, setPillarsVisible] = useState(false)
  const goToAcademy = useAcademyNavigation();



  useEffect(() => {
    const observers = []

    cardRefs.current.forEach((ref, i) => {
      if (!ref) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleCards(prev => new Set([...prev, i]))
            }, i * 100)
          }
        },
        { threshold: 0.15 }
      )
      obs.observe(ref)
      observers.push(obs)
    })

    const pillarsObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setPillarsVisible(true) },
      { threshold: 0.2 }
    )
    if (pillarsRef.current) pillarsObs.observe(pillarsRef.current)
    observers.push(pillarsObs)

    return () => observers.forEach(obs => obs.disconnect())
  }, [])

  return (
    <>


<Helmet>
  <title>Technology | Magical Africa</title>
  <meta name="description" content="Discover how Magical Africa uses proprietary AI to preserve 2,000+ African languages, digitize oral heritage, and deliver personalized cultural learning at scale." />
  <meta name="keywords" content="Magical Africa technology, African AI, African language AI, African language preservation, speech recognition Africa" />
  <meta property="og:title" content="Magical Africa — AI Technology for African Heritage" />
  <meta property="og:description" content="Proprietary AI models built specifically for African linguistic complexity and cultural depth — preserving 2,000+ languages ignored by mainstream platforms." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://magical.africa/technology" />
  <meta property="og:image" content="https://magical.africa/images/AI-woman.png" />
</Helmet>


      <Navbar />

     
      <section
        className='tech-hero'
        style={{ backgroundImage: 'url(/images/AI-woman.png)' }}
      >
        <div className='tech-hero-overlay' />
        <div className='tech-hero-content'>
          <span className='tech-eyebrow'>
            <i className='fa-solid fa-microchip'></i>
            AI Technology
          </span>
          <h1>
            Built for Africa,<br />
            <span>Powered by AI</span>
          </h1>
          <p className='tech-hero-sub'>
            Proprietary models built specifically for African linguistic complexity,
            cultural depth, and the preservation of 2,000+ languages — ignored by
            mainstream AI for too long.
          </p>
          <div className='tech-hero-stats'>
            <div className='tech-hero-stat'>
              <strong>2,000+</strong>
              <span>African Languages</span>
            </div>
            <div className='tech-hero-divider' />
            <div className='tech-hero-stat'>
              <strong>&lt;1%</strong>
              <span>Digital Representation</span>
            </div>
            <div className='tech-hero-divider' />
            <div className='tech-hero-stat'>
              <strong>140M+</strong>
              <span>Diaspora Users</span>
            </div>
          </div>
        </div>
      </section>

     
      <section className='tech-intro-strip'>
        <div className='tech-intro-inner'>
          <div className='tech-intro-text'>
            <h2>The Problem We're Solving</h2>
            <p>
              African languages represent less than 1% of all digital content. As elders pass on,
              centuries of oral wisdom disappear with them. Magical Africa uses AI to reverse this — 
              digitizing, preserving, and teaching African heritage at scale.
            </p>
          </div>
          <div className='tech-intro-quote'>
            <blockquote>
              "Preserving the wisdom of the elders for the children of tomorrow."
            </blockquote>
          </div>
        </div>
      </section>

  
      <section className='tech-features-section'>
        <div className='tech-section-heading'>
          <span className='tech-section-line' />
          <h2>Our AI Capabilities</h2>
          <span className='tech-section-line' />
        </div>
        <p className='tech-section-sub'>
          Six core AI systems working together to preserve and teach African heritage.
        </p>

        <div className='tech-features-grid'>
          {aiFeatures.map((feature, i) => (
            <article
              key={feature.id}
              ref={el => (cardRefs.current[i] = el)}
              className={`tech-feature-card tech-feature-card--${feature.color} ${visibleCards.has(i) ? 'is-visible' : ''}`}
            >
              <div className='tech-card-top'>
                <div className={`tech-card-icon-wrap tech-card-icon-wrap--${feature.color}`}>
                  <i className={`fa-solid ${feature.icon}`}></i>
                </div>
                <span className='tech-card-tag'>{feature.tag}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className={`tech-card-stat tech-card-stat--${feature.color}`}>
                <strong>{feature.stat}</strong>
                <span>{feature.statLabel}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

     
      <section
        className='tech-pillars-section'
        style={{ backgroundImage: 'url(/images/African-landscape-latest.jpg)' }}
        ref={pillarsRef}
      >
        <div className='tech-pillars-overlay' />
        <div className='tech-pillars-content'>
          <div className='tech-section-heading light'>
            <span className='tech-section-line light' />
            <h2>Our AI Principles</h2>
            <span className='tech-section-line light' />
          </div>
          <div className={`tech-pillars-grid ${pillarsVisible ? 'is-visible' : ''}`}>
            {pillars.map((p, i) => (
              <div key={p.label} className='tech-pillar' style={{ transitionDelay: `${i * 120}ms` }}>
                <div className='tech-pillar-icon'>
                  <i className={`fa-solid ${p.icon}`}></i>
                </div>
                <h3>{p.label}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='tech-how-section'>
        <div className='tech-section-heading'>
          <span className='tech-section-line' />
          <h2>How It Works</h2>
          <span className='tech-section-line' />
        </div>
        <div className='tech-timeline'>
          {[
            { step: '01', title: 'Capture', desc: 'Elders, artists and storytellers record oral content through the Magical Africa Creator Platform — audio, video, and text.' },
            { step: '02', title: 'Transcribe', desc: 'Our Speech Recognition AI converts spoken African languages into text, handling tonal variations and dialects with precision.' },
            { step: '03', title: 'Index', desc: 'Cultural Indexing AI categorizes and tags the content by language, region, tribe, and topic — making it fully searchable.' },
            { step: '04', title: 'Deliver', desc: 'Smart Recommendation AI serves the right content to the right learner — in their language, at their pace, on any device.' },
          ].map((item, i) => (
            <div key={item.step} className='tech-timeline-item'>
              <div className='tech-timeline-step'>
                <span>{item.step}</span>
              </div>
              {i < 3 && <div className='tech-timeline-connector' />}
              <div className='tech-timeline-body'>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className='tech-cta'
        style={{ backgroundImage: 'url(/images/learn-language-kids.jpg)' }}
      >
        <div className='tech-cta-overlay' />
        <div className='tech-cta-content'>
          <div className='tech-section-heading light'>
            <span className='tech-section-line light' />
            <h2>Join the Movement</h2>
            <span className='tech-section-line light' />
          </div>
          <p>
            Help us build the largest digital repository of African linguistic
            and cultural knowledge. Whether you are a creator, learner, or investor
            — there is a place for you at Magical Africa.
          </p>
          <div className='tech-cta-btns'>
            <a href='/academy-page' className='tech-cta-btn tech-cta-btn--primary'>
              Explore the Academy
            </a>
            <a className='tech-cta-btn tech-cta-btn--secondary' onClick={goToAcademy}>
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Technology
*/}


import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Helmet } from 'react-helmet-async'
import useAcademyNavigation from '../hooks/useAcademyNavigation'
import '../styles/technology.css'

const aiFeatureIds = ['speech', 'transcription', 'indexing', 'recommendations', 'regeneration', 'tools']
const aiFeatureIcons = {
  speech: 'fa-microphone',
  transcription: 'fa-file-audio',
  indexing: 'fa-layer-group',
  recommendations: 'fa-brain',
  regeneration: 'fa-magic',
  tools: 'fa-tools'
}
const aiFeatureColors = {
  speech: 'green',
  transcription: 'orange',
  indexing: 'green',
  recommendations: 'orange',
  regeneration: 'green',
  tools: 'orange'
}

const pillarIds = ['ethical', 'panAfrican', 'sovereignty', 'scalable']
const pillarIcons = {
  ethical: 'fa-shield-alt',
  panAfrican: 'fa-globe-africa',
  sovereignty: 'fa-lock',
  scalable: 'fa-chart-line'
}

const stepIds = ['capture', 'transcribe', 'index', 'deliver']

const Technology = () => {
  const { t } = useTranslation()
  const [visibleCards, setVisibleCards] = useState(new Set())
  const cardRefs = useRef([])
  const pillarsRef = useRef(null)
  const [pillarsVisible, setPillarsVisible] = useState(false)
  const goToAcademy = useAcademyNavigation()

  useEffect(() => {
    const observers = []

    cardRefs.current.forEach((ref, i) => {
      if (!ref) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleCards(prev => new Set([...prev, i]))
            }, i * 100)
          }
        },
        { threshold: 0.15 }
      )
      obs.observe(ref)
      observers.push(obs)
    })

    const pillarsObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setPillarsVisible(true) },
      { threshold: 0.2 }
    )
    if (pillarsRef.current) pillarsObs.observe(pillarsRef.current)
    observers.push(pillarsObs)

    return () => observers.forEach(obs => obs.disconnect())
  }, [])

  return (
    <>
      <Helmet>
        <title>{t('technology.helmet.title')}</title>
        <meta name='description' content={t('technology.helmet.description')} />
        <meta name='keywords' content={t('technology.helmet.keywords')} />
        <meta property='og:title' content={t('technology.helmet.ogTitle')} />
        <meta property='og:description' content={t('technology.helmet.ogDescription')} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://magical.africa/technology' />
        <meta property='og:image' content='https://magical.africa/images/AI-woman.png' />
      </Helmet>

      <Navbar />

      {/* ── HERO ── */}
      <section
        className='tech-hero'
        style={{ backgroundImage: 'url(/images/AI-woman.png)' }}
      >
        <div className='tech-hero-overlay' />
        <div className='tech-hero-content'>
          <span className='tech-eyebrow'>
            <i className='fa-solid fa-microchip'></i>
            {t('technology.hero.eyebrow')}
          </span>
          <h1>
            {t('technology.hero.title1')}<br />
            <span>{t('technology.hero.title2')}</span>
          </h1>
          <p className='tech-hero-sub'>
            {t('technology.hero.subtitle')}
          </p>
          <div className='tech-hero-stats'>
            <div className='tech-hero-stat'>
              <strong>{t('technology.hero.stat1Value')}</strong>
              <span>{t('technology.hero.stat1Label')}</span>
            </div>
            <div className='tech-hero-divider' />
            <div className='tech-hero-stat'>
              <strong>{t('technology.hero.stat2Value')}</strong>
              <span>{t('technology.hero.stat2Label')}</span>
            </div>
            <div className='tech-hero-divider' />
            <div className='tech-hero-stat'>
              <strong>{t('technology.hero.stat3Value')}</strong>
              <span>{t('technology.hero.stat3Label')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO STRIP ── */}
      <section className='tech-intro-strip'>
        <div className='tech-intro-inner'>
          <div className='tech-intro-text'>
            <h2>{t('technology.intro.title')}</h2>
            <p>{t('technology.intro.description')}</p>
          </div>
          <div className='tech-intro-quote'>
            <blockquote>
              "{t('technology.intro.quote')}"
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── AI FEATURES GRID ── */}
      <section className='tech-features-section'>
        <div className='tech-section-heading'>
          <span className='tech-section-line' />
          <h2>{t('technology.features.sectionTitle')}</h2>
          <span className='tech-section-line' />
        </div>
        <p className='tech-section-sub'>
          {t('technology.features.sectionSubtitle')}
        </p>

        <div className='tech-features-grid'>
          {aiFeatureIds.map((id, i) => (
            <article
              key={id}
              ref={el => (cardRefs.current[i] = el)}
              className={`tech-feature-card tech-feature-card--${aiFeatureColors[id]} ${visibleCards.has(i) ? 'is-visible' : ''}`}
            >
              <div className='tech-card-top'>
                <div className={`tech-card-icon-wrap tech-card-icon-wrap--${aiFeatureColors[id]}`}>
                  <i className={`fa-solid ${aiFeatureIcons[id]}`}></i>
                </div>
                <span className='tech-card-tag'>{t(`technology.features.items.${id}.tag`)}</span>
              </div>
              <h3>{t(`technology.features.items.${id}.title`)}</h3>
              <p>{t(`technology.features.items.${id}.description`)}</p>
              <div className={`tech-card-stat tech-card-stat--${aiFeatureColors[id]}`}>
                <strong>{t(`technology.features.items.${id}.stat`)}</strong>
                <span>{t(`technology.features.items.${id}.statLabel`)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── AI PILLARS ── */}
      <section
        className='tech-pillars-section'
        style={{ backgroundImage: 'url(/images/African-landscape-latest.jpg)' }}
        ref={pillarsRef}
      >
        <div className='tech-pillars-overlay' />
        <div className='tech-pillars-content'>
          <div className='tech-section-heading light'>
            <span className='tech-section-line light' />
            <h2>{t('technology.pillars.sectionTitle')}</h2>
            <span className='tech-section-line light' />
          </div>
          <div className={`tech-pillars-grid ${pillarsVisible ? 'is-visible' : ''}`}>
            {pillarIds.map((id, i) => (
              <div key={id} className='tech-pillar' style={{ transitionDelay: `${i * 120}ms` }}>
                <div className='tech-pillar-icon'>
                  <i className={`fa-solid ${pillarIcons[id]}`}></i>
                </div>
                <h3>{t(`technology.pillars.items.${id}.label`)}</h3>
                <p>{t(`technology.pillars.items.${id}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS TIMELINE ── */}
      <section className='tech-how-section'>
        <div className='tech-section-heading'>
          <span className='tech-section-line' />
          <h2>{t('technology.howItWorks.sectionTitle')}</h2>
          <span className='tech-section-line' />
        </div>
        <div className='tech-timeline'>
          {stepIds.map((id, i) => (
            <div key={id} className='tech-timeline-item'>
              <div className='tech-timeline-step'>
                <span>{t(`technology.howItWorks.steps.${id}.step`)}</span>
              </div>
              {i < stepIds.length - 1 && <div className='tech-timeline-connector' />}
              <div className='tech-timeline-body'>
                <h3>{t(`technology.howItWorks.steps.${id}.title`)}</h3>
                <p>{t(`technology.howItWorks.steps.${id}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className='tech-cta'
        style={{ backgroundImage: 'url(/images/learn-language-kids.jpg)' }}
      >
        <div className='tech-cta-overlay' />
        <div className='tech-cta-content'>
          <div className='tech-section-heading light'>
            <span className='tech-section-line light' />
            <h2>{t('technology.cta.sectionTitle')}</h2>
            <span className='tech-section-line light' />
          </div>
          <p>{t('technology.cta.description')}</p>
          <div className='tech-cta-btns'>
            <a href='/academy-page' className='tech-cta-btn tech-cta-btn--primary'>
              {t('technology.cta.exploreBtn')}
            </a>
            <a className='tech-cta-btn tech-cta-btn--secondary' onClick={goToAcademy}>
              {t('technology.cta.startBtn')}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Technology