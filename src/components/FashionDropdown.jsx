import React from "react";
import '../styles/fashion-dropdown.css'

const FashionDropdown = ({ visible, onSelect }) => {
  return (
    <div className={`fashion-dropdown ${visible ? "show" : ""}`}>
      <p onClick={() => onSelect("Clothing")}>Clothing</p>
      <p onClick={() => onSelect("Textiles")}>Textiles</p>
      <p onClick={() => onSelect("Shoes")}>Shoes</p>
      <p onClick={() => onSelect("Adornments")}>Adornments</p>
    </div>
  );
};

export default FashionDropdown;