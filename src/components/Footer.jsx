


import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/footer.css';
import { useNavigate } from 'react-router-dom';
import useAcademyNavigation from "../hooks/useAcademyNavigation";

const Footer = () => {
  const { t } = useTranslation();
  const goToAcademy = useAcademyNavigation();

      const navigate = useNavigate(); // 👈 1. create navigate
  
    // 👈 2. define the handler
    const handleNavigation = (path) => {
      navigate(path);
    };

  return (
    <footer className="footer">
      <div className="footer-section">
        <div className="link1">
          <Link to="/">Magical Africa</Link>
          <p>{t('footer.tagline')}</p>


    {/* 
          <div className="footer-icons">
            <span><i className="fa-brands fa-facebook-f"></i></span>
            <span><i className="fa-brands fa-instagram"></i></span>
            <span><i className="fa-brands fa-x-twitter"></i></span>
            <span><i className="fa-brands fa-tiktok"></i></span>
          </div>
    */}


    <div className="footer-icons">
  <span onClick={() => window.open('https://www.facebook.com/profile.php?id=61583415501249', '_blank')}>
    <i className="fa-brands fa-facebook-f"></i>
  </span>
  <span onClick={() => window.open('https://www.instagram.com/africa_magical/', '_blank')}>
    <i className="fa-brands fa-instagram"></i>
  </span>
  <span onClick={() => window.open('https://x.com/MagicalAfr23463', '_blank')}>
    <i className="fa-brands fa-x-twitter"></i>
  </span>
  <span onClick={() => window.open('https://www.tiktok.com/@exploremagicalafr', '_blank')}>
    <i className="fa-brands fa-tiktok"></i>
  </span>
</div>


        </div>

        <div className="link2">
          <h3>{t('footer.quickLinks')}</h3>
          <div className="link2-a">
            <Link to="/" onClick={()=> handleNavigation('/')}>{t('footer.links.home')}</Link>
            <Link to="/tribes">{t('footer.links.tribes')}</Link>
            
            <Link to="/about">{t('footer.links.about')}</Link>
            <Link to="/market">{t('footer.links.marketplace')}</Link>
            {/* 
            <Link to="" onClick={goToAcademy}>{t('footer.links.academy')}</Link>
            */}

            <span className="footer-link" onClick={goToAcademy}>
  {t('footer.links.academy')}
</span>
            <Link to="/events">{t('footer.links.events')}</Link>

            <Link to="/music">{t('footer.links.music')}</Link>
            <Link to="#">{t('footer.links.contact')}</Link>
            

          </div>
        </div>

        <div className="link3">
          <p>{t('footer.terms')}</p>
          <p>{t('footer.privacy')}</p>
          <p>{t('footer.cookiePolicy')}</p>
          <p>{t('footer.cookieSettings')}</p>
        </div>
      </div>

      <hr className="footer-hr" />

      <p className="copyright">{t('footer.copyright')}</p>
    </footer>
  );
};

export default Footer;