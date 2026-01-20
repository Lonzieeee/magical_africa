import '../styles/contact.css';

const Contact = () => {
  return (
    <section className="contact-page">
      <div className="contact-section">
        <div className="contact1">
          <h1>Magical Africa</h1>
          <p>
            Have questions about African culture, heritage, or our collections? Reach out to us and discover the stories, traditions, and creativity that make Africa unique. We'd love to connect with you and share the true magic of Africa.
          </p>
          <button>Contact Us</button>
        </div>

        <div className="contact2">
          <img src="/images/logo.png" alt="logo" />
          
          <div className="contact-links">
            <a href="#">
              <i className="fa-regular fa-envelope"></i>
              info@magical.africa
            </a>
            <a href="#">
              <i className="fa-solid fa-mobile"></i>
              +254 718 085 773
            </a>
            <a href="#">
              <i className="fa-solid fa-location-dot"></i>
              Nairobi, Kenya
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
