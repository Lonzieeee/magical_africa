import { useState } from 'react';
import '../styles/marketplace.css';

const marketplaceData = [
  {
    name: 'Jewelery',
    sections: [
      { image: '/images/maasai-bracelets.jpg', title: 'Maasai bracelets', description: 'Maasai beaded bracelets showcasing tradition and artistry.', price: '$15' },
      { image: '/images/beaded-jewelery.jpg', title: 'Beaded jewelery', description: 'Handcrafted stone jewelry with natural elegance.', price: '$75' },
      { image: '/images/maasai-necklaces.jpg', title: 'Maasai necklaces', description: 'Traditional Maasai beaded necklaces with vibrant colors.', price: '$65' }
    ]
  },
  {
    name: 'Garments',
    sections: [
      { image: '/images/nigeria-wear.jpg', title: 'Ankara Gown', description: 'Made from Ankara Fabric, worn across many Nigerian cultures.', price: '$200' },
      { image: '/images/maasai-wear.jpg', title: 'Maasai Leso', description: 'Worn by Maasai men and women across Kenya and Tanzania.', price: '$120' },
      { image: '/images/kitenge.jpg', title: 'Kitenge', description: 'Made from brightly patterned cotton fabric for both men and women.', price: '$100' }
    ]
  },
  {
    name: 'Tools & Artefacts',
    sections: [
      { image: '/images/hammer.jpg', title: 'Carpentry Tools', description: 'Artisan carpentry tools for perfect craftsmanship.', price: '$300' },
      { image: '/images/shoka.png', title: 'Farming Tools', description: 'Traditional farming implements still in use today.', price: '$150' },
      { image: '/images/spear.jpg', title: 'Traditional Spears', description: 'Handcrafted spears used by warriors throughout history.', price: '$80' }
    ]
  },
  {
    name: 'Musical Instruments',
    sections: [
      { image: '/images/drums.jpg', title: 'Drums', description: 'Traditional African drums for ceremonies and celebrations.', price: '$400' },
      { image: '/images/string-instrument.jpg', title: 'String Instruments', description: 'Handmade string instruments with unique sounds.', price: '$200' },
      { image: '/images/wind-instrument.jpg', title: 'Wind Instruments', description: 'Traditional flutes and horns made from natural materials.', price: '$150' }
    ]
  }
];

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  const currentData = marketplaceData[activeCategory];

  return (
    <section className="marketplace">
      <h1>Our Marketplace</h1>

      <ul id="categoryList">
        {marketplaceData.map((category, index) => (
          <li 
            key={index}
            className={activeCategory === index ? 'active' : ''}
            onClick={() => setActiveCategory(index)}
          >
            {category.name} <span>{index + 1}</span>
          </li>
        ))}
      </ul>

      <div className="market-section">
        {currentData.sections.map((item, index) => (
          <div 
            key={index}
            className={`section section${index + 1}`}
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="description">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span>Price: {item.price}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="show-all2">
        <button className="show-btn2">View All</button>
      </div>
    </section>
  );
};

export default Marketplace;
