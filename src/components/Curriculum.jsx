import React from 'react'
import '../styles/curriculum.css'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'


const Curriculum = () => {

  const navigate = useNavigate()
  return (
   <>

   <Navbar solid />


   <div className='curriculum-div'>

       <h1>
      eLearning solution that <span> works for you</span>

    </h1>

    <p className='curriculum-div-p'>
      Teach anyone, anything, from anywhere. Your best bet to create, manage, and sell  <span>eLearning courses – all in one place!</span>
    </p>


    <div className='curriculum-div-dec'>


      <div className='curriculum-dec'>

        <div className='curriculum1'>

          <button onClick={()=> navigate('/teacher')}>&#8592;</button>
          <p>Curriculum</p>

        </div>


        <div className='curriculum2'>

          <img src="/images/vector-image2.png" alt="" />
          <h2>Start Building Your Course</h2>
          <p>Add Topics, Lessons and Quizes to get Started.</p>


          <button onClick={()=> navigate('/lesson')}>
            Add Topic
          </button>



        </div>


        <div className='curriculum3'>

          <button  onClick={()=> navigate('/lesson')}>Next &#8250;</button>

          

        </div>

      </div>

    </div>


   </div>

   </>
  )
}

export default Curriculum