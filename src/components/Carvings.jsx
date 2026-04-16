import React from 'react'
import '../styles/carvings.css'

const carvingsData = {
  "Wood Sculpture": [
    {
      img: "/images/beaded-jewelery2.jpg",
      tribe: "Makonde",
      name: "Spirit Guardian",
      price: "$120",
      desc: "Hand-carved hardwood sculpture symbolizing ancestral protection."
    },
    {
      img: "/images/woman-mask2.png",
      tribe: "Ashanti",
      name: "Royal Stool Mini",
      price: "$95",
      desc: "Miniature ceremonial stool carved from mahogany."
    },
    {
      img: "/images/maasai-necklaces2.jpg",
      tribe: "Makonde",
      name: "Spirit Guardian",
      price: "$120",
      desc: "Hand-carved hardwood sculpture symbolizing ancestral protection."
    },
    {
      img: "/images/maasai-wear2.jpg",
      tribe: "Ashanti",
      name: "Royal Stool Mini",
      price: "$95",
      desc: "Miniature ceremonial stool carved from mahogany."
    }
  ],

  "Stone Sculpture": [
    {
      img: "/images/maasai-bracelets2.jpg",
      tribe: "Shona",
      name: "Mother & Child",
      price: "$210",
      desc: "Zimbabwean serpentine stone sculpture symbolizing family."
    },
    {
      img: "/images/nigeria-wear2.jpg",
      tribe: "Shona",
      name: "Thinker",
      price: "$180",
      desc: "Hand-polished stone figure representing wisdom."
    },
    {
      img: "/images/maasai-bracelets2.jpg",
      tribe: "Shona",
      name: "Mother & Child",
      price: "$210",
      desc: "Zimbabwean serpentine stone sculpture symbolizing family."
    },
    {
      img: "/images/nigeria-wear2.jpg",
      tribe: "Shona",
      name: "Thinker",
      price: "$180",
      desc: "Hand-polished stone figure representing wisdom."
    }

  ],

  "Metallic Sculpture": [
    {
      img: "/images/beaded-jewelery2.jpg",
      tribe: "Yoruba",
      name: "Benin Head",
      price: "$260",
      desc: "Bronze cast inspired by ancient Benin artistry."
    },
    {
      img: "/images/woman-mask2.png",
      tribe: "Dogon",
      name: "Warrior Figure",
      price: "$190",
      desc: "Forged metal sculpture representing strength and courage."
    },
     {
      img: "/images/beaded-jewelery2.jpg",
      tribe: "Yoruba",
      name: "Benin Head",
      price: "$260",
      desc: "Bronze cast inspired by ancient Benin artistry."
    },
    {
      img: "/images/woman-mask2.png",
      tribe: "Dogon",
      name: "Warrior Figure",
      price: "$190",
      desc: "Forged metal sculpture representing strength and courage."
    }
  ]
}

const Carvings = ({ subCategory }) => {

  const items = carvingsData[subCategory] || carvingsData["Wood Sculpture"]

  return (
    <div className='Carvings-div'>
      {items.map((item, index) => (
        <div
          key={index}
          className='carving'
          style={{ backgroundImage: `url(${item.img})` }}
        >
       <div className='carving-description'>
  <p className='carving-pill'>{item.tribe}</p>
  <h3>{item.name}</h3>
  <p className='carving-desc'>{item.desc}</p>
  <button>Add to Cart</button>
</div>

          <div className='seller-price3'>
            <p>Price : {item.price}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Carvings