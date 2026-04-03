

import React, { useState } from 'react'
import '../styles/blogs.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

const featuredPost = {
  title: 'The Art of African Storytelling',
  date: 'February 10, 2024',
  excerpt: 'Discover the rich tradition of oral storytelling and its role in shaping identity, history, and community across the African continent.',
  image: '/images/African-storytelling2.jpg',
  category: 'Cultural Heritage',
}

const latestPosts = [
  {
    id: 1,
    title: 'Crafting Beaded Jewelry',
    subtitle: 'Creating Beautiful Beadwork Inspired by African Heritage',
    image: '/images/beaded-jewelery2.jpg',
    category: 'Crafts & Art',
  },
  {
    id: 2,
    title: 'Exploring the Maasai Culture',
    subtitle: 'Inside the Traditions of the Maasai People',
    image: '/images/maasai-migration.jpg',
    category: 'Cultural Heritage',
  },
  {
    id: 3,
    title: 'African Fashion Trends',
    subtitle: 'Modern Styles with a Cultural Twist',
    image: '/images/kitenge-latest.jpg',
    category: 'Cultural Heritage',
  },
  {
    id: 4,
    title: 'The History of African Masks',
    subtitle: 'Unveiling the Mystique of Tribal Art',
    image: '/images/african-atire.jpg',
    category: 'Crafts & Art',
  },
]

const sidebarPosts = [
  {
    id: 1,
    title: 'Learning Swahili: Tips & Tricks',
    date: 'March 5, 2024',
    subtitle: 'Language Learning Made Fun and Easy',
    image: '/images/learn-language-kids.jpg',
  },
  {
    id: 2,
    title: 'Traditional African Cuisine to Try',
    date: 'February 25, 2024',
    subtitle: 'A Taste of Authentic African Dishes',
    image: '/images/nyama-choma2.jpg',
  },
]

const categories = [
  'Language & Learning',
  'Cultural Heritage',
  'Crafts & Art',
  'Food & Cuisine',
  'Travel & Traditions',
]

const popularPosts = [
  { title: '10 Essential Zulu Phrases', image: '/images/zulu2.jpg' },
  { title: 'Drumming in African Music', image: '/images/drums-latest.jpg' },
  { title: 'The Festivals of West Africa', image: '/images/kitenge-latest.jpg' },
]

const Blogs = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const navigate = useNavigate()

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <>


     <Helmet>
            <title>Blog - Magical Africa</title>
            <meta
              name="description"
              content="Read blogs about African languages, cultural traditions, history, travel destinations, art, and digital skills from Magical Africa Academy."
            />
            <meta property="og:title" content="Magical Africa Academy" />
            <meta property="og:url" content="https://magical.africa/blogs" />
          </Helmet>
     

      <div className="blogs-page">

         <Navbar />

        {/* ── HEADER ── */}
        <div className="blogs-header">
          <div className="blogs-header-decor top" />
          <div className="blogs-header-content">
            <h1 className="blogs-title">Magical.Africa <span>Blog</span></h1>
            <div className="blogs-title-divider" />
            <p className="blogs-tagline">Explore Stories, Insights, and Culture</p>
          </div>
          <div className="blogs-header-decor bottom" />
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div className="blogs-layout">

          {/* ── LEFT / MAIN ── */}
          <main className="blogs-main">

            {/* Featured Post */}
            <div className="blogs-featured">
              <div
                className="blogs-featured-img"
                style={{ backgroundImage: `url('${featuredPost.image}')` }}
              >
                <div className="blogs-featured-overlay" />
                <div className="blogs-featured-content">
                  <span className="blogs-category-tag">{featuredPost.category}</span>
                  <h2>{featuredPost.title}</h2>
                  <p className="blogs-featured-date">{featuredPost.date}</p>
                  <p className="blogs-featured-excerpt">{featuredPost.excerpt}</p>
                  <button className="blogs-read-more">Read More</button>
                </div>
              </div>
            </div>

            {/* Latest Posts */}
            <div className="blogs-latest-section">
              <h2 className="blogs-section-title">Latest Posts</h2>
              <div className="blogs-grid">
                {latestPosts.map((post) => (
                  <div className="blogs-card" key={post.id}>
                    <div
                      className="blogs-card-img"
                      style={{ backgroundImage: `url('${post.image}')` }}
                    >
                      <div className="blogs-card-overlay" />
                      <div className="blogs-card-body">
                        <h3>{post.title}</h3>
                        <p>{post.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>

          {/* ── SIDEBAR ── */}
          <aside className="blogs-sidebar">

            {/* Recent Posts */}
            <div className="sidebar-section">
              {sidebarPosts.map((post) => (
                <div className="sidebar-post" key={post.id}>
                  <div
                    className="sidebar-post-img"
                    style={{ backgroundImage: `url('${post.image}')` }}
                  />
                  <div className="sidebar-post-info">
                    <h4>{post.title}</h4>
                    <p className="sidebar-post-date">{post.date}</p>
                    <p className="sidebar-post-sub">{post.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Categories */}
            <div className="sidebar-section">
              <h3 className="sidebar-heading">Categories</h3>
              <ul className="sidebar-categories">
                {categories.map((cat, i) => (
                  <li key={i}>
                    <span className="sidebar-cat-arrow">▶</span>
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Posts */}
            <div className="sidebar-section">
              <h3 className="sidebar-heading">Popular Posts</h3>
              <div className="sidebar-popular">
                {popularPosts.map((post, i) => (
                  <div className="sidebar-popular-item" key={i}>
                    <div
                      className="sidebar-popular-img"
                      style={{ backgroundImage: `url('${post.image}')` }}
                    />
                    <p>{post.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="sidebar-newsletter">
              <h3>Subscribe to Our Newsletter</h3>
              <p>Stay updated with the latest stories and tips!</p>
              {subscribed ? (
                <p className="newsletter-success">🎉 Thank you for subscribing!</p>
              ) : (
                <div className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button onClick={handleSubscribe}>Subscribe</button>
                </div>
              )}
            </div>

          </aside>
        </div>

      </div>

      <Footer />
    </>
  )
}

export default Blogs
