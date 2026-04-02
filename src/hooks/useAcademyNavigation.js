import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../context/AuthContext";
import { doc, getDoc } from 'firebase/firestore';

const useAcademyNavigation = () => {
  const navigate = useNavigate();
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

  const goToAcademy = async () => {
    if (!user) {
      navigate("/academy-signUp"); // not logged in → signup page
      return;
    }

    let resolvedRole = resolveProfileRole(userData);

    if (!resolvedRole && user?.uid) {
      try {
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        if (snapshot.exists()) {
          resolvedRole = resolveProfileRole(snapshot.data());
        }
      } catch {
        resolvedRole = '';
      }
    }

    if (resolvedRole === 'teacher') {
      navigate('/teacher-dashboard');
      return;
    }

    navigate('/learner');
  };

  return goToAcademy;
};

export default useAcademyNavigation;