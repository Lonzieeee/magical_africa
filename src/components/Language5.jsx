/*

import React from 'react'
import '../styles/language4.css';
import '../styles/language2.css'
import '../styles/language5.css'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Language5 = () => {
  return (
    
    <>
    <Navbar solid />

    <div className='how-well'>

      <div className='how-well-question'>

        <img src="/images/woman2.png" alt="" />

         <div className='tooltip-bubble'>
            <span className='tooltip-arrow'></span>
            <p>How well do you know Zulu</p>
          </div>
      

      </div>


      <div className='how-well-answers'>

        <div className='well1'>

          <p>I'm new to Zulu</p>

        </div>

        <div className='well2'>

          <p>I know some common words </p>

        </div>

        <div className='well3'>

          <p>I can have basic conversations </p>

        </div>

        <div className='well4'>

          <p>I can talk about various topics</p>

        </div>

       

      </div>


    </div>

         <div className='continue-button'>
        <button onClick={() => navigate('/language6')}>
          Continue
        </button>
      </div>
    </>
  )
}

export default Language5

*/


import React, { useState } from 'react'
import '../styles/language4.css';
import '../styles/language2.css'
import '../styles/language5.css'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const tooltipMessages = {
  default: "How well do you know Ekegusii",
  well1: "Okay, we'll start fresh!",
  well2: "Okay, we'll build on what you know!",
  well3: "Okay, we'll build on what you know!",
  well4: "Wow, that's great!",
};

const Language5 = () => {
  const navigate = useNavigate();
  const [selectedWell, setSelectedWell] = useState(null);

  const handleWellClick = (well) => {
    setSelectedWell(well === selectedWell ? null : well);
  };

  const tooltipText = selectedWell
    ? tooltipMessages[selectedWell]
    : tooltipMessages.default;

  const wells = [
    { id: 'well1', label: "I'm new to Ekegusii" },
    { id: 'well2', label: 'I know some common words' },
    { id: 'well3', label: 'I can have basic conversations' },
    { id: 'well4', label: 'I can talk about various topics' },
  ];

  return (
    <>
      <Navbar solid />

      <div className='how-well'>

        <div className='how-well-question'>
          <img src="/images/woman2-latest.png" alt="" />
          <div className='tooltip-bubble' key={tooltipText}>
            <span className='tooltip-arrow'></span>
            <p>{tooltipText}</p>
          </div>
        </div>

        <div className='how-well-answers'>
          {wells.map(({ id, label }) => (
            <div
              key={id}
              className={`${id} ${selectedWell === id ? 'well-selected' : ''}`}
              onClick={() => handleWellClick(id)}
            >

              <img src="/images/one.svg" alt="" />
              <p className='how-well-p'>{label}</p>
            </div>
          ))}
        </div>

      </div>


    {/* 
      <div className='continue-button'>
        <button onClick={() => navigate('/language6')}>
          Continue
        </button>
      </div>

    */}

    <div className='continue-button'>
  <button
    onClick={() => selectedWell && navigate('/Simple-Greetings')}
    disabled={!selectedWell}
    className={selectedWell ? 'btn-active' : 'btn-inactive'}
  >
    Continue
  </button>
</div>


      


    </>
  );
};

export default Language5;