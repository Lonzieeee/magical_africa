
import React, { useState } from 'react'
import '../styles/blogs.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const featuredPost = {
  image: '/images/African-storytelling2.jpg',
}

const latestPosts = [
  { id: 1, image: '/images/beaded-jewelery2.jpg',  key: 'beadwork' },
  { id: 2, image: '/images/maasai-migration.jpg',   key: 'maasai' },
  { id: 3, image: '/images/kitenge-latest.jpg',     key: 'fashion' },
  { id: 4, image: '/images/african-atire.jpg',      key: 'masks' },
]

const sidebarPosts = [
  { id: 1, image: '/images/learn-language-kids.jpg', key: 'swahili' },
  { id: 2, image: '/images/nyama-choma2.jpg',         key: 'cuisine' },
]

const categoryKeys = ['language', 'heritage', 'crafts', 'food', 'travel']

const popularPosts = [
  { key: 'zulu',      image: '/images/zulu2.jpg' },
  { key: 'drumming',  image: '/images/drums-latest.jpg' },
  { key: 'festivals', image: '/images/kitenge-latest.jpg' },
]

const Blogs = () => {
  const { t } = useTranslation()
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
            <h1 className="blogs-title">
              {t('blogs.header.titleStart')} <span>{t('blogs.header.titleAccent')}</span>
            </h1>
            <div className="blogs-title-divider" />
            <p className="blogs-tagline">{t('blogs.header.tagline')}</p>
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
                  <span className="blogs-category-tag">{t('blogs.featured.category')}</span>
                  <h2>{t('blogs.featured.title')}</h2>
                  <p className="blogs-featured-date">{t('blogs.featured.date')}</p>
                  <p className="blogs-featured-excerpt">{t('blogs.featured.excerpt')}</p>
                  <button className="blogs-read-more">{t('blogs.featured.readMore')}</button>
                </div>
              </div>
            </div>

            {/* Latest Posts */}
            <div className="blogs-latest-section">
              <h2 className="blogs-section-title">{t('blogs.latest.heading')}</h2>
              <div className="blogs-grid">
                {latestPosts.map((post) => (
                  <div className="blogs-card" key={post.id}>
                    <div
                      className="blogs-card-img"
                      style={{ backgroundImage: `url('${post.image}')` }}
                    >
                      <div className="blogs-card-overlay" />
                      <div className="blogs-card-body">
                        <h3>{t(`blogs.latest.posts.${post.key}.title`)}</h3>
                        <p>{t(`blogs.latest.posts.${post.key}.subtitle`)}</p>
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
                    <h4>{t(`blogs.sidebar.recent.${post.key}.title`)}</h4>
                    <p className="sidebar-post-date">{t(`blogs.sidebar.recent.${post.key}.date`)}</p>
                    <p className="sidebar-post-sub">{t(`blogs.sidebar.recent.${post.key}.subtitle`)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Categories */}
            <div className="sidebar-section">
              <h3 className="sidebar-heading">{t('blogs.sidebar.categories.heading')}</h3>
              <ul className="sidebar-categories">
                {categoryKeys.map((key) => (
                  <li key={key}>
                    <span className="sidebar-cat-arrow">▶</span>
                    {t(`blogs.sidebar.categories.items.${key}`)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Posts */}
            <div className="sidebar-section">
              <h3 className="sidebar-heading">{t('blogs.sidebar.popular.heading')}</h3>
              <div className="sidebar-popular">
                {popularPosts.map((post) => (
                  <div className="sidebar-popular-item" key={post.key}>
                    <div
                      className="sidebar-popular-img"
                      style={{ backgroundImage: `url('${post.image}')` }}
                    />
                    <p>{t(`blogs.sidebar.popular.posts.${post.key}`)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="sidebar-newsletter">
              <h3>{t('blogs.sidebar.newsletter.heading')}</h3>
              <p>{t('blogs.sidebar.newsletter.subtitle')}</p>
              {subscribed ? (
                <p className="newsletter-success">{t('blogs.sidebar.newsletter.success')}</p>
              ) : (
                <div className="newsletter-form">
                  <input
                    type="email"
                    placeholder={t('blogs.sidebar.newsletter.placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button onClick={handleSubscribe}>{t('blogs.sidebar.newsletter.button')}</button>
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