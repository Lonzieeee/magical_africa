import React from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/academy.css';

const Academy = () => {

  const navigate = useNavigate(); 

  const handleNavigation = (path) => { 
    navigate(path);
  };

    //for the title
  
      useEffect(() => {
      document.title = 'Learn African Languages';
    }, []);



  return (
   <>

   <Navbar solid />

   <div className='welcome-page'>

     <div className='welcome-video'>

     </div>

     <div className='welcome-text'>

      <h1>Learn Skills From Across <span>Africa</span></h1>

      <p>
       Discover courses in crafts, culture, art, music and more — taught by real African educators from across the continent.
     </p>

     <button onClick={() => handleNavigation ('/learner')}>Get Started</button>

     </div>

   </div>


  

   
   </>
  )
}

export default Academy
