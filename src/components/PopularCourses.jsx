{/* 

import React from 'react'
import '../styles/popular-courses.css'


const PopularCourses = () => {
  return (
    <>

    <div className="popular-course-div">

      <h1>Our courses</h1>
      <p className='popular-content-div-p'>Explore a wide range of courses taught by passionate African educators — from traditional crafts to cultural arts, there is something for everyone.</p>

      <div className='pop-div'>
      <p className='pop'>Popular Courses</p>
      </div>


      <div className='popular-div'>

        <div className='popular1'>
       <div className='popular-div-content'>
         <h3>Pottery courses</h3>
       </div>

        </div>

        <div className='popular2'>

          <div className='popular2-a'>

            <div className='popular2-a1'>

              <div className='popular-div-content'>
                 <h3>Instrument making</h3>

             </div>

            </div>

            <div className='popular2-a2'>
              <div className='popular-div-content'>

               <h3>Weaving courses</h3>

             </div>

            </div>

          </div>

          <div className='popular2-b'>

             <div className='popular2-b1'>
              <div className='popular-div-content'>
     <h3>Cooking courses</h3>
             </div>

            </div>

            <div className='popular2-b2'>
              <div className='popular-div-content'>
                <h3>Wood-carving courses</h3>

       </div>

            </div>


         

          </div>


        </div>



      </div>

<div className='pop-bottom-div'>
      <p className='pop-bottom'>
        View more 
         <i className="fa-solid fa-arrow-right"></i>
      </p>
</div>

    </div>

    </>
  )
}

export default PopularCourses

*/}

import React from 'react'
import { useTranslation } from 'react-i18next';
import '../styles/popular-courses.css'
import { useNavigate } from 'react-router-dom';


const PopularCourses = () => {
  const { t } = useTranslation();


      const navigate = useNavigate(); // 👈 1. create navigate
    
      // 👈 2. define the handler
      const handleNavigation = (path) => {
        navigate(path);
      };

  return (
    <>
      <div className="popular-course-div">

        <h1>{t('popularCourses.title')}</h1>
        <p className='popular-content-div-p'>{t('popularCourses.subtitle')}</p>

        <div className='pop-div'>
          <p className='pop'>{t('popularCourses.popularLabel')}</p>
        </div>

        <div className='popular-div'>

          <div className='popular1'>
            <div className='popular-div-content'>
              <h3>{t('popularCourses.pottery')}</h3>
            </div>
          </div>

          <div className='popular2'>

            <div className='popular2-a'>

              <div className='popular2-a1'>
                <div className='popular-div-content'>
                  <h3>{t('popularCourses.instrumentMaking')}</h3>
                </div>
              </div>

              <div className='popular2-a2'>
                <div className='popular-div-content'>
                  <h3>{t('popularCourses.weaving')}</h3>
                </div>
              </div>

            </div>

            <div className='popular2-b'>

              <div className='popular2-b1'>
                <div className='popular-div-content'>
                  <h3>{t('popularCourses.cooking')}</h3>
                </div>
              </div>

              <div className='popular2-b2'>
                <div className='popular-div-content'>
                  <h3>{t('popularCourses.woodCarving')}</h3>
                </div>
              </div>

            </div>

          </div>

        </div>

        <div className='pop-bottom-div'>
          <p className='pop-bottom' onClick={()=> navigate('/academy2')}>
            {t('popularCourses.viewMore')}
            <i className="fa-solid fa-arrow-right"></i>
          </p>
        </div>

      </div>
    </>
  )
}

export default PopularCourses
