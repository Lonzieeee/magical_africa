import React from 'react'
import { useTranslation } from 'react-i18next';
import '../styles/popular-courses.css'
import { useNavigate } from 'react-router-dom';
import useAcademyNavigation from "../hooks/useAcademyNavigation";

const PopularCourses = () => {
  const { t } = useTranslation();
  const goToAcademy = useAcademyNavigation();
  const navigate = useNavigate();

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

          <div className='popular1 pc-card'>
            <div className='popular-div-content'>
              <h3>{t('popularCourses.pottery')}</h3>
            </div>
            <div className='pc-overlay'>
              <h3>{t('popularCourses.pottery')}</h3>
              <p>{t('popularCourses.potteryDesc')}</p>
            </div>
          </div>

          <div className='popular2'>

            <div className='popular2-a'>

              <div className='popular2-a1 pc-card'>
                <div className='popular-div-content'>
                  <h3>{t('popularCourses.instrumentMaking')}</h3>
                </div>
                <div className='pc-overlay'>
                  <h3>{t('popularCourses.instrumentMaking')}</h3>
                  <p>{t('popularCourses.instrumentMakingDesc')}</p>
                </div>
              </div>

              <div className='popular2-a2 pc-card'>
                <div className='popular-div-content'>
                  <h3>{t('popularCourses.weaving')}</h3>
                </div>
                <div className='pc-overlay'>
                  <h3>{t('popularCourses.weaving')}</h3>
                  <p>{t('popularCourses.weavingDesc')}</p>
                </div>
              </div>

            </div>

            <div className='popular2-b'>

              <div className='popular2-b1 pc-card'>
                <div className='popular-div-content'>
                  <h3>{t('popularCourses.cooking')}</h3>
                </div>
                <div className='pc-overlay'>
                  <h3>{t('popularCourses.cooking')}</h3>
                  <p>{t('popularCourses.cookingDesc')}</p>
                </div>
              </div>

              <div className='popular2-b2 pc-card'>
                <div className='popular-div-content'>
                  <h3>{t('popularCourses.woodCarving')}</h3>
                </div>
                <div className='pc-overlay'>
                  <h3>{t('popularCourses.woodCarving')}</h3>
                  <p>{t('popularCourses.woodCarvingDesc')}</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        <div className='pop-bottom-div'>
          <p className='pop-bottom' onClick={() => handleNavigation('/academy')}>
            {t('popularCourses.viewMore')}
            <i className="fa-solid fa-arrow-right"></i>
          </p>
        </div>

      </div>
    </>
  )
}

export default PopularCourses