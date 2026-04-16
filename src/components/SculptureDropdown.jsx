import React from "react";
import '../styles/sculpture-dropdown.css'

const SculptureDropdown = ({ visible, onSelect }) => {
  return (
    <div className={`sculpture-dropdown ${visible ? "show" : ""}`}>
      <p onClick={() => onSelect('Wood Sculpture')}>Wood Sculpture</p>
      <p onClick={() => onSelect('Stone Sculpture')}>Stone Sculpture</p>
      <p onClick={() => onSelect('Metallic Sculpture')}>Metallic Sculpture</p>
    </div>
  );
};

export default SculptureDropdown;