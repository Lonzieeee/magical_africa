import '../styles/tribes.css';

const TribesSection = () => {
  return (
    <section className="tribes">
      <h1>Explore Our Tribes</h1>
      <p>Journey through Africa's diverse tribes and timeless traditions</p>

      <div className="tribes-section">
        <div className="tribe1">
          <h1>Oromo</h1>
          <p>Rooted in Ethiopia, the Oromo people carry a proud legacy of tradition, unity, and cultural identity. They are the country's largest ethnic group, making up about one-third of the population with around 40 million people.</p>
        </div>

        <div className="tribe2">
          <h1>Zulu</h1>
          <p>From South Africa, the Zulu people carry a powerful legacy of tradition, resilience, and identity, representing over 11 million people.</p>
        </div>

        <div className="tribe3">
          <h1>Igbo</h1>
          <p>Rooted in Nigeria, the Igbo people are one of the country's largest ethnic groups, numbering over 30 million, known for their rich traditions, entrepreneurship, and strong communal values.</p>
        </div>
      </div>

      <div className="view-more2">
        <hr />
        <button className="show-btn3">
          <span>View All</span>
        </button>
       
      </div>
    </section>
  );
};

export default TribesSection;
