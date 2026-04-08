




import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../styles/marketplace.css';

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const { t } = useTranslation();

  const marketplaceData = [
    {
      name: t('marketplace.categories.jewelery'),
      sections: [
        { image: '/images/maasai-bracelets2.jpg', title: t('marketplace.items.maasaiBracelets.title'), description: t('marketplace.items.maasaiBracelets.description'), price: '$15' },
        { image: '/images/beaded-jewelery2.jpg', title: t('marketplace.items.beadedJewelery.title'), description: t('marketplace.items.beadedJewelery.description'), price: '$75' },
        { image: '/images/maasai-necklaces2.jpg', title: t('marketplace.items.maasaiNecklaces.title'), description: t('marketplace.items.maasaiNecklaces.description'), price: '$65' }
      ]
    },
    {
      name: t('marketplace.categories.garments'),
      sections: [
        { image: '/images/nigeria-wear2.jpg', title: t('marketplace.items.ankaraGown.title'), description: t('marketplace.items.ankaraGown.description'), price: '$200' },
        { image: '/images/maasai-wear2.jpg', title: t('marketplace.items.maasaiLeso.title'), description: t('marketplace.items.maasaiLeso.description'), price: '$120' },
        { image: '/images/kitenge-latest.jpg', title: t('marketplace.items.kitenge.title'), description: t('marketplace.items.kitenge.description'), price: '$100' }
      ]
    },
    {
      name: t('marketplace.categories.toolsArtefacts'),
      sections: [
        { image: '/images/hammer2.jpg', title: t('marketplace.items.carpentryTools.title'), description: t('marketplace.items.carpentryTools.description'), price: '$300' },
        { image: '/images/shoka2.png', title: t('marketplace.items.farmingTools.title'), description: t('marketplace.items.farmingTools.description'), price: '$150' },
        { image: '/images/spear2.jpg', title: t('marketplace.items.traditionalSpears.title'), description: t('marketplace.items.traditionalSpears.description'), price: '$80' }
      ]
    },
    {
      name: t('marketplace.categories.musicalInstruments'),
      sections: [
        { image: '/images/drums-latest.jpg', title: t('marketplace.items.drums.title'), description: t('marketplace.items.drums.description'), price: '$400' },
        { image: '/images/string-instrument2.jpg', title: t('marketplace.items.stringInstruments.title'), description: t('marketplace.items.stringInstruments.description'), price: '$200' },
        { image: '/images/wind-instrument2.jpg', title: t('marketplace.items.windInstruments.title'), description: t('marketplace.items.windInstruments.description'), price: '$150' }
      ]
    }
  ];

  const currentData = marketplaceData[activeCategory];

    const navigate = useNavigate(); // 👈 1. create navigate
  
    // 👈 2. define the handler
    const handleNavigation = (path) => {
      navigate(path);
    };
  

  return (
    <section className="marketplace">
      <h1>{t('marketplace.title')}</h1>

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
              <span>{t('marketplace.price')}: {item.price}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="show-all2">
        <button className="show-btn2" onClick={()=> handleNavigation('/market')}>{t('hero.visitAntiques')}</button>
      </div>
    </section>
  );
};

export default Marketplace;




