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
      {/* Blog Section Label */}
      <div className="max-w-7xl mx-auto px-4 mb-2">
        <span className="inline-block bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full px-4 py-1.5 text-sm font-semibold">Travel Blog</span>
      </div>
      <BlogSection />
    </>
  );
};

export default Home;
