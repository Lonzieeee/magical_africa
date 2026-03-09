/*

import React from 'react'
import '../styles/language4.css';
import '../styles/language2.css'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Language4 = () => {
  return (
    
    <>
    <Navbar solid />

    <div className='why-language'>

      <div className='why-language2'>

        <img src="/images/woman2.png" alt="" />

     <div className='tooltip-bubble'>
        <span className='tooltip-arrow'></span>
        <p>Why do you want to learn Zulu</p>
      </div>



      </div>


      <div className='why-language3'>

        <div className='reason1'> 

          <img src="/images/fun.svg" alt="" />

          <p>Just for fun</p>

        </div>

        <div className='reason2'>

          <img src="/images/connect.svg" alt="" />

          <p>Connect with people</p>

        </div>

        <div className='reason3'>
          <img src="/images/travel.svg" alt="" />

          <p>Prepare for travel</p>

        </div>

        <div className='reason4'>

          <img src="/images/career.svg" alt="" />

          <p>Boost my Career</p>

        </div>

         <div className='reason5'>
          <img src="/images/education.svg" alt="" />

          <p>Support my education</p>

        </div>

        <div className='reason6'>
          <img src="/images/time.svg" alt="" />

          <p>Spend time productively</p>

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

export default Language4

*/

import React, { useState } from 'react'
import '../styles/language4.css';
import '../styles/language2.css'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const tooltipMessages = {
  default: "Why do you want to learn Ekegusii",
  reason1: "Yay! Fun is my speciality",
  reason2: "Let's prepare you for conversations",
  reason3: "Best thing to pack is the local language",
  reason4: "Let's unlock new opportunities for you",
  reason5: "Let's ace those tests",
  reason6: "That's a wise choice",
};

const Language4 = () => {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState(null);

  const handleReasonClick = (reason) => {
    setSelectedReason(reason === selectedReason ? null : reason);
  };

  const tooltipText = selectedReason
    ? tooltipMessages[selectedReason]
    : tooltipMessages.default;

  const reasons = [
    { id: 'reason1', img: '/images/fun.svg', label: 'Just for fun' },
    { id: 'reason2', img: '/images/connect.svg', label: 'Connect with people' },
    { id: 'reason3', img: '/images/travel.svg', label: 'Prepare for travel' },
    { id: 'reason4', img: '/images/career.svg', label: 'Boost my Career' },
    { id: 'reason5', img: '/images/education.svg', label: 'Support my education' },
    { id: 'reason6', img: '/images/time.svg', label: 'Spend time productively' },
  ];

  return (
    <>
      <Navbar solid />

      <div className='why-language'>

        <div className='why-language2'>
          <img src="/images/woman2.png" alt="" />
          <div className='tooltip-bubble' key={tooltipText}>
            <span className='tooltip-arrow'></span>
            <p>{tooltipText}</p>
          </div>
        </div>

        <div className='why-language3'>
          {reasons.map(({ id, img, label }) => (
            <div
              key={id}
              className={`${id} ${selectedReason === id ? 'reason-selected' : ''}`}
              onClick={() => handleReasonClick(id)}
            >
              <img src={img} alt="" />
              <p className='why-language-p'>{label}</p>
            </div>
          ))}
        </div>

      </div>

  {/* 
      <div className='continue-button'>
        <button onClick={() => navigate('/language5')}>
          Continue
        </button>
      </div>

      */}


      <div className='continue-button'>
  <button
    onClick={() => selectedReason && navigate('/language5')}
    disabled={!selectedReason}
    className={selectedReason ? 'btn-active' : 'btn-inactive'}
  >
    Continue
  </button>
</div>


    </>
  );
};

export default Language4;