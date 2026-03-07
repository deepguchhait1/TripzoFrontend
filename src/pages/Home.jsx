import HeroSection from "../components/home/HeroSection";
import Categories from "../components/home/Categories";
import PopularDestinations from "../components/home/PopularDestinations";
import TourPackages from "../components/home/TourPackages";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";
import ReviewForm from "../components/home/ReviewForm";
import BlogSection from "../components/home/BlogSection";
import CTASection from "../components/home/CTASection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <Categories />
      <PopularDestinations />
      <TourPackages />
      <WhyChooseUs />
      <CTASection />
      <Testimonials />
      <ReviewForm />
      <BlogSection />
    </>
  );
};

export default Home;
