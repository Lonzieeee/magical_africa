import React from "react";
import '../styles/artefacts-dropdown.css'

const ArtefactsDropdown = ({ visible, onSelect }) => {
  const artefactTypes = [
    "Oil Paintings",
    "Pencil Portraits",
    "Coloured Pencils"
  ];

  return (
    <div className={`artefacts-dropdown ${visible ? "show" : ""}`}>
      {artefactTypes.map((item) => (
        <p key={item} onClick={() => onSelect(item)}>
          {item}
        </p>
      ))}
    </div>
  );
};

export default ArtefactsDropdown;