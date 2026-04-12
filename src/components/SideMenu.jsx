import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { buildLearnerDashboardPath, buildTeacherDashboardPath } from '../utils/dashboardRoute';

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
      const resolvedRole = resolveProfileRole(userData);

      if (resolvedRole === 'teacher') {
        navigate(buildTeacherDashboardPath('courses'));
      } else {
        navigate(buildLearnerDashboardPath('store'));
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

          <li onClick={()=> handleNavigation('/academy')}>
            {t('sideMenu.academy')} <i className="fa-solid fa-chevron-right"></i>
          </li>

          <li onClick={() => handleNavigation('/market')}>
            {t('sideMenu.marketplace')} <i className="fa-solid fa-chevron-right"></i>
          </li>

          <li onClick={()=> handleNavigation('/blogs')}>
           {t('sideMenu.blog')} 
          <i className="fa-solid fa-chevron-right"></i>

          </li>
 
         <li onClick={()=> handleNavigation('/technology')}>
          {t('nav.technology')}
          <i className="fa-solid fa-chevron-right"></i>

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