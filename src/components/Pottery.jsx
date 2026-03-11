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

        <img src="images/pottery2-image2.png"
         alt="" />

           <div className='pottery-content'>
           <p>Golden Mask</p>
           <button>Add to Cart</button>

        </div>

         <div className='seller4-price'>

        <p>Price : $25</p>

      </div>


      </div>
      <div className='pottery-grid pot2'>

        <img src="images/pottery4-image5.png" alt="" />

        <div className='pottery-content'>
           <p>Ceramic Cup</p>
           <button>Add to Cart</button>

        </div>

         <div className='seller4-price'>

        <p>Price : $25</p>

      </div>


      </div>
      <div className='pottery-grid pot3'>

        <img src="images/pottery3-image3.png" alt="" />

        <div className='pottery-content'>
           <p>Vace</p>
         <button>Add to Cart</button>

        </div>

         <div className='seller4-price'>

        <p>Price : $25</p>

      </div>


      </div>
      <div className='pottery-grid pot4'>

        <img src="images/pottery5-image6.png" alt="" />

        <div className='pottery-content'>
           <p>Bowl</p>
          <button>Add to cart</button>
        </div>

         <div className='seller4-price'>

        <p>Price : $25</p>

      </div>


      </div>
       
    </div>


   </div>
   </>
  )
}

export default Pottery