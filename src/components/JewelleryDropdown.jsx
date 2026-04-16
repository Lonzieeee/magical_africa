import React from "react";
import '../styles/jewellery-dropdown.css'

const JewelleryDropdown = ({ visible, onSelect }) => {
  const categories = [
    'Beadwork Jewellery',
    'Stone Jewellery',
    'Brass Jewellery',
    'Gold Jewellery',
    'Silver Jewellery',
  ];

  return (
    <div className={`shop-dropdown ${visible ? "show" : ""}`}>
      {categories.map((cat) => (
        <p key={cat} onClick={() => onSelect(cat)}>{cat}</p>
      ))}
    </div>
  );
};

export default JewelleryDropdown;