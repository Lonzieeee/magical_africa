import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/contact-widget.css'

const ContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <>
      <div className={`cw-modal ${isOpen ? 'cw-modal--open' : ''}`}>

        <div className='cw-modal-header'>
          <div className='cw-modal-header-text'>
            <img
              src='/images/magivcal-logo2-removebg-preview.png'
              alt='Magical Africa'
              className='cw-logo'
            />
            <div>
              <h3>Magical Africa</h3>
              <p>We're here to help</p>
            </div>
          </div>
          <button className='cw-close-btn' onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className='cw-modal-body'>

          <div className='cw-section'>
            <p className='cw-section-label'>Get in Touch</p>
            <a href='mailto:gloria@magical.africa' className='cw-contact-row'>
              <span className='cw-contact-icon'><i className='fa-regular fa-envelope'></i></span>
              <div>
                <span className='cw-contact-type'>Email</span>
                <span className='cw-contact-value'>gloria@magical.africa</span>
              </div>
            </a>
            <a href='tel:+254718085773' className='cw-contact-row'>
              <span className='cw-contact-icon'><i className='fa-solid fa-mobile'></i></span>
              <div>
                <span className='cw-contact-type'>Call Us</span>
                <span className='cw-contact-value'>+254 718 085 773</span>
              </div>
            </a>
            <a href='https://wa.me/254718085773' target='_blank' rel='noreferrer' className='cw-contact-row'>
              <span className='cw-contact-icon'><i className='fa-brands fa-whatsapp'></i></span>
              <div>
                <span className='cw-contact-type'>WhatsApp</span>
                <span className='cw-contact-value'>+254 718 085 773</span>
              </div>
            </a>
            <div className='cw-contact-row cw-contact-row--static'>
              <span className='cw-contact-icon'><i className='fa-solid fa-location-dot'></i></span>
              <div>
                <span className='cw-contact-type'>Location</span>
                <span className='cw-contact-value'>Chandaria Innovation Center</span>
              </div>
            </div>
          </div>

          <div className='cw-divider' />

          <div className='cw-section'>
            <p className='cw-section-label'>Follow Us</p>
            <div className='cw-socials'>
              <a href='https://www.facebook.com/profile.php?id=61583415501249' target='_blank' rel='noreferrer' className='cw-social-btn'>
                <i className='fa-brands fa-facebook-f'></i>
              </a>
              <a href='https://www.instagram.com/africa_magical/' target='_blank' rel='noreferrer' className='cw-social-btn'>
                <i className='fa-brands fa-instagram'></i>
              </a>
              <a href='https://x.com/MagicalAfr23463' target='_blank' rel='noreferrer' className='cw-social-btn'>
                <i className='fa-brands fa-x-twitter'></i>
              </a>
              <a href='https://www.tiktok.com/@exploremagicalafr' target='_blank' rel='noreferrer' className='cw-social-btn'>
                <i className='fa-brands fa-tiktok'></i>
              </a>
            </div>
          </div>

        </div>
      </div>

      <button
        className={`cw-trigger ${isOpen ? 'cw-trigger--open' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label='Contact us'
      >
        {isOpen
          ? <i className='fa-solid fa-xmark'></i>
          : <i className='fa-regular fa-comments'></i>

        }
      </button>
    </>
  )
}

export default ContactWidget