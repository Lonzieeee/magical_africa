import React from "react";
import '../styles/furniture-dropdown.css'

const FurnitureDropdown = ({ visible }) => {
  return (
    <div className={`furniture-dropdown ${visible ? "show" : ""}`}>
      <p>Chairs & Stools</p>
      <p>Tables & Stands</p>
      <p>Beds & Headboards</p>
      <p>Storage & Shelving</p>
      <p>Decorative Pieces</p>
    </div>
  );
};

export default FurnitureDropdown;