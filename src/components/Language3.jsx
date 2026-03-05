/*

import React from 'react'
import '../styles/language2.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Language3 = () => {
  return (
   <>

   <Navbar solid />

   <div className='welcome'>

    <div className='welcome-content'>

    <img src="/images/woman2.png" alt="img" />


    </div>

   </div>

   </>
  )
}

export default Language3
*/

import React from 'react'
import '../styles/language2.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Language3 = () => {

  const navigate = useNavigate(); 
  
    const handleNavigation = (path) => { 
      navigate(path);
    };

  return (
   <>
   <Navbar solid />
   <div className='welcome'>
    <div className='welcome-content'>
      <img src="/images/woman2.png" alt="img" />
      <div className='tooltip-bubble'>
        <span className='tooltip-arrow'></span>
        <p>Welcome to <strong>Magical Africa Academy</strong> — let's learn Ekegusii</p>
      </div>
    </div>
   </div>

   <div className='continue-button'>

   <button onClick={()=> handleNavigation('/language4')}>
     Continue
    </button>

   </div>
   </>
  )
}

export default Language3