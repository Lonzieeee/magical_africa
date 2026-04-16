import React from 'react'
import '../styles/jewelery.css'

const jewelleryData = {
  'Beadwork Jewellery': [
    {
      id: 1,
      image: '/images/beaded-jewelery2.jpg',
      name: 'Maasai Beaded Necklace',
      price: 45,
      tribe: 'Maasai',
      description: 'Handwoven with vibrant glass beads using centuries-old Maasai beading techniques.',
    },
    {
      id: 2,
      image: '/images/maasai-bracelets2.jpg',
      name: 'Beaded Maasai Bracelet',
      price: 25,
      tribe: 'Maasai',
      description: 'Colourful stacked bracelets handcrafted by Maasai women of the Rift Valley.',
    },
    {
      id: 3,
      image: '/images/nigeria-wear2.jpg',
      name: 'Nigerian Bead Set',
      price: 60,
      tribe: 'Yoruba',
      description: 'Traditional Yoruba beadwork worn during ceremonies and celebrations.',
    },
     {
      id: 2,
      image: '/images/maasai-bracelets2.jpg',
      name: 'Beaded Maasai Bracelet',
      price: 25,
      tribe: 'Maasai',
      description: 'Colourful stacked bracelets handcrafted by Maasai women of the Rift Valley.',
    },
  ],
  'Stone Jewellery': [
    {
      id: 1,
      image: '/images/beaded-jewelery2.jpg',
      name: 'Stone Bead Necklace',
      price: 55,
      tribe: 'Kikuyu',
      description: 'Polished natural stones strung by hand, sourced from the Kenyan highlands.',
    },
    {
      id: 2,
      image: '/images/maasai-bracelets2.jpg',
      name: 'Lava Stone Bracelet',
      price: 30,
      tribe: 'Kamba',
      description: 'Carved from volcanic lava stone, believed to carry grounding energy.',
    },
    {
      id: 3,
      image: '/images/nigeria-wear2.jpg',
      name: 'Turquoise Stone Ring',
      price: 40,
      tribe: 'Tuareg',
      description: 'Hand-set turquoise in sterling silver by Tuareg craftsmen of the Sahara.',
    },
    {
      id: 2,
      image: '/images/maasai-bracelets2.jpg',
      name: 'Lava Stone Bracelet',
      price: 30,
      tribe: 'Kamba',
      description: 'Carved from volcanic lava stone, believed to carry grounding energy.',
    },
  ],
  'Brass Jewellery': [
    {
      id: 1,
      image: '/images/woman-mask2.png',
      name: 'Brass Cuff Bangle',
      price: 35,
      tribe: 'Ashanti',
      description: 'Cast brass bangle inspired by Ashanti royal court jewellery traditions.',
    },
    {
      id: 2,
      image: '/images/beaded-jewelery2.jpg',
      name: 'Brass Pendant Necklace',
      price: 50,
      tribe: 'Benin',
      description: 'Intricate lost-wax cast brass pendant echoing ancient Benin Kingdom artistry.',
    },
    {
      id: 3,
      image: '/images/maasai-bracelets2.jpg',
      name: 'Brass Earrings',
      price: 28,
      tribe: 'Fulani',
      description: 'Lightweight hammered brass earrings traditionally worn by Fulani women.',
    },
     {
      id: 1,
      image: '/images/woman-mask2.png',
      name: 'Brass Cuff Bangle',
      price: 35,
      tribe: 'Ashanti',
      description: 'Cast brass bangle inspired by Ashanti royal court jewellery traditions.',
    },
  ],
  'Gold Jewellery': [
    {
      id: 1,
      image: '/images/Golden-set2.jpg',
      name: 'Gold Akan Ring',
      price: 220,
      tribe: 'Akan',
      description: 'Solid gold ring cast in the Akan tradition, symbolising wealth and prestige.',
    },
    {
      id: 2,
      image: '/images/woman-mask2.png',
      name: 'Gold Filigree Necklace',
      price: 310,
      tribe: 'Ashanti',
      description: 'Delicate filigree goldwork handcrafted by master goldsmiths in Kumasi.',
    },
    {
      id: 3,
      image: '/images/beaded-jewelery2.jpg',
      name: 'Gold Bead Bracelet',
      price: 175,
      tribe: 'Wolof',
      description: 'Pure gold beads strung on silk thread, a staple of Wolof bridal jewellery.',
    },
    {
      id: 2,
      image: '/images/woman-mask2.png',
      name: 'Gold Filigree Necklace',
      price: 310,
      tribe: 'Ashanti',
      description: 'Delicate filigree goldwork handcrafted by master goldsmiths in Kumasi.',
    },
  ],
  'Silver Jewellery': [
    {
      id: 1,
      image: '/images/maasai-bracelets2.jpg',
      name: 'Silver Tuareg Cross',
      price: 80,
      tribe: 'Tuareg',
      description: 'Iconic Tuareg cross pendant hand-engraved in solid silver from Mali.',
    },
    {
      id: 2,
      image: '/images/beaded-jewelery2.jpg',
      name: 'Silver Berber Bracelet',
      price: 95,
      tribe: 'Berber',
      description: 'Wide silver cuff engraved with geometric Berber symbols of protection.',
    },
    {
      id: 3,
      image: '/images/nigeria-wear2.jpg',
      name: 'Silver Anklet',
      price: 60,
      tribe: 'Hausa',
      description: 'Sterling silver anklet worn during Hausa traditional celebrations.',
    },
    {
      id: 1,
      image: '/images/maasai-bracelets2.jpg',
      name: 'Silver Tuareg Cross',
      price: 80,
      tribe: 'Tuareg',
      description: 'Iconic Tuareg cross pendant hand-engraved in solid silver from Mali.',
    },
  ],
};

const Jewelery = ({ subCategory }) => {
  const items = jewelleryData[subCategory] || jewelleryData['Beadwork Jewellery'];

  return (
    <div className='African-jewelery'>

      {/* Left hero panel */}
      <div className='African-jewelery1'>
        <div className='jewelery-hero-label'>
          <h2>{subCategory}</h2>
          <p>Handcrafted with tradition</p>
        </div>
      </div>

      {/* Right grid */}
      <div className='African-jewelery2'>
        {items.map((item) => (
          <div key={item.id} className='grid-item' style={{ backgroundImage: `url(${item.image})` }}>

            <div className='seller-price2'>
              <p>Price: ${item.price}</p>
            </div>

            <div className='grid-item-description'>
              <span className='grid-tribe-pill'>{item.tribe}</span>
              <p className='grid-item-name'>{item.name}</p>
              <p className='grid-item-desc'>{item.description}</p>
              <h3 className='grid-add-cart'>+ Add to Cart</h3>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Jewelery;