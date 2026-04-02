import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { db } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';

const SideMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, userData } = useAuth();

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

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleAcademyNavigation = async () => {
    if (!user) {
      navigate('/academy-signIn');
    } else {
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
        navigate('/teacher-dashboard');
      } else {
        navigate('/learner');
      }
    }
    onClose();
  };

  return (
    <div className={`side-menu ${isOpen ? 'active' : ''}`}>
      <div className="side-header">
        <button className="close-btn" onClick={onClose}>
          <i className="fa-solid fa-x"></i>
          <span>{t('sideMenu.close')}</span>
        </button>

        <button className="search-btn">
          <i className="fa-solid fa-magnifying-glass"></i>
          <span>{t('sideMenu.search')}</span>
        </button>
      </div>

      <div className="side-content">
        <ul>
          <li onClick={() => handleNavigation('/')}>
            {t('sideMenu.home')} <i className="fa-solid fa-chevron-right"></i>
          </li>
          <li onClick={() => handleNavigation('/tribes')}>
            {t('sideMenu.tribes')} <i className="fa-solid fa-chevron-right"></i>
          </li>
          <li onClick={() => handleNavigation('/about')}>
            {t('sideMenu.about')} <i className="fa-solid fa-chevron-right"></i>
          </li>

          <li onClick={handleAcademyNavigation}>
            {t('sideMenu.academy')} <i className="fa-solid fa-chevron-right"></i>
          </li>

          <li onClick={() => handleNavigation('/market')}>
            {t('sideMenu.marketplace')} <i className="fa-solid fa-chevron-right"></i>
          </li>

          <li onClick={() => handleNavigation('/events')}>
            {t('sideMenu.events')} <i className="fa-solid fa-chevron-right"></i>
          </li>

          <li onClick={() => handleNavigation('/music')}>
            {t('sideMenu.music')} <i className="fa-solid fa-chevron-right"></i>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;