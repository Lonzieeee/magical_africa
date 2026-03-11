import React from 'react'
import '../styles/language4.css';
import '../styles/language2.css'
import '../styles/language5.css'
import '../styles/language6.css'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Language6 = () => {

   const navigate = useNavigate(); 
    
      const handleNavigation = (path) => { 
        navigate(path);
      };
  
  return (
    <>
    <Navbar solid />

    <div className='Simple-Greetings'>

      <h1>Simple Greetings</h1>


      <div className='Greetings'>

        <div className='greeting1'>

          <img src="/images/sunrise.png" alt="" />

          <p className='actual'>Bwakire</p>
          <p className='translation'>Meaning - Good Morning</p>

          



        </div>

        <div className='greeting2'>
          <img src="/images/afternoon.png" alt="" />
          <p className='actual'>Mura Mono</p>
          <p className='translation'>Meaning - Good Afternoon</p>
          
          
        </div>

        <div className='greeting3'>

          <img src="/images/sunset.png" alt="" />
          
          <p className='actual'>Bwairire</p>
          <p className='translation'>Meaning - Good Evening</p>
          


        </div>

      </div>

    </div>


   <div className='continue-button'>
        <button onClick={() => navigate('/Common-nouns')}>
          Next
        </button>
      </div>
    </>
  )
}

export default Language6