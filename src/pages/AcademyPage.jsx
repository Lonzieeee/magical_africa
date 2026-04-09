import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import useAcademyNavigation from "../hooks/useAcademyNavigation";
import '../styles/academy-page.css';

const courses = [
  { key: 'swahili', image: '/images/learn-language-kids.jpg', tag: 'Language', badge: 'Habari!' },
  { key: 'drumming', image: '/images/drums2-latest.jpg',      tag: 'Music' },
  { key: 'beadwork', image: '/images/kitenge-latest.jpg',     tag: 'Crafts' },
  { key: 'cooking',  image: '/images/Oromo2.jpg',             tag: 'Culture' },
];

const languages = ['Swahili', 'Yoruba', 'Zulu', 'Hausa', 'Amharic'];

const languageIcons = {
  Swahili: 'fa-comments',
  Yoruba:  'fa-comments',
  Zulu:    'fa-hands',
  Hausa:   'fa-landmark',
  Amharic: 'fa-star',
};

const communityKeys = ['liveClasses', 'forums', 'mentorship'];
const communityIcons = {
  liveClasses: 'fa-circle-play',
  forums:      'fa-comment-dots',
  mentorship:  'fa-handshake',
};

const AcademyPage = () => {
  const { t } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState('Swahili');
  const [searchQuery, setSearchQuery] = useState('');

  const featuresRef  = useRef(null);
  const coursesRef   = useRef(null);
  const langRef      = useRef(null);
  const communityRef = useRef(null);
  const goToAcademy  = useAcademyNavigation();

  const useReveal = (ref, childSelector, baseClass, visibleClass, delay = 150) => {
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const children = entry.target.querySelectorAll(childSelector);
            if (entry.isIntersecting) {
              children.forEach((el, i) => {
                setTimeout(() => el.classList.add(visibleClass), i * delay);
              });
            } else {
              children.forEach((el) => el.classList.remove(visibleClass));
            }
          });
        },
        { threshold: 0.15 }
      );
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, []);
  };

  useReveal(featuresRef,  '.academy-feature',  'academy-feature',  'feature-visible');
  useReveal(coursesRef,   '.course-card',       'course-card',       'card-visible');
  useReveal(langRef,      '.lang-chip',         'lang-chip',         'chip-visible');
  useReveal(communityRef, '.community-card',    'community-card',    'comm-visible');

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      scrollToCourses();
    }
  };

  return (
    <>
      <Helmet>
  <title>Academy | Magical Africa</title>
  <meta name="description" content="Learn African languages, cultural arts, and creative skills through Magical Africa Academy — your gateway to pan-African knowledge." />
  <meta name="keywords" content="Magical Africa Academy, African courses, learn African languages, African arts, African culture courses" />
  <meta property="og:title" content="Magical Africa Academy" />
  <meta property="og:description" content="Learn African languages, cultural arts, and creative skills through Magical Africa Academy — your gateway to pan-African knowledge." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://magical.africa/academy" />
  <meta property="og:image" content="https://magical.africa/images/photorealistic-portrait-african-woman.jpg" />
</Helmet>


      {/* ── HERO ── */}
      <div
        className="academy-hero"
        style={{ backgroundImage: 'url(/images/photorealistic-portrait-african-woman.jpg)' }}
      >
        <Navbar />
        <div className="academy-hero-content">
          <p className="academy-eyebrow">{t('academy.hero.eyebrow')}</p>
          <h1>
            {t('academy.hero.titleStart')}<br />
            <span>{t('academy.hero.titleAccent')}</span>
          </h1>
          <p className="academy-hero-sub">{t('academy.hero.description')}</p>

          {/* ── SEARCH BAR ── */}
          <form className="academy-hero-search" onSubmit={handleSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, languages, skills..."
            />
            <button type="submit">Search</button>
          </form>

          <div className="academy-hero-btns">
            <button className="acad-btn-primary" onClick={goToAcademy}>
              {t('academy.hero.getStarted')}
            </button>
            <button className="acad-btn-secondary" onClick={scrollToCourses}>
              {t('academy.hero.browseCourses')}
            </button>
          </div>
        </div>
      </div>

      {/* ── FEATURE STRIPS ── */}
      <section className="academy-features" ref={featuresRef}>
        <div className="academy-feature">
          <span className="feature-icon-wrap">
            <i className="fa-solid fa-comments"></i>
          </span>
          <div>
            <h3>{t('academy.features.languages.title')}</h3>
            <p>{t('academy.features.languages.subtitle')}</p>
          </div>
        </div>
        <div className="feature-divider" />
        <div className="academy-feature">
          <span className="feature-icon-wrap">
            <i className="fa-solid fa-drum"></i>
          </span>
          <div>
            <h3>{t('academy.features.arts.title')}</h3>
            <p>{t('academy.features.arts.subtitle')}</p>
          </div>
        </div>
        <div className="feature-divider" />
        <div className="academy-feature">
          <span className="feature-icon-wrap">
            <i className="fa-solid fa-chart-line"></i>
          </span>
          <div>
            <h3>{t('academy.features.skills.title')}</h3>
            <p>{t('academy.features.skills.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      <section className="academy-courses-section">
        <div className="section-heading">
          <span className="heading-line" />
          <h2>{t('academy.courses.heading')}</h2>
          <span className="heading-line" />
        </div>

        <div className="courses-grid" ref={coursesRef}>
          {courses.map((course) => (
            <div className="course-card" key={course.key}>
              <div
                className="course-img"
                style={{ backgroundImage: `url('${course.image}')` }}
              >
                {course.badge && (
                  <div className="course-badge">{course.badge}</div>
                )}
                <div className="course-tag">{course.tag}</div>
              </div>
              <div className="course-info">
                <h3>{t(`academy.courses.items.${course.key}.title`)}</h3>
                <p>{t(`academy.courses.items.${course.key}.subtitle`)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="course-enroll-btn-div">
          <button className="course-enroll-btn" onClick={goToAcademy}>
            {t('academy.courses.enrollNow')}
          </button>
        </div>
      </section>

      {/* ── LEARN LANGUAGES ── */}
      <section
        className="academy-languages"
        style={{ backgroundImage: 'url(/images/Learn-Language3.jpg)' }}
      >
        <div className="lang-overlay" />
        <div className="lang-content">
          <div className="lang-text">
            <div className="section-heading light">
              <span className="heading-line light" />
              <h2>{t('academy.languages.heading')}</h2>
              <span className="heading-line light" />
            </div>
            <p>{t('academy.languages.subtitle')}</p>

            <div className="lang-chips" ref={langRef}>
              {languages.map((lang) => (
                <button
                  key={lang}
                  className={`lang-chip ${activeLanguage === lang ? 'lang-chip-active' : ''}`}
                  onClick={() => setActiveLanguage(lang)}
                >
                  <i className={`fa-solid ${languageIcons[lang]}`}></i>
                  {lang}
                </button>
              ))}
            </div>

            <div className="lang-cta">
              <button className="acad-btn-primary" onClick={goToAcademy}>
                {t('academy.languages.startLearning')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section className="academy-community">
        <div className="section-heading">
          <span className="heading-line" />
          <h2>{t('academy.community.heading')}</h2>
          <span className="heading-line" />
        </div>
        <p className="community-sub">{t('academy.community.subtitle')}</p>

        <div className="community-grid" ref={communityRef}>
          {communityKeys.map((key) => (
            <div className="community-card" key={key}>
              <span className="comm-icon-wrap">
                <i className={`fa-solid ${communityIcons[key]}`}></i>
              </span>
              <div>
                <h3>{t(`academy.community.items.${key}.title`)}</h3>
                <p>{t(`academy.community.items.${key}.subtitle`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section
        className="academy-cta"
        style={{ backgroundImage: 'url(/images/African-landscape-latest.jpg)' }}
      >
        <div className="academy-cta-overlay" />
        <div className="academy-cta-content">
          <div className="section-heading light">
            <span className="heading-line light" />
            <h2>{t('academy.cta.heading')}</h2>
            <span className="heading-line light" />
          </div>
          <button className="acad-btn-primary large" onClick={goToAcademy}>
            {t('academy.cta.joinNow')}
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AcademyPage;