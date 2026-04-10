import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import useAcademyNavigation from "../hooks/useAcademyNavigation";
import { useAuth } from '../context/AuthContext';
import { buildCoursePath } from '../utils/courseRoute';
import { getPublishedCourses } from '../utils/publishedCourses';
import '../styles/academy-page.css';
import PageSeo from '../components/PageSeo'
import { SEO_CONTENT } from '../utils/seoContent'

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

const truncateWords = (text = '', maxWords = 14) => {
  const normalizedText = String(text || '').trim();
  if (!normalizedText) return '';

  const words = normalizedText.split(/\s+/);
  if (words.length <= maxWords) return normalizedText;

  return `${words.slice(0, maxWords).join(' ')}...`;
};

const preloadCourseImages = async (courses = []) => {
  const imageUrls = courses
    .map((course) => String(course?.featuredImage || '').trim())
    .filter(Boolean);

  await Promise.allSettled(
    imageUrls.map((imageUrl) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = imageUrl;
    }))
  );
};

const AcademyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [activeLanguage, setActiveLanguage] = useState('Swahili');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const featuresRef  = useRef(null);
  const coursesRef   = useRef(null);
  const langRef      = useRef(null);
  const communityRef = useRef(null);
  const goToAcademy  = useAcademyNavigation();

  const normalizeRole = (role) => {
    const value = String(role || '').trim().toLowerCase();
    if (!value) return '';
    if (value.includes('teacher') || value.includes('tutor') || value.includes('educator')) return 'teacher';
    if (value.includes('learner') || value.includes('student')) return 'learner';
    return '';
  };

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      setCoursesLoading(true);
      try {
        const liveCourses = await getPublishedCourses(4);
        await preloadCourseImages(liveCourses);
        setFeaturedCourses(liveCourses);
      } catch (error) {
        console.log('Failed to load featured courses:', error);
        setFeaturedCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

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

  const handleCourseShortcut = (course) => {
    if (!course?.id) {
      goToAcademy();
      return;
    }

    if (!user) {
      navigate('/academy-signIn');
      return;
    }

    const resolvedRole = normalizeRole(userData?.role);
    if (resolvedRole === 'teacher' || String(userData?.subject || '').trim()) {
      goToAcademy();
      return;
    }

    navigate(buildCoursePath(course.id, course.title, { preview: true }));
  };

  const handleCourseShortcutKeyDown = (event, course) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCourseShortcut(course);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      scrollToCourses();
    }
  };

  return (
    <>
      <PageSeo {...SEO_CONTENT.academy} />


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
          {coursesLoading && (
            <p className="academy-empty-state">Loading featured courses...</p>
          )}

          {!coursesLoading && featuredCourses.length === 0 && (
            <p className="academy-empty-state">No featured courses yet.</p>
          )}

          {!coursesLoading && featuredCourses.map((course) => (
            <div
              className="course-card"
              key={course.id}
              onClick={() => handleCourseShortcut(course)}
              onKeyDown={(event) => handleCourseShortcutKeyDown(event, course)}
              role="button"
              tabIndex={0}
            >
              <div
                className="course-img"
                style={{ backgroundImage: `url('${course.featuredImage || '/images/learn-language-kids.jpg'}')` }}
              >
                <div className="course-tag">{course.courseType || 'Course'}</div>
              </div>
              <div className="course-info">
                <h3>{course.title || 'Untitled Course'}</h3>
                <p>{truncateWords(course.description || 'Explore this course in the academy.', 14)}</p>
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