import React from 'react'
import '../styles/language2.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Language2 = () => {

    const navigate = useNavigate(); 
  
    const handleNavigation = (path) => { 
      navigate(path);
    };


  return (
 <>

 <Navbar solid />

 <div className='learning-languages'>

  <h1>
    I want to Learn...
  </h1>

  <div className='the-languages'>


       <div className='la-3' onClick={()=> handleNavigation('/language3')}>

      <div className='la-1-text'>

       <img src="\images\Kenyan-flag.png" alt="img" />

        <h2>Ekegusii</h2>
        <h2>30k Learners</h2>

      </div>


    </div>

    <div className='la-1'>

      <div className='la-1-text'>

       <img src="\images\South-African-flag.png" alt="img" />

        <h2>Zulu</h2>
        <h2>60k Learners</h2>

      </div>

    </div>

    <div className='la-2'>

      <div className='la-1-text'>

       <img src="\images\Nigeria-flag.png" alt="img" />

        <h2>Igbo</h2>
        <h2>24k Learners</h2>

      </div>

    </div>

 

    <div className='la-4'>

      <div className='la-1-text'>

       <img src="\images\somali-flag.png" alt="img" />

        <h2>Somali</h2>
        <h2>45k Learners</h2>

      </div>

    </div>


    

  </div>



 </div>

    </>
  )
}

export default Language2