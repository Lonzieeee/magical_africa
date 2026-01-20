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
