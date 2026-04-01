
{/* 
import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import useAcademyNavigation from "../hooks/useAcademyNavigation";
import '../styles/academy-page.css';

const courses = [
  {
    title: 'Swahili for Beginners',
    subtitle: 'Start Speaking Swahili',
    image: '/images/learn-language-kids.jpg',
    tag: 'Language',
    badge: 'Habari!',
  },
  {
    title: 'African Drumming',
    subtitle: 'Rhythms & Technique',
    image: '/images/drums2-latest.jpg',
    tag: 'Music',
  },
  {
    title: 'Traditional Beadwork',
    subtitle: 'Create Stunning Accessories',
    image: '/images/kitenge-latest.jpg',
    tag: 'Crafts',
  },
  {
    title: 'African Cooking',
    subtitle: 'Delicious African Recipes',
    image: '/images/Oromo2.jpg',
    tag: 'Culture',
  },
];

const languages = ['Swahili', 'Yoruba', 'Zulu', 'Hausa', 'Amharic'];

const languageIcons = {
  Swahili: 'fa-comments',
  Yoruba: 'fa-comments',
  Zulu: 'fa-hands',
  Hausa: 'fa-landmark',
  Amharic: 'fa-star',
};

const community = [
  {
    icon: 'fa-circle-play',
    title: 'Live Classes & Workshops',
    subtitle: 'Interactive Learning',
  },
  {
    icon: 'fa-comment-dots',
    title: 'Student Forums',
    subtitle: 'Share & Collaborate',
  },
  {
    icon: 'fa-handshake',
    title: 'Mentorship & Support',
    subtitle: 'Guidance & Growth',
  },
];

const AcademyPage = () => {
  const [activeLanguage, setActiveLanguage] = useState('Swahili');

  const featuresRef = useRef(null);
  const coursesRef = useRef(null);
  const langRef = useRef(null);
  const communityRef = useRef(null);
  const goToAcademy = useAcademyNavigation();

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

  useReveal(featuresRef, '.academy-feature', 'academy-feature', 'feature-visible');
  useReveal(coursesRef, '.course-card', 'course-card', 'card-visible');
  useReveal(langRef, '.lang-chip', 'lang-chip', 'chip-visible');
  useReveal(communityRef, '.community-card', 'community-card', 'comm-visible');



  return (
    <>
      <Helmet>
        <title>Academy - Magical Africa</title>
        <meta
          name="description"
          content="Learn African languages, cultural arts, and creative skills through Magical Africa Academy — your gateway to pan-African knowledge."
        />
        <meta property="og:title" content="Magical Africa Academy" />
        <meta property="og:url" content="https://magical.africa/academy" />
      </Helmet>

      <div
        className="academy-hero"
        style={{ backgroundImage: 'url(/images/photorealistic-portrait-african-woman.jpg)' }}
      >
        <Navbar />
        <div className="academy-hero-content">
          <p className="academy-eyebrow">Magical.Africa Academy</p>
          <h1>
            Learn. Build. Market<br />
            <span>Your Cultural Skills</span>
          </h1>
          <p className="academy-hero-sub">
            Explore the rich heritage of Africa through our online courses.
          </p>
          <div className="academy-hero-btns">
            <button className="acad-btn-primary" onClick={goToAcademy}>Get Started</button>
            <button className="acad-btn-secondary">Browse Courses</button>
          </div>
        </div>
      </div>

      <section className="academy-features" ref={featuresRef}>
        <div className="academy-feature">
          <span className="feature-icon-wrap">
            <i className="fa-solid fa-comments"></i>
          </span>
          <div>
            <h3>Learn African Languages</h3>
            <p>Master Swahili, Yoruba, Zulu &amp; more</p>
          </div>
        </div>
        <div className="feature-divider" />
        <div className="academy-feature">
          <span className="feature-icon-wrap">
            <i className="fa-solid fa-drum"></i>
          </span>
          <div>
            <h3>Discover Cultural Arts</h3>
            <p>Music, Dance, Crafts &amp; Traditions</p>
          </div>
        </div>
        <div className="feature-divider" />
        <div className="academy-feature">
          <span className="feature-icon-wrap">
            <i className="fa-solid fa-chart-line"></i>
          </span>
          <div>
            <h3>Grow Your Skills</h3>
            <p>Launch Your Creative Business</p>
          </div>
        </div>
      </section>

      <section className="academy-courses-section">
        <div className="section-heading">
          <span className="heading-line" />
          <h2>Featured Courses</h2>
          <span className="heading-line" />
        </div>

        <div className="courses-grid" ref={coursesRef}>
          {courses.map((course, i) => (
            <div className="course-card" key={i}>
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
                <h3>{course.title}</h3>
                <p>{course.subtitle}</p>

             



              </div>
            </div>


          ))}

         
        </div>

         <div className='course-enroll-btn-div'>

         <button className='course-enroll-btn' onClick={goToAcademy}>
         Enroll Now
         </button>
         </div>
      </section>

    
      <section
        className="academy-languages"
        style={{ backgroundImage: 'url(/images/Learn-Language3.jpg)' }}
      >
        <div className="lang-overlay" />
        <div className="lang-content">
          <div className="lang-text">
            <div className="section-heading light">
              <span className="heading-line light" />
              <h2>Learn African Languages</h2>
              <span className="heading-line light" />
            </div>
            <p>Speak like a local! Master the languages of Africa.</p>

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
                Start Learning Today
              </button>
            </div>
          </div>
        </div>
      </section>

    
      <section className="academy-community">
        <div className="section-heading">
          <span className="heading-line" />
          <h2>Join Our Creative Community</h2>
          <span className="heading-line" />
        </div>
        <p className="community-sub">
          Connect with Instructors, Network with Learners, Share Your Heritage
        </p>

        <div className="community-grid" ref={communityRef}>
          {community.map((item, i) => (
            <div className="community-card" key={i}>
              <span className="comm-icon-wrap">
                <i className={`fa-solid ${item.icon}`}></i>
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

     
      <section
        className="academy-cta"
        style={{ backgroundImage: 'url(/images/African-landscape-latest.jpg)' }}
      >
        <div className="academy-cta-overlay" />
        <div className="academy-cta-content">
          <div className="section-heading light">
            <span className="heading-line light" />
            <h2>Start Your Journey Today!</h2>
            <span className="heading-line light" />
          </div>
          <button className="acad-btn-primary large" onClick={goToAcademy}>Join Now</button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AcademyPage;
*/}



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

  return (
    <>
      <Helmet>
        <title>Academy - Magical Africa</title>
        <meta
          name="description"
          content="Learn African languages, cultural arts, and creative skills through Magical Africa Academy — your gateway to pan-African knowledge."
        />
        <meta property="og:title" content="Magical Africa Academy" />
        <meta property="og:url" content="https://magical.africa/academy" />
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
          <div className="academy-hero-btns">
            <button className="acad-btn-primary" onClick={goToAcademy}>
              {t('academy.hero.getStarted')}
            </button>
            <button className="acad-btn-secondary">
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