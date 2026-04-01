{/* 

import React from 'react'
import '../styles/academy-page.css'
import { Helmet } from 'react-helmet-async'

const AcademyPage = () => {
  return (
   <>


   <Helmet>
           <title>Academy - Magical Africa</title>
           <meta name="description" content="Shop authentic African products from artisans and creators across the continent. Discover handcrafted goods, traditional crafts, clothing, jewelry and more." />
           <meta name="keywords" content="African marketplace, buy African products, authentic African crafts, African artisans, handmade African goods, African jewelry, African clothing" />
           <meta property="og:title" content="African Marketplace — Buy Authentic African Products" />
           <meta property="og:description" content="Shop authentic handcrafted African products from artisans and creators across the continent." />
           <meta property="og:type" content="website" />
           <meta property="og:url" content="https://magical.africa/market" />
         </Helmet>
   

   
   
   </>
  )
}

export default AcademyPage

*/}


import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
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

      {/* ── HERO ── */}
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
            <button className="acad-btn-primary">Get Started</button>
            <button className="acad-btn-secondary">Browse Courses</button>
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

      {/* ── FEATURED COURSES ── */}
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

                {/* 
                <button className="course-enroll-btn">Enroll Now</button>
                */}



              </div>
            </div>


          ))}

         
        </div>

         <div className='course-enroll-btn-div'>

         <button className='course-enroll-btn'>
         Enroll Now
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
              <button className="acad-btn-primary">
                Start Learning {activeLanguage}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ── */}
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

      {/* ── CTA FOOTER ── */}
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
          <button className="acad-btn-primary large">Join Now</button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AcademyPage;