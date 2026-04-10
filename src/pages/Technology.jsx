


import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useAcademyNavigation from '../hooks/useAcademyNavigation'
import '../styles/technology.css'
import PageSeo from '../components/PageSeo'
import { SEO_CONTENT } from '../utils/seoContent'


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
        const navigate = useNavigate(); // 👈 1. create navigate
      
        // 👈 2. define the handler
        const handleNavigation = (path) => {
          navigate(path);
        };

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
      <PageSeo {...SEO_CONTENT.technology} />

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
            <a className='tech-cta-btn tech-cta-btn--primary' 
            onClick={()=> navigate('/academy')}
            >
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