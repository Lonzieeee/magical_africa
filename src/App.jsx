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
import Academy2 from './pages/Academy2';
import AcademyLogin from './components/AcademyLogin';
import Teacher from './components/Teacher';
import Curriculum from './components/Curriculum';
import Lesson from './components/Lesson';
import Learner from './components/Learner';
import CourseContentPage from './components/CourseContentPage';
import TeacherDashboard from './components/TeacherDashboard';
import ProtectedRoute from './components/ProtectedRoute'
import Music from './pages/Music';
import AcademyPage from './pages/AcademyPage';
import Blogs from './pages/Blogs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Public routes — anyone can access ── */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tribes" element={<Tribes />} />
          <Route path="/maasai" element={<Maasai />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/register" element={<Language2 />} />
          <Route path="/welcome" element={<Language3 />} />
          <Route path="/welcome-learningReason" element={<Language4 />} />
          <Route path="/welcome-languageKnowledge" element={<Language5 />} />
          <Route path="/Simple-Greetings" element={<Language6 />} />
          <Route path="/Common-nouns" element={<Language7 />} />
          <Route path="/events" element={<Events />} />
          <Route path="/market" element={<Market />} />
          <Route path="/academy-signUp" element={<Academy2 />} />
          <Route path="/academy-signIn" element={<AcademyLogin />} />
          <Route path="/music" element={<Music />} />
        <Route path="/academy-page"element={<AcademyPage />}
         />
         <Route path="/blogs" element={<Blogs />}
         />



          {/* ── Teacher-only routes ── */}
          <Route path="/teacher" element={
            <ProtectedRoute allowedRole='teacher'>
              <Teacher />
            </ProtectedRoute>
          } />
          <Route path="/curriculum" element={
            <ProtectedRoute allowedRole='teacher'>
              <Curriculum />
            </ProtectedRoute>
          } />
          <Route path="/lesson" element={
            <ProtectedRoute allowedRole='teacher'>
              <Lesson />
            </ProtectedRoute>
          } />
          <Route path="/teacher-dashboard" element={
            <ProtectedRoute allowedRole='teacher'>
              <TeacherDashboard />
            </ProtectedRoute>
          } />

          {/* ── Learner-only routes ── */}
          <Route path="/learner" element={
            <ProtectedRoute allowedRole='learner'>
              <Learner />
            </ProtectedRoute>
          } />
          <Route path="/course-content" element={
            <ProtectedRoute allowedRole='learner'>
              <CourseContentPage />
            </ProtectedRoute>
          } />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;