import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Tribes from './pages/Tribes';
import Maasai from './pages/Maasai';
import Events from './pages/Events';
import './styles/index.css';
import Academy from './pages/Academy';
import Language2 from './components/Language2';
import Language3 from './components/Language3';
import Language4 from './components/Language4';
import Language5 from './components/Language5';
import Language6 from './components/Language6';
import Language7 from './components/Language7';
import Market from './pages/Market';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tribes" element={<Tribes />} />
          <Route path="/maasai" element={<Maasai />} />
          <Route path="/academy" element={ <Academy />} />
          <Route path="/register" element={ <Language2 /> } />
          <Route path="/welcome" element={ <Language3 /> } />
          <Route path="/welcome-learningReason" element={ <Language4 /> } />
          <Route path="/welcome-languageKnowledge" element={ <Language5 /> } />
          <Route path="/Simple-Greetings" element={ <Language6 /> } />
          <Route path="/Common-nouns" element={ <Language7 /> } />
          <Route path="/events" element={ <Events /> } />
           <Route path="/market" element={ <Market /> } />
        

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
