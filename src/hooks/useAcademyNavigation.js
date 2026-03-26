import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const useAcademyNavigation = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();

  const goToAcademy = () => {
    if (!user) {
      navigate("/academy-signUp"); // not logged in → signup page
    } 
    else if (userData?.role === "teacher") {
      navigate("/teacher-dashboard");
    } 
    else {
      navigate("/learner");
    }
  };

  return goToAcademy;
};

export default useAcademyNavigation;