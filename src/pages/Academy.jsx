import React from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/academy.css';

const Academy = () => {

  const navigate = useNavigate(); 

  const handleNavigation = (path) => { 
    navigate(path);
  };


  return (
   <>

   <Navbar solid />

   <div className='welcome-page'>

     <div className='welcome-video'>

     </div>

     <div className='welcome-text'>

      <h1>Learn The Languages of <span>Africa</span></h1>

      <p>
        Master Swahili, Zulu, Yoruba, Amharic and more the world's most vibrant tongues, made fun.
     </p>

     <button onClick={() => handleNavigation ('/language2')}>Get Started</button>

     </div>

   </div>


  

   
   </>
  )
}

export default Academy
