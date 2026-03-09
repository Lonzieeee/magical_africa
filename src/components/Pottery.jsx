import React from 'react'
import '../styles/pottery.css'

const Pottery = () => {
  return (
   <>
   
   <div className='Pottery-div'>

    <div className='pottery1'>

    </div>

    <div className='pottery2'>

      <div className='pottery-grid pot1'>

        <img src="images/pottery-image2.png"
         alt="" />

           <div className='pottery-content'>
           <p>Golden Mask</p>
          <h3>Add to Cart</h3>

        </div>

      </div>
      <div className='pottery-grid pot2'>

        <img src="images/pottery-image5.png" alt="" />

        <div className='pottery-content'>
           <p>Ceramic Cup</p>
          <h3>Add to Cart</h3>

        </div>


      </div>
      <div className='pottery-grid pot3'>

        <img src="images/pottery-image3.png" alt="" />

        <div className='pottery-content'>
           <p>Vace</p>
          <h3>Add to Cart</h3>

        </div>


      </div>
      <div className='pottery-grid pot4'>

        <img src="images/pottery-image6.png" alt="" />

        <div className='pottery-content'>
           <p>Bowl</p>
          <h3>Add to Cart</h3>

        </div>


      </div>
       
    </div>


   </div>
   </>
  )
}

export default Pottery