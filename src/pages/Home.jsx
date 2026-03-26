import HeroSection from '../components/HeroSection';
import Services from '../components/Services';
import AboutSection from '../components/AboutSection';
import Marketplace from '../components/Marketplace';
import TribesSection from '../components/TribesSection';
import SocialImpact from '../components/SocialImpact';
import Partners from '../components/Partners';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Languages from '../components/Languages';
import Culture from '../components/Culture';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Patterns from '../components/Patterns';
import Pattern2 from '../components/Pattern2'
import PopularCourses from '../components/PopularCourses';

const Home = () => {

  /*
    useEffect(() => {
    document.title = 'Magical Africa - The Real African Story';
  }, []);
  */

  return (
    <>

 <Helmet>
        <title>Home — Magical Africa</title>
        <meta name="description" content="Discover the real African story — explore African cultures, languages, crafts, tribes, marketplace and academy all in one place." />
        <meta name="keywords" content="Magical Africa, African culture, African languages, African crafts, African tribes, Africa academy" />
        <meta property="og:title" content="Magical Africa — The Real African Story" />
        <meta property="og:description" content="Discover the real African story — explore African cultures, languages, crafts, tribes, marketplace and academy." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://magical.africa" />
      </Helmet>


      <HeroSection />
      <Services />
      <Languages />
      <AboutSection />
      <Marketplace />
      <PopularCourses />
      <TribesSection />
      <SocialImpact />
      <Culture />
      <Partners />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;