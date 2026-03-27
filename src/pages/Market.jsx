{/* 

import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar';
import { Helmet } from 'react-helmet-async';
import '../styles/market.css'
import '../styles/auctions.css'
import '../styles/shop.css'
import Jewelery from '../components/Jewelery';
import Carvings from '../components/Carvings';
import Pottery from '../components/Pottery';
import Footer from '../components/Footer';
import '../styles/artisans.css'
import '../styles/best-sellers.css'


const Market = () => {

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
  'Jewellery',
  'Textiles',
  'Spices & Food',
  'Carvings',
  'Artefacts'
];

const [currentSlide, setCurrentSlide] = useState(0);

   
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % marketHeroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);



  const [activeCategory, setActiveCategory] = useState('jewellery');
  const auctionRef = useRef(null);

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





<Helmet>
  <title>Marketplace - Magical Africa</title>
  <meta name="description" content="Shop authentic African products from artisans and creators across the continent. Discover handcrafted goods, traditional crafts, clothing, jewelry and more." />
  <meta name="keywords" content="African marketplace, buy African products, authentic African crafts, African artisans, handmade African goods, African jewelry, African clothing" />
  <meta property="og:title" content="African Marketplace — Buy Authentic African Products" />
  <meta property="og:description" content="Shop authentic handcrafted African products from artisans and creators across the continent." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://magical.africa/market" />
</Helmet>


  return (
    <>
    
    <div className='market-hero'  style={{ backgroundImage: `url(${marketHeroImages[currentSlide]})` }}>
       <Navbar />
       <div className='market-hero-content'>
       <div className='market-heading'>
        <hr />
        <h3>African Marketplace</h3>
       </div>

       <h1>Discover <span>Authentic </span>African Treasures</h1>

       <p>From rare artefacts up for auction to handcrafted goods by local artisans — own a piece of the continent's living culture.</p>

       <div className='market-hero-population'>
        <span>
          <h3>1200+</h3>
          <p>Artisans</p>
        </span>
        <span>
          <h3>4800+</h3>
          <p>Products</p>
        </span>
        <span>
          <h3>54</h3>
          <p>Countries</p>
        </span>
       </div>
       </div>


       <div className='market-hero-content2'>

       <h2>{marketHeroLabels[currentSlide]}</h2>

       </div>
    </div>



    <div className='best-sellers-div'>
    
    <h1>Best Seller Items</h1>

    <p>Handpicked favourites from across the continent</p>

    <div className='best-seller-wrapper'>


      <div className='best-seller1 sel1'>
      
      <img src="/images/pottery2-image2.png" alt="" />

      <div className='best-seller1-content'>

        <p>Golden Mask</p>
            <button>
              Add to Cart
            </button>

      </div>

      <div className='seller-price'>

        <p>Price : $45</p>

      </div>

      </div>

      <div className='best-seller1 sel2'>
        <img src="/images/pottery3-image3.png" alt="" />
        <div className='best-seller1-content'>

       <p>Vace</p>
            <button>
              Add to Cart
            </button>

      </div>

       <div className='seller-price'>

        <p>Price : $76</p>

      </div>


      </div>

      <div className='best-seller1 sel3'>

        <img src="/images/pottery4-image5.png" alt="" />
        <div className='best-seller1-content'>

           <p>Mug</p>
            <button>
              Add to Cart
            </button>

      </div>

       <div className='seller-price'>

        <p>Price : $25</p>

      </div>

        
      </div>

      <div className='best-seller1 sel4'>

        <img src="/images/pottery5-image6.png" alt="" />
        <div className='best-seller1-content'>

          <p>Bowl</p>
            <button>
              Add to Cart
            </button>

      </div>

       <div className='seller-price'>

        <p>Price : $30</p>

      </div>


      </div>

    </div>




    </div>

    

    <div className='Shop-div'>

  <h1>
   Shop The Collection
  </h1>

  <p className='collection-description'>

    Authentic goods made by local artisans across the continent
  </p>
    

    <div className='collection-div'>
  <button 
    className={activeCategory === 'jewellery' ? 'active' : ''}
    onClick={() => setActiveCategory('jewellery')}
  >Jewellery</button>
  <button
    className={activeCategory === 'carvings' ? 'active' : ''}
    onClick={() => setActiveCategory('carvings')}
  >Carvings</button>

  <button
    className={activeCategory === 'pottery' ? 'active' : ''}
    onClick={() => setActiveCategory('pottery')}
  >Pottery</button>
  <button
    className={activeCategory === 'textiles' ? 'active' : ''}
    onClick={() => setActiveCategory('textiles')}
  >Textiles</button>
  
  <button
    className={activeCategory === 'baskets' ? 'active' : ''}
    onClick={() => setActiveCategory('baskets')}
  >Baskets</button>
  <button
    className={activeCategory === 'spices' ? 'active' : ''}
    onClick={() => setActiveCategory('spices')}
  >Spice and Food</button>
</div>


{activeCategory === 'jewellery' && <Jewelery />}
{activeCategory === 'carvings' && <Carvings />}
{activeCategory === 'pottery' && <Pottery />}

    </div>





    <div className='Auctions-div' ref={auctionRef}>

       <div className='auctions-div1'>
         <hr />
         <h3>Going Once, Going Twice</h3>
       </div>

       <h1>Live Auctions</h1>
       <p>Bid on rare African art, jewellery, and cultural artefacts</p>

       <div className='Auction-boxes'>

        <div className='Auction-box1'>
          <div className='Auction-box1-a'></div>
          <div className='Auction-box1-b'>
            <h3>Artefact . West Africa</h3>
            <h2>19th Century Benin Bronze Warrior Plaque</h2>
            <p className='auction-p'>An exceptionally rare cast bronze relief plaque from the Kingdom of Benin, depicting a royal warrior in ceremonial dress. Provenance verified.</p>
            <div className='Auction-box1-price'>
              <span>
                <p>Current Bid</p>
                <h4 style={{color: "rgb(48, 48, 48)" }}>$4,200</h4>
              </span>
              <p className='time-left'>2h 14m left</p>
              <button>Place Bid</button>
            </div>
          </div>
        </div>

        <div className='Auction-box1'>
          <div className='Auction-box2-a'></div>
          <div className='Auction-box1-b'>
            <h3>Mask · Central Africa</h3>
            <h2>Kuba Kingdom Ceremonial Mask</h2>
            <p className='auction-p'>Handcarved and painted ritual mask from the Democratic Republic of Congo.</p>
            <div className='Auction-box1-price'>
              <span>
                <p>Current Bid</p>
                 <h4 style={{color: "rgb(48, 48, 48)" }}>$2,200</h4>
              </span>
              <button>Place Bid</button>
            </div>
          </div>
        </div>

        <div className='Auction-box1'>
          <div className='Auction-box3-a'></div>
          <div className='Auction-box1-b'>
            <h3>Instrument · East Africa</h3>
            <h2>Antique Swahili Taarab Oud</h2>
            <p className='auction-p'>19th century hand-crafted oud from the Swahili coast, with intricate inlay work.</p>
            <div className='Auction-box1-price'>
              <span>
                <p>Current Bid</p>
                 <h4 style={{color: "rgb(48, 48, 48)" }}>$3,500</h4>
              </span>
              <button>Place Bid</button>
            </div>
          </div>
        </div>

       </div>
    </div>








    <div className='artisans-div'>

      <div className='makers-heading'>

        <hr />
        <h3>Meet the Makers</h3>

      </div>

      <h1 className='artisans-title'>Featured Artisans</h1>

      <p className='artisans-subtitle'>Real people, real craft — every purchase supports a local artisan directly</p>


      <div className='artisans'>

        <div className='artisans-wrapper'>

          <div className='artisan1'>

            <span></span>
            <h3>Nashai Ole</h3>
             <h4>Beadwork and Jewelery</h4>
             <p>📍 Rift Valley, Kenya</p>
             <p>42 items listed</p>
             <button>Follow Artisan</button>
             
            

          </div>

          <div className='artisan2'>

             <span></span>
            <h3>Juma Mwalimu</h3>
             <h4>Wood Sculpture</h4>
             <p>📍 Dar es Salaam, Tanzania</p>
             <p>28 items listed</p>
             <button>Follow Artisan</button>

          </div>

          <div className='artisan3'>

             <span></span>
            <h3>Abena Asante</h3>
             <h4>Weaving and Baskets</h4>
             <p>📍 Bolgatanga, Ghana</p>
             <p>32 items listed</p>
             <button>Follow Artisan</button>

          </div>

        </div>

      </div>



    </div>


    <div className='market-conclusion'>

      <h1>Never Miss a Drop</h1>
      <p>Get notified when new artisans list items and when live actions go live</p>

      <div className='market-conclusion-buttons'>

        <input type="text" placeholder='Enter your email address' />
        <button>Notify Me</button>

      </div>

    </div>

    <Footer />
    </>
  )
}

export default Market
*/}


import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import '../styles/market.css'
import '../styles/auctions.css'
import '../styles/shop.css'
import Jewelery from '../components/Jewelery';
import Carvings from '../components/Carvings';
import Pottery from '../components/Pottery';
import Footer from '../components/Footer';
import '../styles/artisans.css'
import '../styles/best-sellers.css'


const Market = () => {
  const { t } = useTranslation();

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

  return (
    <>
      <Helmet>
        <title>Marketplace - Magical Africa</title>
        <meta name="description" content="Shop authentic African products from artisans and creators across the continent. Discover handcrafted goods, traditional crafts, clothing, jewelry and more." />
        <meta name="keywords" content="African marketplace, buy African products, authentic African crafts, African artisans, handmade African goods, African jewelry, African clothing" />
        <meta property="og:title" content="African Marketplace — Buy Authentic African Products" />
        <meta property="og:description" content="Shop authentic handcrafted African products from artisans and creators across the continent." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://magical.africa/market" />
      </Helmet>

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


      {/* Best Sellers */}
      <div className='best-sellers-div'>
        <h1>{t('market.bestSellers.title')}</h1>
        <p>{t('market.bestSellers.subtitle')}</p>

        <div className='best-seller-wrapper'>

          <div className='best-seller1 sel1'>
            <img src="/images/pottery2-image2.png" alt="" />
            <div className='best-seller1-content'>
              <p>{t('market.bestSellers.item1.name')}</p>
              <button>{t('market.bestSellers.addToCart')}</button>
            </div>
            <div className='seller-price'>
              <p>{t('market.bestSellers.price')} : $45</p>
            </div>
          </div>

          <div className='best-seller1 sel2'>
            <img src="/images/pottery3-image3.png" alt="" />
            <div className='best-seller1-content'>
              <p>{t('market.bestSellers.item2.name')}</p>
              <button>{t('market.bestSellers.addToCart')}</button>
            </div>
            <div className='seller-price'>
              <p>{t('market.bestSellers.price')} : $76</p>
            </div>
          </div>

          <div className='best-seller1 sel3'>
            <img src="/images/pottery4-image5.png" alt="" />
            <div className='best-seller1-content'>
              <p>{t('market.bestSellers.item3.name')}</p>
              <button>{t('market.bestSellers.addToCart')}</button>
            </div>
            <div className='seller-price'>
              <p>{t('market.bestSellers.price')} : $25</p>
            </div>
          </div>

          <div className='best-seller1 sel4'>
            <img src="/images/pottery5-image6.png" alt="" />
            <div className='best-seller1-content'>
              <p>{t('market.bestSellers.item4.name')}</p>
              <button>{t('market.bestSellers.addToCart')}</button>
            </div>
            <div className='seller-price'>
              <p>{t('market.bestSellers.price')} : $30</p>
            </div>
          </div>

        </div>
      </div>


      {/* Shop Collection */}
      <div className='Shop-div'>
        <h1>{t('market.shop.title')}</h1>
        <p className='collection-description'>{t('market.shop.subtitle')}</p>

        <div className='collection-div'>
          <button
            className={activeCategory === 'jewellery' ? 'active' : ''}
            onClick={() => setActiveCategory('jewellery')}
          >{t('market.shop.categories.jewellery')}</button>

          <button
            className={activeCategory === 'carvings' ? 'active' : ''}
            onClick={() => setActiveCategory('carvings')}
          >{t('market.shop.categories.carvings')}</button>

          <button
            className={activeCategory === 'pottery' ? 'active' : ''}
            onClick={() => setActiveCategory('pottery')}
          >{t('market.shop.categories.pottery')}</button>

          <button
            className={activeCategory === 'textiles' ? 'active' : ''}
            onClick={() => setActiveCategory('textiles')}
          >{t('market.shop.categories.textiles')}</button>

          <button
            className={activeCategory === 'baskets' ? 'active' : ''}
            onClick={() => setActiveCategory('baskets')}
          >{t('market.shop.categories.baskets')}</button>

          <button
            className={activeCategory === 'spices' ? 'active' : ''}
            onClick={() => setActiveCategory('spices')}
          >{t('market.shop.categories.spices')}</button>
        </div>

        {activeCategory === 'jewellery' && <Jewelery />}
        {activeCategory === 'carvings' && <Carvings />}
        {activeCategory === 'pottery' && <Pottery />}
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