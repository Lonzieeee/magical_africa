import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { db } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import SideMenu from './SideMenu';
import AuthModal from './AuthModal';
import AcademyDropdown from './AcademyDropdown';
import MarketDropdown from './MarketDropdown';
import '../styles/navbar.css';
import '../styles/hero-stuff.css';
import { buildLearnerDashboardPath, buildTeacherDashboardPath } from '../utils/dashboardRoute';

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
  const [logoutMessage, setLogoutMessage] = useState(false);
  const [accountRole, setAccountRole] = useState('');

  const { user, userData, logout, getInitials, getFullName } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  const normalizeRole = (role) => {
    const value = String(role || '').trim().toLowerCase();
    if (!value) return '';
    if (value.includes('teacher') || value.includes('tutor') || value.includes('educator')) return 'teacher';
    if (value.includes('learner') || value.includes('student')) return 'learner';
    return '';
  };

  const resolveProfileRole = (profile) => {
    const normalized = normalizeRole(profile?.role);
    if (normalized) return normalized;
    if (String(profile?.subject || '').trim()) return 'teacher';
    return '';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user) {
      setAccountRole('');
      return;
    }
    setAccountRole(resolveProfileRole(userData));
  }, [user, userData]);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
    setIsLangDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      setLogoutMessage(true);
      setTimeout(async () => {
        await logout();
        setLogoutMessage(false);
      }, 1000);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleMyLearning = () => {
    navigate(buildLearnerDashboardPath('courses', 'all'));
  };

  const handleMyCertificates = () => {
    navigate(buildLearnerDashboardPath('achievements'));
  };

  const handleMyArts = () => {
    navigate(buildLearnerDashboardPath('my-art'));
  };

  const handleTeachOnMagical = async () => {
    if (!user) {
      navigate('/academy-signIn');
      return;
    }

    let resolvedRole = resolveProfileRole(userData);

    if (!resolvedRole && user?.uid) {
      try {
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        if (snapshot.exists()) {
          resolvedRole = resolveProfileRole(snapshot.data());
        }
      } catch {
        resolvedRole = '';
      }
    }

    if (resolvedRole === 'teacher') {
      navigate(buildTeacherDashboardPath('courses'));
      return;
    }

    navigate('/academy-page');
  };

  return (
    <>
      <div
        className={`menu-overlay ${isSideMenuOpen ? 'active' : ''}`}
        onClick={() => setIsSideMenuOpen(false)}
      />

      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
      />

      {logoutMessage && (
        <div style={{
          position: 'fixed',
          top: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '9999',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '8px',
          padding: '12px 20px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          Logged out successfully! Redirecting...
        </div>
      )}

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${solid ? 'solid' : ''}`}>

        {/* ── ITEM 1: Logo + Hamburger ── */}
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
        </div>

        {/* ── ITEM 2: Nav Links ── */}
        <div className="item2">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>
            {t('sideMenu.home')}
          </NavLink>

          <AcademyDropdown />

          <NavLink to="/about" className={({ isActive }) => isActive ? 'active-link' : ''}>
            {t('sideMenu.about')}
          </NavLink>

          <MarketDropdown />

          <NavLink to="/blogs" className={({ isActive }) => isActive ? 'active-link' : ''}>
            {t('sideMenu.blog')}
          </NavLink>

         <NavLink to="/technology" className={({ isActive }) => isActive ? 'active-link' : ''}>
           {t('nav.technology')}
          </NavLink>


        </div>

        {/* ── ITEM 3: Language + Auth ── */}
        <div className="item3">
          <div className='events-icon'>
            <div
              className="lang-wrapper"
              onMouseEnter={() => setIsLangDropdownOpen(true)}
              onMouseLeave={() => setIsLangDropdownOpen(false)}
            >
              <button className="lang-btn">
                <i className="fa-solid fa-globe" style={{ color: "rgb(181, 161, 145)" }}></i>
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

          {!user ? (
            <a id="contact-us" onClick={() => navigate('/academy-signUp')}>
              <i className="fa-regular fa-user" id="user-icon"></i>
              {t('nav.signIn')}
            </a>
          ) : (
            <>
              <span className="Account-icon" style={{ display: 'flex' }}>
                {userData?.photoURL
                  ? <img src={userData.photoURL} alt="Account avatar" className="account-avatar-image account-avatar-image-small" />
                  : (getInitials() || user?.displayName?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || '?')}
              </span>

              <div className="account-dropdown">
                <p className="currently-in">{t('nav.currentlyIn')}</p>

                <div className="account-item active">
                  <div className="account-avatar">
                    {userData?.photoURL
                      ? <img src={userData.photoURL} alt="Account avatar" className="account-avatar-image" />
                      : (getInitials() || user?.displayName?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || '?')}
                  </div>
                  <div className="account-details">
                    <h4>{getFullName()}</h4>
                    <p className="account-type">{t('nav.personal')}</p>
                    <p className="account-email">{user.email}</p>
                  </div>
                  <i className="fa-solid fa-check"></i>
                </div>

                {accountRole !== 'teacher' && (
                  <>
                    <div className="dropdown-option" onClick={handleMyLearning}>
                      <span><i className="fa-solid fa-graduation-cap"></i>My Learning</span>
                    </div>

                    <div className="dropdown-option" onClick={handleMyCertificates}>
                      <span><i className="fa-solid fa-certificate"></i>My Certificates</span>
                    </div>

                    <div className="dropdown-option" onClick={handleMyArts}>
                      <span><i className="fa-solid fa-palette"></i>My Arts</span>
                    </div>
                  </>
                )}

                {accountRole === 'teacher' && (
                  <div className="dropdown-option" onClick={handleTeachOnMagical}>
                    <span><i className="fa-solid fa-chalkboard-user"></i>Teach on Magical</span>
                  </div>
                )}

                <div className="dropdown-option">
                  <span><i className="fa-regular fa-credit-card"></i>Billings</span>
                </div>

                <div className="dropdown-option logout-option" onClick={handleLogout}>
                  <span><i className="fa-solid fa-arrow-right-from-bracket"></i>{t('nav.logOut')}</span>
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