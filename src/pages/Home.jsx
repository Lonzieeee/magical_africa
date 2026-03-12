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
import Patterns from '../components/Patterns';
import Pattern2 from '../components/Pattern2'

const Home = () => {

    useEffect(() => {
    document.title = 'Magical Africa - The Real African Story';
  }, []);
  return (
    <>
      <HeroSection />
      <Services />
     
      <Languages />
      
      <AboutSection />
     
      <Marketplace />
      
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