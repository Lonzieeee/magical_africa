import { useState, useRef, useEffect } from 'react';
import '../styles/search-section.css';
import '../styles/add-map.css';

const regionData = {
  north: {
    name: "North Africa",
    communities: ["Berber", "Tuareg", "Nubians", "Copts", "Arabs"]
  },
  west: {
    name: "West Africa",
    communities: ["Yoruba", "Hausa", "Igbo", "Fulani", "Ashanti", "Wolof", "Mandinka"]
  },
  central: {
    name: "Central Africa",
    communities: ["Kongo", "Luba", "Mongo", "Fang", "Bamileke", "Pygmy"]
  },
  east: {
    name: "East Africa",
    communities: ["Maasai", "Kikuyu", "Swahili", "Amhara", "Oromo", "Somali"]
  },
  southern: {
    name: "Southern Africa",
    communities: ["Zulu", "Xhosa", "San", "Shona", "Tswana", "Sotho", "Ndebele"]
  }
};

const SearchSection = () => {
  const [showMap, setShowMap] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const mapWrapperRef = useRef(null);

  const handleRegionMouseEnter = (regionKey) => {
    const data = regionData[regionKey];
    if (data) {
      setTooltipData(data);
    }
  };

  const handleRegionMouseMove = (e) => {
    if (mapWrapperRef.current && tooltipData) {
      const rect = mapWrapperRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left + 15;
      let y = e.clientY - rect.top + 15;

      // Get tooltip dimensions
      const tooltip = document.getElementById('tooltip');
      if (tooltip) {
        // Prevent tooltip from going off screen
        if (x + tooltip.offsetWidth > rect.width) {
          x = e.clientX - rect.left - tooltip.offsetWidth - 15;
        }
        if (y + tooltip.offsetHeight > rect.height) {
          y = e.clientY - rect.top - tooltip.offsetHeight - 15;
        }
      }

      setTooltipPosition({ x, y });
    }
  };

  const handleRegionMouseLeave = () => {
    setTooltipData(null);
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="search-section">
      <h1>Find Your Tribe</h1>

      <div className="search-box">
        <input type="text" placeholder="Search tribes" id="search-tribe" />

        <select name="regions" id="regions">
          <option value="All Regions">All Regions</option>
          <option value="North Africa">North Africa</option>
          <option value="East Africa">East Africa</option>
          <option value="West Africa">West Africa</option>
          <option value="Southern Africa">Southern Africa</option>
        </select>

        <select name="Languages" id="all-languages">
          <option value="All-languages">All Languages</option>
          <option value="Gusii">Gusii</option>
          <option value="Yoruba">Yoruba</option>
          <option value="Maa">Maa</option>
          <option value="Gikuyu">Gikuyu</option>
          <option value="Kamba">Kamba</option>
        </select>

        <div className="two-buttons">
          <div className="two-buttons-text">
            <p>
              <span className="no-tribes">6</span> communities found
            </p>
          </div>

          <div className='green-buttons'>
            <button className="hide" onClick={toggleMap}>
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
            <button>Add Your Community</button>
          </div>
        </div>
      </div>

      {showMap && (
        <div className="add-map">
          <div className="map-wrapper" ref={mapWrapperRef}>
            <div className="africa-map">
              <svg viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg">
                {/* North Africa */}
                <path
                  className="region"
                  data-region="north"
                  d="M195,135 L220,120 L250,115 L270,120 L320,110 L380,115 L400,110 L415,120 L420,140 L480,125 L540,135 L590,140 L620,160 L630,200 L620,250 L590,280 L550,290 L520,280 L460,290 L420,270 L420,220 L380,250 L320,260 L280,240 L270,200 L270,155 L250,170 L220,175 L195,170 L180,155 L180,145 Z"
                  onMouseEnter={() => handleRegionMouseEnter('north')}
                  onMouseMove={handleRegionMouseMove}
                  onMouseLeave={handleRegionMouseLeave}
                />

                {/* West Africa */}
                <path
                  className="region"
                  data-region="west"
                  d="M140,280 L180,275 L220,260 L260,250 L280,240 L320,260 L330,310 L380,250 L420,270 L440,310 L430,360 L380,380 L420,400 L440,450 L420,490 L370,500 L320,480 L300,440 L290,480 L260,490 L245,460 L220,470 L200,450 L180,475 L160,460 L165,435 L145,420 L155,390 L170,390 L200,400 L220,380 L200,330 L160,340 L135,300 L140,280 Z"
                  onMouseEnter={() => handleRegionMouseEnter('west')}
                  onMouseMove={handleRegionMouseMove}
                  onMouseLeave={handleRegionMouseLeave}
                />

                {/* Central Africa */}
                <path
                  className="region"
                  data-region="central"
                  d="M330,370 L380,380 L420,420 L460,440 L510,430 L530,460 L510,500 L540,520 L560,580 L540,650 L480,680 L420,660 L400,620 L390,580 L375,595 L355,580 L345,580 L330,555 L335,525 L355,505 L350,470 L360,510 L390,530 L430,510 L440,460 L420,420 L370,440 L330,370 Z"
                  onMouseEnter={() => handleRegionMouseEnter('central')}
                  onMouseMove={handleRegionMouseMove}
                  onMouseLeave={handleRegionMouseLeave}
                />

                {/* East Africa */}
                <path
                  className="region"
                  data-region="east"
                  d="M510,430 L530,380 L520,320 L520,280 L590,280 L600,320 L590,340 L630,350 L640,390 L660,395 L700,400 L730,450 L720,550 L670,600 L640,560 L650,500 L660,460 L660,420 L620,510 L590,620 L620,650 L600,720 L540,730 L500,690 L510,640 L525,610 L510,580 L525,585 L535,575 L530,555 L510,560 L530,520 L560,580 L560,540 L570,500 L580,450 L550,420 L510,430 Z"
                  onMouseEnter={() => handleRegionMouseEnter('east')}
                  onMouseMove={handleRegionMouseMove}
                  onMouseLeave={handleRegionMouseLeave}
                />

                {/* Southern Africa */}
                <path
                  className="region"
                  data-region="southern"
                  d="M300,650 L340,580 L400,620 L420,660 L480,680 L540,690 L580,700 L590,780 L560,850 L520,870 L500,830 L450,1000 L380,1010 L310,990 L280,940 L260,840 L270,780 L300,720 L340,760 L360,820 L340,880 L360,890 L420,880 L450,830 L430,780 L490,770 L510,720 L470,720 L520,710 L530,660 L545,720 L525,730 L515,700 L540,650 L480,680 L420,660 L400,700 L400,750 L340,760 L300,720 L300,650 Z"
                  onMouseEnter={() => handleRegionMouseEnter('southern')}
                  onMouseMove={handleRegionMouseMove}
                  onMouseLeave={handleRegionMouseLeave}
                />
              </svg>
            </div>

            {/* Tooltip */}
            {tooltipData && (
              <div
                className="tooltip show"
                id="tooltip"
                style={{
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y}px`
                }}
              >
                <h3 id="tooltipTitle">{tooltipData.name}</h3>
                <p className="communities-label">Communities:</p>
                <div className="communities-list" id="tooltipCommunities">
                  {tooltipData.communities.map((community, index) => (
                    <span key={index} className="community-tag">
                      {community}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSection;