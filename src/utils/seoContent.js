export const SEO_CONTENT = {
  home: {
    title: 'Magical Africa | African Culture, Languages, and Heritage',
    description: 'Explore African culture, languages, tribes, marketplace experiences, and academy learning on Magical Africa.',
    keywords: 'Magical Africa, African culture, African languages, African heritage, African tribes, African marketplace, African academy',
    path: '/',
    image: '/images/Igbo2.jpg',
    schemaType: 'WebSite',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Magical Africa',
        url: 'https://magical.africa',
        logo: 'https://magical.africa/images/magical-colored-fav.png',
        sameAs: []
      }
    ]
  },
  about: {
    title: 'About Magical Africa | Our Story and Mission',
    description: 'Learn about Magical Africa and its mission to preserve African languages, culture, knowledge, and heritage.',
    keywords: 'About Magical Africa, African culture preservation, African languages, African heritage, pan-African platform',
    path: '/about',
    image: '/images/pyramids2.jpg'
  },
  tribes: {
    title: 'African Tribes and Communities | Magical Africa',
    description: 'Explore African tribes and communities through their traditions, customs, cultures, and heritage.',
    keywords: 'African tribes, African communities, African culture, Maasai, Zulu, Yoruba, Ashanti',
    path: '/tribes',
    image: '/images/maasai-women2.jpg'
  },
  maasai: {
    title: 'Maasai Tribe | History, Culture, and Traditions',
    description: 'Explore the Maasai tribe through its history, culture, language, leaders, nature, and traditions.',
    keywords: 'Maasai tribe, Maasai culture, Maasai language, Maasai traditions, Maasai history',
    path: '/maasai',
    image: '/images/maasai-women2.jpg'
  },
  events: {
    title: 'African Cultural Events | Magical Africa',
    description: 'Discover African cultural events featuring music, ceremonies, food, art, and film.',
    keywords: 'African events, African cultural events, African festivals, African music events, African dance',
    path: '/events',
    image: '/images/drums2-latest.jpg'
  },
  market: {
    title: 'Marketplace - Original African Art For Sale',
    description: 'Shop African jewellery, carvings, pottery, textiles, spices, and other handcrafted products on Magical Africa.',
    keywords: 'African marketplace, buy African products, authentic African crafts, African artisans, African jewelry, African clothing',
    path: '/market',
    image: '/images/side-view-people-garage-sale2.jpg',
    schemaType: 'CollectionPage'
  },
  academy: {
    title: 'Magical Africa Academy | Learn African Languages and Skills',
    description: 'Browse Magical Africa Academy courses in language, music, crafts, cooking, and cultural learning.',
    keywords: 'Magical Africa Academy, African courses, learn African languages, African arts, African culture courses',
    path: '/academy',
    image: '/images/photorealistic-portrait-african-woman.jpg',
    schemaType: 'CollectionPage'
  },
  blogs: {
    title: 'Magical Africa Blog | Stories, Culture, and Heritage',
    description: 'Read blog content about African languages, heritage, crafts, food, travel, and culture on Magical Africa.',
    keywords: 'Magical Africa blog, African culture blog, African languages, African history, African travel, African art',
    path: '/blogs',
    image: '/images/African-storytelling2.jpg',
    schemaType: 'Blog'
  },
  music: {
    title: 'African Music | Genres, Instruments, and Artists',
    description: 'Explore African music through genres, instruments, artists, and cultural sounds from across the continent.',
    keywords: 'African music, Afrobeats, African instruments, Djembe, Kora, Mbira, African artists',
    path: '/music',
    image: '/images/drums2-latest.jpg'
  },
  technology: {
    title: 'African Technology and AI | Magical Africa',
    description: 'Explore how Magical Africa uses technology and AI for speech, transcription, indexing, and cultural preservation.',
    keywords: 'African technology, AI for African languages, language preservation, African digital heritage',
    path: '/technology',
    image: '/images/AI-woman.png'
  },
  academyLogin: {
    title: 'Academy Login | Magical Africa',
    description: 'Sign in to your Magical Africa Academy account to access your learner or tutor dashboard.',
    keywords: 'Magical Africa login, academy sign in, learner login, tutor login',
    path: '/academy-signIn',
    image: '/images/magivcal-logo2-removebg-preview.png',
    noIndex: true
  },
  academySignup: {
    title: 'Create Academy Account | Magical Africa',
    description: 'Create a Magical Africa Academy account to join as a learner or educator.',
    keywords: 'Magical Africa Academy signup, create account, African courses, African learning platform',
    path: '/academy-signUp',
    image: '/images/photorealistic-portrait-african-woman.jpg',
    noIndex: true
  }
}

export const SEO_ROUTE_LIST = [
  SEO_CONTENT.home,
  SEO_CONTENT.about,
  SEO_CONTENT.tribes,
  SEO_CONTENT.maasai,
  SEO_CONTENT.events,
  SEO_CONTENT.market,
  SEO_CONTENT.academy,
  SEO_CONTENT.blogs,
  SEO_CONTENT.music,
  SEO_CONTENT.technology,
  SEO_CONTENT.academyLogin,
  SEO_CONTENT.academySignup
]
