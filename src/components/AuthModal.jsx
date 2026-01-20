import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/sign-up.css';
import '../styles/sign-up2.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { login, register, loginWithGoogle } = useAuth();

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInErrors, setSignInErrors] = useState({ email: false, password: false });

  // Sign Up form state
  const [signUpData, setSignUpData] = useState({
    tribe: 'Kikuyu',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: ''
  });
  const [signUpErrors, setSignUpErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    country: false
  });

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    const errors = {
      email: !signInEmail.trim(),
      password: !signInPassword.trim()
    };
    setSignInErrors(errors);

    if (errors.email || errors.password) return;

    try {
      await login(signInEmail, signInPassword);
      alert('Signed in successfully!');
      onClose();
      resetForms();
    } catch (error) {
      console.error('Error:', error);
      if (error.code === 'auth/user-not-found') {
        alert('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        alert('Incorrect password');
      } else if (error.code === 'auth/invalid-credential') {
        alert('Invalid email or password');
      } else {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      alert('Signed in with Google successfully!');
      onClose();
      resetForms();
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    const errors = {
      firstName: !signUpData.firstName.trim(),
      lastName: !signUpData.lastName.trim(),
      email: !signUpData.email.trim(),
      password: !signUpData.password.trim(),
      country: !signUpData.country.trim()
    };
    setSignUpErrors(errors);

    if (Object.values(errors).some(Boolean)) return;

    if (signUpData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await register(signUpData.email, signUpData.password, {
        tribe: signUpData.tribe,
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        country: signUpData.country
      });
      alert('Account created successfully!');
      onClose();
      resetForms();
    } catch (error) {
      console.error('Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already registered');
      } else if (error.code === 'auth/invalid-email') {
        alert('Please enter a valid email address');
      } else {
        alert('Error: ' + error.message);
      }
    }
  };

  const resetForms = () => {
    setSignInEmail('');
    setSignInPassword('');
    setSignInErrors({ email: false, password: false });
    setSignUpData({
      tribe: 'Kikuyu',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      country: ''
    });
    setSignUpErrors({
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      country: false
    });
    setShowSignUp(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('auth-overlay')) {
      onClose();
      resetForms();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`auth-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
      {/* Sign In Form */}
      <div className="sign-in-form" style={{ display: showSignUp ? 'none' : 'flex' }}>
        <div className="close-mark">
          <i className="fa-solid fa-x" id="close-icon" onClick={() => { onClose(); resetForms(); }}></i>
        </div>
        
        <div className="form1">
          <h1>Sign In</h1>

          <form onSubmit={handleSignIn}>
            <div className="email">
              <label htmlFor="email">Email</label>
              <input 
                type="text" 
                id="email" 
                placeholder="email@example.com" 
                autoComplete="nope"
                value={signInEmail}
                onChange={(e) => {
                  setSignInEmail(e.target.value);
                  if (e.target.value.trim()) {
                    setSignInErrors(prev => ({ ...prev, email: false }));
                  }
                }}
                style={{ borderColor: signInErrors.email ? '#dc271e' : '' }}
              />
              <p className="required2" style={{ display: signInErrors.email ? 'block' : 'none' }}>Required</p>
            </div>

            <div className="password">
              <label htmlFor="password">Password</label>
              <input 
                type={showPassword ? 'text' : 'password'}
                id="Password" 
                placeholder="********" 
                autoComplete="new-password"
                value={signInPassword}
                onChange={(e) => {
                  setSignInPassword(e.target.value);
                  if (e.target.value.trim()) {
                    setSignInErrors(prev => ({ ...prev, password: false }));
                  }
                }}
                style={{ borderColor: signInErrors.password ? '#dc271e' : '' }}
              />
              <i 
                className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                id="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              ></i>
              <p className="required1" style={{ display: signInErrors.password ? 'block' : 'none' }}>Required</p>
              <a href="#">Forgot Password?</a>
            </div>
          </form>

          <button className="sign-in" onClick={handleSignIn}>Sign In</button>

          <button className="sign-with-google" onClick={handleGoogleSignIn}>
            <img src="/images/google-logo.png" alt="google" />
            Continue with Google
          </button>
        </div>

        <hr />
        
        <div className="sign-up-link">
          <h1 className="head2">Or Become a Member</h1>
          <p className="join">Join <span>Magical Africa</span> and discover Africa's culture, heritage, stories, and traditions.</p>
          <button className="sign-up-btn" onClick={() => setShowSignUp(true)}>Sign Up</button>
        </div>
      </div>

      {/* Sign Up Form */}
      <div className="sign-up-form" style={{ display: showSignUp ? 'flex' : 'none' }}>
        <div className="side1">
          <h1>Your Journey Starts Here</h1>

          <div className="cards">
            <div className="card1">
              <i className="fa-solid fa-globe-africa"></i>
              <div>
                <h2>Explore Authentic Africa</h2>
                <p>Discover rich cultures, traditions, and stories from across the continent all in one place.</p>
              </div>
            </div>

            <div className="card2">
              <i className="fa-solid fa-people-group"></i>
              <div>
                <h2>Connect With Heritage</h2>
                <p>Experience Africa through its people, tribes, and timeless traditions, curated with care.</p>
              </div>
            </div>

            <div className="card3">
              <i className="fa-solid fa-republican"></i>
              <div>
                <h2>Travel Beyond the Ordinary</h2>
                <p>Unlock unique destinations and cultural experiences that go beyond the usual tourist path.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="side2">
          <h1>
            Let's Get Started
            <i className="fa-solid fa-x" id="back" onClick={() => setShowSignUp(false)}></i>
          </h1>

          <form onSubmit={handleSignUp}>
            <div className="tribe-div">
              <label><span className="color">*</span> Tribes</label>
              <select 
                value={signUpData.tribe}
                onChange={(e) => setSignUpData(prev => ({ ...prev, tribe: e.target.value }))}
              >
                <option value="Kikuyu">Kikuyu</option>
                <option value="Maasai">Maasai</option>
                <option value="Asanti">Asanti</option>
                <option value="Haya">Haya</option>
                <option value="Oromo">Oromo</option>
                <option value="Igbo">Igbo</option>
                <option value="Embu">Embu</option>
              </select>
            </div>

            <div className="names-div">
              <div className="firstname">
                <label><span className="color">* </span>First Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your first name"
                  value={signUpData.firstName}
                  onChange={(e) => {
                    setSignUpData(prev => ({ ...prev, firstName: e.target.value }));
                    if (e.target.value.trim()) {
                      setSignUpErrors(prev => ({ ...prev, firstName: false }));
                    }
                  }}
                  style={{ borderColor: signUpErrors.firstName ? '#dc271e' : '' }}
                />
                <p className="required3" style={{ display: signUpErrors.firstName ? 'block' : 'none' }}>required</p>
              </div>

              <div className="secondname">
                <label><span className="color">* </span>Second Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your last name"
                  value={signUpData.lastName}
                  onChange={(e) => {
                    setSignUpData(prev => ({ ...prev, lastName: e.target.value }));
                    if (e.target.value.trim()) {
                      setSignUpErrors(prev => ({ ...prev, lastName: false }));
                    }
                  }}
                  style={{ borderColor: signUpErrors.lastName ? '#dc271e' : '' }}
                />
                <p className="required4" style={{ display: signUpErrors.lastName ? 'block' : 'none' }}>required</p>
              </div>
            </div>

            <div className="email-div">
              <label><span className="color">*</span> Email</label>
              <input 
                type="text" 
                placeholder="Enter your email"
                autoComplete="nope"
                value={signUpData.email}
                onChange={(e) => {
                  setSignUpData(prev => ({ ...prev, email: e.target.value }));
                  if (e.target.value.trim()) {
                    setSignUpErrors(prev => ({ ...prev, email: false }));
                  }
                }}
                style={{ borderColor: signUpErrors.email ? '#dc271e' : '' }}
              />
              <p className="required5" style={{ display: signUpErrors.email ? 'block' : 'none' }}>required</p>
            </div>

            <div className="where-div">
              <div className="password2">
                <label><span className="color">* </span>Password</label>
                <input 
                  type={showPassword2 ? 'text' : 'password'}
                  placeholder="********"
                  autoComplete="new-password"
                  value={signUpData.password}
                  onChange={(e) => {
                    setSignUpData(prev => ({ ...prev, password: e.target.value }));
                    if (e.target.value.trim()) {
                      setSignUpErrors(prev => ({ ...prev, password: false }));
                    }
                  }}
                  style={{ borderColor: signUpErrors.password ? '#dc271e' : '' }}
                />
                <i 
                  className={`fa-regular ${showPassword2 ? 'fa-eye' : 'fa-eye-slash'}`}
                  id="toggle-password2"
                  onClick={() => setShowPassword2(!showPassword2)}
                ></i>
                <p className="required6" style={{ display: signUpErrors.password ? 'block' : 'none' }}>required</p>
              </div>

              <div className="country2">
                <label><span className="color">* </span>Country</label>
                <input 
                  type="text" 
                  placeholder="Enter your country"
                  value={signUpData.country}
                  onChange={(e) => {
                    setSignUpData(prev => ({ ...prev, country: e.target.value }));
                    if (e.target.value.trim()) {
                      setSignUpErrors(prev => ({ ...prev, country: false }));
                    }
                  }}
                  style={{ borderColor: signUpErrors.country ? '#dc271e' : '' }}
                />
                <p className="required7" style={{ display: signUpErrors.country ? 'block' : 'none' }}>required</p>
              </div>
            </div>

            <button type="submit" className="create-account">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
