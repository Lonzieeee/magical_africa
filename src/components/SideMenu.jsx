{/* 

import { useNavigate } from 'react-router-dom';

const SideMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className={`side-menu ${isOpen ? 'active' : ''}`}>
      <div className="side-header">
        <button className="close-btn" onClick={onClose}>
          <i className="fa-solid fa-x"></i>
          <span>Close</span>
        </button>

        <button className="search-btn">
          <i className="fa-solid fa-magnifying-glass"></i>
          <span>Search</span>
        </button>
      </div>

      <div className="side-content">
        <ul>
          <li onClick={() => handleNavigation('/')}>
            Home <i className="fa-solid fa-chevron-right"></i>
          </li>
          <li onClick={() => handleNavigation('/tribes')}>
            Tribes <i className="fa-solid fa-chevron-right"></i>
          </li>
          <li onClick={() => handleNavigation('/about')}>
            About <i className="fa-solid fa-chevron-right"></i>
          </li>
          <li>
            Language <i className="fa-solid fa-chevron-right"></i>
          </li>
          <li>
            Marketplace <i className="fa-solid fa-chevron-right"></i>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;

*/}


import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SideMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = (path) => {
    navigate(path);
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
          <li>
            {t('sideMenu.language')} <i className="fa-solid fa-chevron-right"></i>
          </li>
          <li>
            {t('sideMenu.marketplace')} <i className="fa-solid fa-chevron-right"></i>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;