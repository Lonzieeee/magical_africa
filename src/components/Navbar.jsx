import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SideMenu from './SideMenu';
import AuthModal from './AuthModal';
import '../styles/navbar.css';
import '../styles/hero-stuff.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout, getInitials, getFullName } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
       

        <div className="item1">

           <div className='magical-logo'>
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
            <span>Menu</span>
          </button>
 
       {/*
          <button className="search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Search</span>
          </button>

           */}
        </div>

        

        <div className="item2">
          <h1 id="logo-header" onClick={() => navigate('/')}>Magical Africa</h1>
        </div>

        <div className="item3">
          {!user ? (
            <>
              <a href="#" id="contact-us" onClick={(e) => {
                e.preventDefault();
                setIsAuthModalOpen(true);
              }}>Sign In</a>
              <a href="#">
                <i className="fa-regular fa-user" id="user-icon"></i>
              </a>
            </>
          ) : (
            <>
              <span className="Account-icon" style={{ display: 'flex' }}>
                {getInitials()}
              </span>
              
              <div className="account-dropdown">
                <p className="currently-in">Currently in</p>
                
                <div className="account-item active">
                  <div className="account-avatar">{getInitials()}</div>
                  <div className="account-details">
                    <h4>{getFullName()}</h4>
                    <p className="account-type">Personal</p>
                    <p className="account-email">{user.email}</p>
                  </div>
                  <i className="fa-solid fa-check"></i>
                </div>
                
                <div className="dropdown-section-title">Your accounts</div>
                
                <div className="dropdown-option">
                  <span>Add Magical Africa account</span>
                </div>
                
                <div className="dropdown-option logout-option" onClick={handleLogout}>
                  <span>Log out</span>
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
