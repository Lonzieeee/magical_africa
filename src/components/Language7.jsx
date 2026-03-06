import React from 'react'
import '../styles/language4.css';
import '../styles/language2.css'
import '../styles/language5.css'
import '../styles/language6.css'
import '../styles/language7.css'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Language7 = () => {

  
  return (
    <>
    <Navbar solid />


    <div className='common-nouns'>

      <h1>Common nouns</h1>


      <div className='common-nouns-div'>

        <div className='noun1'>

          <img src="/images/sunrise.png" alt="" />

           <p className='actual'>Esese</p>
          <p className='translation'>Meaning - Dog</p>
         

        </div>


        <div className='noun2'>

          <img src="/images/book.png" alt="" />
 
         <p className='actual'>Egetabu</p>
          <p className='translation'>Meaning - Book</p>
          

        </div>


        <div className='noun3'>
          <img src="/images/chair.png" alt="" />

         <p className='actual'>Ekerogo</p>
          <p className='translation'>Meaning - Chair</p>

        </div>

        <div className='noun4'>
          <img src="/images/cat.png" alt="" />

          <p className='actual'>Egebusi</p>
          <p className='translation'>Meaning - Cat</p>

        </div>


      </div>


       
       <div className='common-nouns-div'>

        <div className='noun1'>

          <img src="/images/sunrise.png" alt="" />

           <p className='actual'>Ekaramu</p>
          <p className='translation'>Meaning - Pen</p>
         

        </div>


        <div className='noun2'>

          <img src="/images/book.png" alt="" />
 
         <p className='actual'>Egekombe</p>
          <p className='translation'>Meaning - Cup</p>
          

        </div>


        <div className='noun3'>
          <img src="/images/chair.png" alt="" />

         <p className='actual'>Egechiko</p>
          <p className='translation'>Meaning - Spoon</p>

        </div>

        <div className='noun4'>
          <img src="/images/cat.png" alt="" />

          <p className='actual'>Omonto</p>
          <p className='translation'>Meaning - Person</p>

        </div>


      </div>
      



    </div>

     <div className='continue-button'>
        <button onClick={() => navigate('/language7')}>
          Next
        </button>
      </div>


    </>
  )
}

export default Language7