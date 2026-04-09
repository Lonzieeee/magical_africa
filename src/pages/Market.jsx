


import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar';
import { Helmet } from 'react-helmet-async';
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
      price: 45
    },
    {
      id: 'default-2',
      imageUrl: '/images/pottery3-image3.png',
      name: t('market.bestSellers.item2.name'),
      price: 76
    },
    {
      id: 'default-3',
      imageUrl: '/images/pottery4-image5.png',
      name: t('market.bestSellers.item3.name'),
      price: 25
    },
    {
      id: 'default-4',
      imageUrl: '/images/pottery5-image6.png',
      name: t('market.bestSellers.item4.name'),
      price: 30
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

  return (
    <>
      <Helmet>
        <title>Marketplace | Magical Africa</title>
        <meta name="description" content="Shop authentic African products from artisans and creators across the continent. Discover handcrafted goods, traditional crafts, clothing, jewelry and more." />
        <meta name="keywords" content="African marketplace, buy African products, authentic African crafts, African artisans, handmade African goods, African jewelry, African clothing" />
        <meta property="og:title" content="African Marketplace — Buy Authentic African Products" />
        <meta property="og:description" content="Shop authentic handcrafted African products from artisans and creators across the continent." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://magical.africa/market" />
         <meta property="og:image" content="https://magical.africa/images/side-view-people-garage-sale2.jpg" />
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
          {bestSellerItems.map((item, index) => (
            <div key={item.id || index} className={`best-seller1 sel${(index % 4) + 1}`}>
              <img src={item.imageUrl || '/images/pottery2-image2.png'} alt={item.name || 'Marketplace product'} />
              <div className='best-seller1-content'>
                <p>{item.name || 'Untitled Product'}</p>
                <button>{t('market.bestSellers.addToCart')}</button>
              </div>
              <div className='seller-price'>
                <p>{t('market.bestSellers.price')} : {formatMarketPrice(item.price)}</p>
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