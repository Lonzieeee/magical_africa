import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

  const goToAcademy = () => {
    // FIX: removed getDoc — userData is already loaded in AuthContext
    // No Firestore read needed here at all
    if (!user) {
      navigate("/academy-signUp");
      return;
    }

    const resolvedRole = resolveProfileRole(userData);

    if (resolvedRole === 'teacher') {
      navigate('/teacher-dashboard');
      return;
    }

    navigate('/learner');
  };

  return goToAcademy;
};

export default useAcademyNavigation;