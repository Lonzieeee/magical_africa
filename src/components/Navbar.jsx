import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import SideMenu from './SideMenu';
import AuthModal from './AuthModal';
import '../styles/navbar.css';
import '../styles/hero-stuff.css';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'kam', name: 'Kikamba' },
  { code: 'kik', name: 'Gĩkũyũ' },
  { code: 'ig', name: 'Igbo' },
  { code: 'mas', name: 'Maa' },
  { code: 'zu', name: 'isiZulu' }
];

const Navbar = ({ solid }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  
  const { user, logout, getInitials, getFullName } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
    setIsLangDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      alert('Logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <div className={`menu-overlay ${isSideMenuOpen ? 'active' : ''}`} 
           onClick={() => setIsSideMenuOpen(false)} />
      
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
      />

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${solid ? 'solid' : ''}`} >
        <div className="item1">
          <div className='magical-logo' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img
              src="/images/magicaal-logo1-removebg-preview.png"
              alt="Magical Africa logo dark"
              className="logo logo-dark"
            />
            <img
              src="/images/magivcal-logo2-removebg-preview.png"
              alt="Magical Africa logo light"
              className="logo logo-light"
            />
          </div>

          <button className="menu" onClick={() => setIsSideMenuOpen(true)}>
            <i className="fa-solid fa-bars"></i>
            <span>{t('nav.menu')}</span>
          </button>

          <div 
            className="lang-wrapper"
            onMouseEnter={() => setIsLangDropdownOpen(true)}
            onMouseLeave={() => setIsLangDropdownOpen(false)}
          >
            <button className="lang-btn">
              <i className="fa-solid fa-globe"></i>
              <span>{currentLanguage.name}</span>
              <i className="fa-solid fa-chevron-down lang-arrow"></i>
            </button>

            <div className={`lang-dropdown ${isLangDropdownOpen ? 'active' : ''}`}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-option ${i18n.language === lang.code ? 'selected' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.name}
                  {i18n.language === lang.code && (
                    <i className="fa-solid fa-check"></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="item2">
          <h1 id="logo-header" onClick={() => navigate('/')}>Magical Africa</h1>
        </div>

        <div className="item3">
          <div className='events-icon'>
            <div className="icon-with-tooltip">
              <a href="academy" id='academy'>
                
                <i className="fa-solid fa-school"></i>
                
                Academy
              </a>
              {/* 
              <span className="icon-tooltip">Academy</span>

              */}
            </div>

            <div className="icon-with-tooltip">
              <a href="events" id='events'>
               
                <i className="fa-solid fa-masks-theater"></i>
                Events
              </a>
              {/*
              <span className="icon-tooltip">Events</span>
               */}
            </div>

            <div className="icon-with-tooltip">
              <a href="#" id='music'>
                 <i className="fa-solid fa-music"></i>
              
                 Music
               
              </a>
              {/* 
              <span className="icon-tooltip">Music</span>
              */}
            </div>
          </div>

          {!user ? (
            <>
              <a href="#" id="contact-us" onClick={(e) => {
                e.preventDefault();
                setIsAuthModalOpen(true);
              }}>
               
                <i className="fa-regular fa-user" id="user-icon"></i>
                 {t('nav.signIn')}
              </a>
              
            </>
          ) : (
            <>
              <span className="Account-icon" style={{ display: 'flex' }}>
                {getInitials()}
              </span>
              
              <div className="account-dropdown">
                <p className="currently-in">{t('nav.currentlyIn')}</p>
                
                <div className="account-item active">
                  <div className="account-avatar">{getInitials()}</div>
                  <div className="account-details">
                    <h4>{getFullName()}</h4>
                    <p className="account-type">{t('nav.personal')}</p>
                    <p className="account-email">{user.email}</p>
                  </div>
                  <i className="fa-solid fa-check"></i>
                </div>
                
                <div className="dropdown-section-title">{t('nav.yourAccounts')}</div>
                
                <div className="dropdown-option">
                  <span>{t('nav.addAccount')}</span>
                </div>
                
                <div className="dropdown-option logout-option" onClick={handleLogout}>
                  <span>{t('nav.logOut')}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;