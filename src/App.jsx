import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Tribes from './pages/Tribes';
import Maasai from './pages/Maasai';
import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tribes" element={<Tribes />} />
          <Route path="/maasai" element={<Maasai />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
