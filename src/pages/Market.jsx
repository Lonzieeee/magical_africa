


import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar';
import PageSeo from '../components/PageSeo'
import { useTranslation } from 'react-i18next';
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../context/AuthContext'
import '../styles/market.css'
import '../styles/auctions.css'
import '../styles/shop.css'
import Jewelery from '../components/Jewelery';
import Carvings from '../components/Carvings';
import Pottery from '../components/Pottery';
import Footer from '../components/Footer';
import '../styles/artisans.css'
import '../styles/best-sellers.css'
import JewelleryDropdown from '../components/JewelleryDropdown';
import SculptureDropdown from '../components/SculptureDropdown';
import ArtefactsDropdown from '../components/ArtefactsDropdown';
import FashionDropdown from '../components/FashionDropdown';
import FurnitureDropdown from '../components/FurnitureDropdown';
import Artefacts from '../components/Artefacts';
import Fashion from '../components/Fashion';
import { SEO_CONTENT } from '../utils/seoContent'


const Market = () => {
  const { t } = useTranslation();
  const [communityBestSellers, setCommunityBestSellers] = useState([])

  const marketHeroImages = [
    '/images/side-view-people-garage-sale2.jpg',
    '/images/african-jewelery.jpg',
    '/images/african-atire.jpg',
    '/images/african-spices.jpg',
    '/images/carvings-image.jpg',
    '/images/african-painting2.jpg'
  ];

  const marketHeroLabels = [
    '',
    t('market.hero.labels.jewellery'),
    t('market.hero.labels.textiles'),
    t('market.hero.labels.spices'),
    t('market.hero.labels.carvings'),
    t('market.hero.labels.artefacts'),
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % marketHeroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

useEffect(() => {
  marketHeroImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}, []);

  const [activeCategory, setActiveCategory] = useState('jewellery');
  const auctionRef = useRef(null);

  useEffect(() => {
    const marketProductsRef = collection(db, 'marketProducts')
    const unsubscribe = onSnapshot(marketProductsRef, (snapshot) => {
      const products = snapshot.docs
        .map((productDoc) => ({ id: productDoc.id, ...productDoc.data() }))
        .filter((product) => product.showOnWebsite && product.active)
        .sort((a, b) => {
          const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime()
          const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime()
          return bTime - aTime
        })
        .slice(0, 4)

      setCommunityBestSellers(products)
    }, (error) => {
      console.error('Failed to load marketplace products:', error)
      setCommunityBestSellers([])
    })

    return unsubscribe
  }, [])

  const fallbackBestSellers = [
    {
      id: 'default-1',
      imageUrl: '/images/pottery2-image2.png',
      name: t('market.bestSellers.item1.name'),
      price: 45,
      tribe: 'Maasai',
    },
    {
      id: 'default-2',
      imageUrl: '/images/pottery3-image3.png',
      name: t('market.bestSellers.item2.name'),
      price: 76,
      tribe: 'Kikuyu'
    },
    {
      id: 'default-3',
      imageUrl: '/images/pottery4-image5.png',
      name: t('market.bestSellers.item3.name'),
      price: 25,
      tribe: 'kamba'
    },
    {
      id: 'default-4',
      imageUrl: '/images/pottery5-image6.png',
      name: t('market.bestSellers.item4.name'),
      price: 30,
      tribe: 'Igbo'
    }
  ]

  const bestSellerItems = communityBestSellers.length ? communityBestSellers : fallbackBestSellers

  const formatMarketPrice = (value) => {
    const amount = Number(value || 0)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(Number.isFinite(amount) ? amount : 0)
  }

  useEffect(() => {
    const boxes = document.querySelectorAll('.Auction-box1');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          boxes.forEach((box, index) => {
            const reverseIndex = boxes.length - 1 - index;
            setTimeout(() => {
              box.classList.add('auction-img-visible');
            }, reverseIndex * 300);
          });
        } else {
          boxes.forEach((box) => {
            box.classList.remove('auction-img-visible');
          });
        }
      });
    }, { threshold: 0.2 });

    if (auctionRef.current) {
      observer.observe(auctionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const [showJewelleryDropdown, setShowJewelleryDropdown] = useState(false);

  const [showSculptureDropdown, setShowSculptureDropdown] = useState(false);

  const [showArtefactsDropdown, setShowArtefactsDropdown] = useState(false);

  const [showFashionDropdown, setShowFashionDropdown] = useState(false);

  const [showFurnitureDropdown, setShowFurnitureDropdown] = useState(false);

  const [jewellerySubCategory, setJewellerySubCategory] = useState('Beadwork Jewellery');

  const [sculptureSubCategory, setSculptureSubCategory] = useState('Wood Sculpture');

const [artefactSubCategory, setArtefactSubCategory] = useState('Oil Paintings');

const [fashionCategory, setFashionCategory] = useState("Clothing");

  return (
    <>
      <PageSeo {...SEO_CONTENT.market} />

      <div className='market-hero' style={{ backgroundImage: `url(${marketHeroImages[currentSlide]})` }}>
        <Navbar />
        <div className='market-hero-content'>
          <div className='market-heading'>
            <hr />
            <h3>{t('market.hero.tagline')}</h3>
          </div>

          <h1>{t('market.hero.titleStart')} <span>{t('market.hero.titleAccent')}</span> {t('market.hero.titleEnd')}</h1>

          <p>{t('market.hero.description')}</p>

          <div className='market-hero-population'>
            <span>
              <h3>1200+</h3>
              <p>{t('market.hero.stats.artisans')}</p>
            </span>
            <span>
              <h3>4800+</h3>
              <p>{t('market.hero.stats.products')}</p>
            </span>
            <span>
              <h3>54</h3>
              <p>{t('market.hero.stats.countries')}</p>
            </span>
          </div>
        </div>

        <div className='market-hero-content2'>
          <h2>{marketHeroLabels[currentSlide]}</h2>
        </div>
      </div>


      {/* Best Sellers
      <div className='best-sellers-div'>
        <h1>{t('market.bestSellers.title')}</h1>
        <p>{t('market.bestSellers.subtitle')}</p>

        <div className='best-seller-wrapper'>
          {bestSellerItems.map((item, index) => (
            <div key={item.id || index} className={`best-seller1 sel${(index % 4) + 1}`}>
              <img src={item.imageUrl || '/images/pottery2-image2.png'} alt={item.name || 'Marketplace product'} />
              <div className='best-seller1-content'>
                <p>{item.name || 'Untitled Product'}</p>
                 <span className="tribe-text">
    Tribe: {item.tribe || 'Unknown'}
  </span>
                <button>{t('market.bestSellers.addToCart')}</button>
              </div>
              <div className='seller-price'>
                <p>{t('market.bestSellers.price')} : {formatMarketPrice(item.price)}</p>
              </div>
            </div>
          ))}

        </div>
      </div>

       */}


       {/* Best Sellers */}
<div className='best-sellers-div'>
  <h1>{t('market.bestSellers.title')}</h1>
  <p>{t('market.bestSellers.subtitle')}</p>

  <div className='best-seller-wrapper'>
    {bestSellerItems.map((item, index) => (
      <div key={item.id || index} className={`best-seller1 sel${(index % 4) + 1}`}>

        {/* Image area */}
        <div className='best-seller-image-area'>
          <span className='best-seller-badge'>Handcrafted</span>
          <button className='best-seller-wishlist' aria-label="Add to wishlist">
           
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M7 12S1.5 8 1.5 4.5a2.8 2.8 0 015.5-.7 2.8 2.8 0 015.5.7C12.5 8 7 12 7 12z"
                stroke="#888" strokeWidth="1.2" fill="none"/>
            </svg>
          </button>
          <img src={item.imageUrl || '/images/pottery2-image2.png'} alt={item.name || 'Marketplace product'} />
        </div>

        {/* Content area */}
        <div className='best-seller1-content'>

          {/* Tribe pill + stars */}
          <div className='best-seller-meta'>
            <span className='tribe-pill'>{item.tribe || 'Unknown'}</span>
          {/* 
            <div className='best-seller-stars'>
              {[1,2,3,4].map(i => (
                
                <svg key={i} width="11" height="11" viewBox="0 0 10 10">
                  <path d="M5 1l1.1 2.2L9 3.6 7 5.5l.5 2.7L5 6.9 2.5 8.2 3 5.5 1 3.6l2.9-.4z" fill="#EF9F27"/>
                </svg>
              ))}
              <svg width="11" height="11" viewBox="0 0 10 10">
                <path d="M5 1l1.1 2.2L9 3.6 7 5.5l.5 2.7L5 6.9 2.5 8.2 3 5.5 1 3.6l2.9-.4z" fill="#ccc"/>
              </svg>
            </div>
          */}
          </div>

          {/* Name */}
          <p className='best-seller-name'>{item.name || 'Untitled Product'}</p>

          {/* Short description */}
          <p className='best-seller-desc'>Hand-crafted by skilled artisans using traditional techniques passed down through generations.</p>

          {/* Divider */}
          <div className='best-seller-divider'></div>

          {/* Price + Add to Cart */}
          <div className='best-seller-footer'>
            <div className='best-seller-price-block'>
              <span className='best-seller-price-label'>{t('market.bestSellers.price')}</span>
              <span className='best-seller-price-value'>{formatMarketPrice(item.price)}</span>
            </div>
            <button className='best-seller-btn'>{t('market.bestSellers.addToCart')}</button>
          </div>

        </div>
      </div>
    ))}
  </div>
</div>


      {/* Shop Collection */}
      <div className='Shop-div'>
        <h1>{t('market.shop.title')}</h1>
        <p className='collection-description'>{t('market.shop.subtitle')}</p>

        <div className='collection-div'>

  {/* 
          <button
            className={activeCategory === 'jewellery' ? 'active' : ''}
            onClick={() => setActiveCategory('jewellery')}
          >{t('market.shop.categories.jewellery')}</button>
  */}


    <div
  className="dropdown-wrapper"
  onMouseEnter={() => setShowJewelleryDropdown(true)}
  onMouseLeave={() => setShowJewelleryDropdown(false)}
>
  <button
    className={activeCategory === 'jewellery' ? 'active' : ''}
    onClick={() => setActiveCategory('jewellery')}
  >
    {t('market.shop.categories.jewellery')}
  </button>

  <JewelleryDropdown
    visible={showJewelleryDropdown}
    onSelect={(cat) => {
      setJewellerySubCategory(cat);
      setActiveCategory('jewellery');
      setShowJewelleryDropdown(false);
    }}
  />
</div>




{/* 
          <button
            className={activeCategory === 'carvings' ? 'active' : ''}
            onClick={() => setActiveCategory('carvings')}
          >{t('market.shop.categories.carvings')}</button>
*/}


     <div
  className="dropdown-wrapper"
  onMouseEnter={() => setShowSculptureDropdown(true)}
  onMouseLeave={() => setShowSculptureDropdown(false)}
>
  <button
    className={activeCategory === 'carvings' ? 'active' : ''}
    onClick={() => setActiveCategory('carvings')}
  >
   {t('market.shop.categories.carvings')}
  </button>

 <SculptureDropdown
  visible={showSculptureDropdown}
  onSelect={(cat) => {
    setSculptureSubCategory(cat);
    setActiveCategory('carvings');
    setShowSculptureDropdown(false);
  }}
/>
</div>     

{/* 
          <button
            className={activeCategory === 'pottery' ? 'active' : ''}
            onClick={() => setActiveCategory('pottery')}
          >{t('market.shop.categories.pottery')}</button>
         

          <button
            className={activeCategory === 'artefacts' ? 'active' : ''}
            onClick={() => setActiveCategory('artefacts')}
          >{t('market.shop.categories.artefacts')}</button>
 */}


 <div
  className="dropdown-wrapper"
  onMouseEnter={() => setShowArtefactsDropdown(true)}
  onMouseLeave={() => setShowArtefactsDropdown(false)}
>
  <button
    className={activeCategory === 'artefacts' ? 'active' : ''}
    onClick={() => setActiveCategory('artefacts')}
  >
    {t('market.shop.categories.artefacts')}
  </button>

  <ArtefactsDropdown
  visible={showArtefactsDropdown}
 onSelect={(cat) => {
  setArtefactSubCategory(cat);
  setActiveCategory('artefacts');
  setShowArtefactsDropdown(false);
}}
/>
</div>

{/* 
  <button
    className={activeCategory === 'fashion' ? 'active' : ''}
    onClick={() => setActiveCategory('fashion')}
    >{t('market.shop.categories.fashion')}</button>

  */}

  <div
  className="dropdown-wrapper"
  onMouseEnter={() => setShowFashionDropdown(true)}
  onMouseLeave={() => setShowFashionDropdown(false)}
>
  <button
    className={activeCategory === 'fashion' ? 'active' : ''}
    onClick={() => setActiveCategory('fashion')}
  >
    {t('market.shop.categories.fashion')}
  </button>

 <FashionDropdown
   visible={showFashionDropdown}
   onSelect={(item) => {
      setFashionCategory(item)
      setShowFashionDropdown(false)
   }}
/>
</div>  

{/*
    <button
    className={activeCategory === 'baskets' ? 'active' : ''}
      onClick={() => setActiveCategory('baskets')}
    >{t('market.shop.categories.baskets')}</button>
 */}


    <div
  className="dropdown-wrapper"
  onMouseEnter={() => setShowFurnitureDropdown(true)}
  onMouseLeave={() => setShowFurnitureDropdown(false)}
>
  <button
    className={activeCategory === 'baskets' ? 'active' : ''}
    onClick={() => setActiveCategory('baskets')}
  >
    {t('market.shop.categories.baskets')}
  </button>

  <FurnitureDropdown visible={showFurnitureDropdown} />
</div>

          <button
            className={activeCategory === 'spices' ? 'active' : ''}
            onClick={() => setActiveCategory('spices')}
          >{t('market.shop.categories.spices')}</button>
        </div>

       {activeCategory === 'jewellery' && <Jewelery subCategory={jewellerySubCategory} />}
       {activeCategory === 'carvings' && <Carvings subCategory={sculptureSubCategory} />}
        {activeCategory === 'pottery' && <Pottery />}
       {activeCategory === 'artefacts' && <Artefacts subCategory={artefactSubCategory} />} 
       {activeCategory === 'fashion' && <Fashion subCategory={fashionCategory} />}
      </div>


      {/* Auctions */}
      <div className='Auctions-div' ref={auctionRef}>
        <div className='auctions-div1'>
          <hr />
          <h3>{t('market.auctions.tagline')}</h3>
        </div>

        <h1>{t('market.auctions.title')}</h1>
        <p>{t('market.auctions.subtitle')}</p>

        <div className='Auction-boxes'>

          <div className='Auction-box1'>
            <div className='Auction-box1-a'></div>
            <div className='Auction-box1-b'>
              <h3>{t('market.auctions.item1.category')}</h3>
              <h2>{t('market.auctions.item1.name')}</h2>
              <p className='auction-p'>{t('market.auctions.item1.description')}</p>
              <div className='Auction-box1-price'>
                <span>
                  <p>{t('market.auctions.currentBid')}</p>
                  <h4 style={{ color: "rgb(48, 48, 48)" }}>$4,200</h4>
                </span>
                <p className='time-left'>{t('market.auctions.item1.timeLeft')}</p>
                <button>{t('market.auctions.placeBid')}</button>
              </div>
            </div>
          </div>

          <div className='Auction-box1'>
            <div className='Auction-box2-a'></div>
            <div className='Auction-box1-b'>
              <h3>{t('market.auctions.item2.category')}</h3>
              <h2>{t('market.auctions.item2.name')}</h2>
              <p className='auction-p'>{t('market.auctions.item2.description')}</p>
              <div className='Auction-box1-price'>
                <span>
                  <p>{t('market.auctions.currentBid')}</p>
                  <h4 style={{ color: "rgb(48, 48, 48)" }}>$2,200</h4>
                </span>
                <button>{t('market.auctions.placeBid')}</button>
              </div>
            </div>
          </div>

          <div className='Auction-box1'>
            <div className='Auction-box3-a'></div>
            <div className='Auction-box1-b'>
              <h3>{t('market.auctions.item3.category')}</h3>
              <h2>{t('market.auctions.item3.name')}</h2>
              <p className='auction-p'>{t('market.auctions.item3.description')}</p>
              <div className='Auction-box1-price'>
                <span>
                  <p>{t('market.auctions.currentBid')}</p>
                  <h4 style={{ color: "rgb(48, 48, 48)" }}>$3,500</h4>
                </span>
                <button>{t('market.auctions.placeBid')}</button>
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* Artisans */}
      <div className='artisans-div'>
        <div className='makers-heading'>
          <hr />
          <h3>{t('market.artisans.tagline')}</h3>
        </div>

        <h1 className='artisans-title'>{t('market.artisans.title')}</h1>
        <p className='artisans-subtitle'>{t('market.artisans.subtitle')}</p>

        <div className='artisans'>
          <div className='artisans-wrapper'>

            <div className='artisan1'>
              <span></span>
              <h3>Nashai Ole</h3>
              <h4>{t('market.artisans.artisan1.craft')}</h4>
              <p>📍 {t('market.artisans.artisan1.location')}</p>
              <p>{t('market.artisans.artisan1.items')}</p>
              <button>{t('market.artisans.follow')}</button>
            </div>

            <div className='artisan2'>
              <span></span>
              <h3>Juma Mwalimu</h3>
              <h4>{t('market.artisans.artisan2.craft')}</h4>
              <p>📍 {t('market.artisans.artisan2.location')}</p>
              <p>{t('market.artisans.artisan2.items')}</p>
              <button>{t('market.artisans.follow')}</button>
            </div>

            <div className='artisan3'>
              <span></span>
              <h3>Abena Asante</h3>
              <h4>{t('market.artisans.artisan3.craft')}</h4>
              <p>📍 {t('market.artisans.artisan3.location')}</p>
              <p>{t('market.artisans.artisan3.items')}</p>
              <button>{t('market.artisans.follow')}</button>
            </div>

          </div>
        </div>
      </div>


      {/* Newsletter */}
      <div className='market-conclusion'>
        <h1>{t('market.newsletter.title')}</h1>
        <p>{t('market.newsletter.subtitle')}</p>

        <div className='market-conclusion-buttons'>
          <input type="text" placeholder={t('market.newsletter.placeholder')} />
          <button>{t('market.newsletter.button')}</button>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Market