import React from 'react'
import '../styles/small-footer.css'

const SmallFooter = () => {
  return (
    <>

    <div className='small-footer-div'>

      <div className='small-footer1'>
        <a href="">Magical Africa</a>

        <div className='small-footer1-links'>

           <span onClick={() => window.open('https://www.facebook.com/profile.php?id=61583415501249', '_blank')}>
    <i className="fa-brands fa-facebook-f"></i>
  </span>
  <span onClick={() => window.open('https://www.instagram.com/africa_magical/', '_blank')}>
    <i className="fa-brands fa-instagram"></i>
  </span>
  <span onClick={() => window.open('https://x.com/MagicalAfr23463', '_blank')}>
    <i className="fa-brands fa-x-twitter"></i>
  </span>
  <span onClick={() => window.open('https://www.tiktok.com/@exploremagicalafr', '_blank')}>
    <i className="fa-brands fa-tiktok"></i>
  </span>
        </div>

      </div>

      <div className='small-footer2'>

        <p>
          © 2026 Magical.africa. All rights reserved
        </p>

      </div>

      <div className='small-footer3'>
       

       <div>
          <p>Terms of Use</p>
        <p>Privacy Policy</p>

       </div>

       <div>
        <p>Cookie Policy</p>
        <p>Cookie Setings</p>

       </div>
      
        



      </div>

    </div>
    </>
  )
}

export default SmallFooter