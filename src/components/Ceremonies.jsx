
import React from 'react'
import '../styles/ceremonies.css'

const Ceremonies = () => {
  return (
    <>
    
    <div className='Ceremonies-div'>

      <div className='ceremony1'>

        <div className='ceremony1-a slide-in'>

          <div className='ceremony-img'></div>

          <div className='ceremony-text'>

            <h1>Maasai Cultural Week</h1>

            <p>
              Experience the Maasai people's warrior dances, beadwork traditions, and cattle ceremonies up close during this immersive week of cultural education and community storytelling.
            </p>

            <div className='ceremony-location'>
              <p>📍 Rift Valley, Kenya</p>
              <button>Book Now</button>
            </div>

          </div>

        </div>


        <div className='ceremony1-b slide-in delay-2'>

          <div className='ceremony-img2'></div>

          <div className='ceremony-text'>

            <h1>Homowo Harvest Festival</h1>

            <p>
              The Ga people of Ghana "hoot at hunger" with this vibrant harvest celebration. Families reunite, ancestral rites are performed, and the streets overflow with kpokpoi.
            </p>

            <div className='ceremony-location'>
              <p>📍 Accra, Ghana</p>
              <button>Book Now</button>
            </div>

          </div>

        </div>


        <div className='ceremony1-c slide-in delay-3'>

          <div className='ceremony-img3'></div>

          <div className='ceremony-text'>

            <h1>Zulu Reed Dance</h1>

            <p>
              Thousands of Zulu maidens gather annually to celebrate their heritage in a vibrant ceremony of song, dance, and traditional dress at the royal palace in KwaZulu-Natal.
            </p>

            <div className='ceremony-location'>
              <p>📍 KwaZulu-Natal, South Africa</p>
              <button>Book Now</button>
            </div>

          </div>

        </div>

      </div>

    </div>
    </>
  )
}

export default Ceremonies