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
import Patterns from '../components/Patterns';
import Pattern2 from '../components/Pattern2'
import PopularCourses from '../components/PopularCourses';
import PageSeo from '../components/PageSeo'
import { SEO_CONTENT } from '../utils/seoContent'

const Home = () => {

  /*
    useEffect(() => {
    document.title = 'Magical Africa - The Real African Story';
  }, []);
  */

  return (
    <>

      <PageSeo {...SEO_CONTENT.home} />


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