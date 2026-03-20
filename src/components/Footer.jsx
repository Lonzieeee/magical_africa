

{/* 
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <div className="link1">
          <Link to="/">Magical Africa</Link>
          <p>Where the Real African Story lives</p>

          <div className="footer-icons">
            <span><i className="fa-brands fa-facebook-f"></i></span>
            <span><i className="fa-brands fa-instagram"></i></span>
            <span><i className="fa-brands fa-x-twitter"></i></span>
            <span><i className="fa-brands fa-tiktok"></i></span>
          </div>
        </div>

        <div className="link2">
          <h3>Quick Links</h3>
          <div className="link2-a">
            <Link to="/">Home</Link>
            <Link to="/tribes">Tribes</Link>
            <Link to="#">Languages</Link>
            <Link to="/about">About</Link>
            <Link to="#">Marketplace</Link>
            <Link to="#">Contact</Link>
          </div>
        </div>

        <div className="link3">
          <p>Terms of Use</p>
          <p>Privacy Policy</p>
          <p>Cookie Policy</p>
          <p>Cookie Settings</p>
        </div>
      </div>

      <hr className="footer-hr" />

      <p className="copyright">© 2026 Magical.africa. All rights reserved</p>
    </footer>
  );
};

export default Footer;
*/}


import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/footer.css';

const Footer = () => {
  const { t } = useTranslation();

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
            <Link to="/">{t('footer.links.home')}</Link>
            <Link to="/tribes">{t('footer.links.tribes')}</Link>
            <Link to="#">{t('footer.links.languages')}</Link>
            <Link to="/about">{t('footer.links.about')}</Link>
            <Link to="#">{t('footer.links.marketplace')}</Link>
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