import React from 'react'
import '../styles/courseCard.css'

const CourseCard = ({ title, description, difficulty, regularPrice, salePrice, featuredImage, teacherName, maxStudents }) => {
  return (
    <div className='course-card'>

      {/* Thumbnail */}
      <div className='course-card-image'>
        {featuredImage
          ? <img src={featuredImage} alt="Course thumbnail" />
          : <div className='course-card-image-placeholder'>
              <span>&#128444;</span>
              <p>Upload a featured image above</p>
            </div>
        }
      </div>

      {/* Card body */}
      <div className='course-card-body'>

        <h2 className='course-card-title'>
          {title || 'Your Course Title'}
        </h2>

        <p className='course-card-desc'>
          {description
            ? description.length > 100 ? description.slice(0, 100) + '...' : description
            : 'Your course description will appear here.'}
        </p>

        {/* ✅ Shows teacher's real name */}
        <p className='course-card-author'>
             <span>Created By</span>
           {teacherName || 'magical.africa Academy'}
        </p>

        {/* Badges */}
        <div className='course-card-meta'>
          <span className={`course-card-badge ${difficulty === 'Hard' ? 'badge-hard' : 'badge-beginner'}`}>
            {difficulty || 'Beginner'}
          </span>
          {/* 
          <span className='course-card-star'>&#9733; 0.0</span>
          */}
         <span className='course-card-meta-text2'>
     {maxStudents ? `${maxStudents} Students` : 'No Students'}
     </span>
          <span className='course-card-meta-text'>&#183; All Levels</span>
        </div>

        {/* Price + cart */}
        <div className='course-card-footer'>
          <div className='course-card-prices'>
            <span className='course-card-sale-price'>
              {salePrice ? `$${salePrice}` : '$0.00'}
            </span>
            {regularPrice && (
              <span className='course-card-reg-price'>${regularPrice}</span>
            )}
          </div>
          <button className='course-card-cart-btn'>Add to cart</button>
        </div>

      </div>
    </div>
  )
}

export default CourseCard