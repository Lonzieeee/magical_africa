import React from 'react'
import '../styles/carvings.css'   // reuse the SAME styling like carvings

const fashionData = {
  "Clothing": [
    {
      img: "/images/maasai-wear2.jpg",
      tribe: "Maasai",
      name: "Maasai Shuka Outfit",
      price: "$60",
      desc: "Traditional red shuka worn by Maasai warriors."
    },
    {
      img: "/images/nigeria-wear2.jpg",
      tribe: "Yoruba",
      name: "Ankara Dress",
      price: "$75",
      desc: "Elegant Ankara print dress for special occasions."
    },
    {
      img: "/images/maasai-wear2.jpg",
      tribe: "Maasai",
      name: "Maasai Shuka Outfit",
      price: "$60",
      desc: "Traditional red shuka worn by Maasai warriors."
    },
    {
      img: "/images/nigeria-wear2.jpg",
      tribe: "Yoruba",
      name: "Ankara Dress",
      price: "$75",
      desc: "Elegant Ankara print dress for special occasions."
    }
  ],

  "Textiles": [
    {
      img: "/images/kitenge-latest.jpg",
      tribe: "Ashanti",
      name: "Kente Cloth",
      price: "$90",
      desc: "Handwoven kente textile symbolizing royalty."
    },
    {
      img: "/images/kitenge2-latest.jpg",
      tribe: "Mali",
      name: "Mud Cloth",
      price: "$85",
      desc: "Bogolanfini fabric dyed using fermented mud."
    },
    {
      img: "/images/kitenge-latest.jpg",
      tribe: "Ashanti",
      name: "Kente Cloth",
      price: "$90",
      desc: "Handwoven kente textile symbolizing royalty."
    },
    {
      img: "/images/kitenge2-latest.jpg",
      tribe: "Mali",
      name: "Mud Cloth",
      price: "$85",
      desc: "Bogolanfini fabric dyed using fermented mud."
    }
  ],

  "Shoes": [
    {
      img: "/images/maasai-women-latest.jpg",
      tribe: "Maasai",
      name: "Beaded Sandals",
      price: "$40",
      desc: "Handcrafted leather sandals with beadwork."
    },
    {
      img: "/images/maasai-migration.jpg",
      tribe: "Ethiopian",
      name: "Habesha Shoes",
      price: "$55",
      desc: "Traditional handmade leather footwear."
    },
     {
      img: "/images/maasai-women-latest.jpg",
      tribe: "Maasai",
      name: "Beaded Sandals",
      price: "$40",
      desc: "Handcrafted leather sandals with beadwork."
    },
    {
      img: "/images/maasai-migration.jpg",
      tribe: "Ethiopian",
      name: "Habesha Shoes",
      price: "$55",
      desc: "Traditional handmade leather footwear."
    }
  ],

  "Adornments": [
    {
      img: "/images/beaded-jewelery2.jpg",
      tribe: "Maasai",
      name: "Beaded Necklace",
      price: "$35",
      desc: "Colourful handmade bead necklace."
    },
    {
      img: "/images/maasai-bracelets2.jpg",
      tribe: "Maasai",
      name: "Beaded Bracelets",
      price: "$25",
      desc: "Set of vibrant handmade bracelets."
    },
    {
      img: "/images/beaded-jewelery2.jpg",
      tribe: "Maasai",
      name: "Beaded Necklace",
      price: "$35",
      desc: "Colourful handmade bead necklace."
    },
    {
      img: "/images/maasai-bracelets2.jpg",
      tribe: "Maasai",
      name: "Beaded Bracelets",
      price: "$25",
      desc: "Set of vibrant handmade bracelets."
    }
  ]
}

const Fashion = ({ subCategory }) => {
  const items = fashionData[subCategory] || fashionData["Clothing"]

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

export default Fashion