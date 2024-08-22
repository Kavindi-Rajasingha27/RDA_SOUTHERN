import React from "react";
import AboutSection from "../../Components/Home/AboutSection/AboutSection";
import Applications from "../../Components/Home/Applications/Applications";
import Footer from "../../Components/Home/Footer/Footer";
import HeroSection from "../../Components/Home/HeroSection/HeroSection";

const Home = () => {
  return (
    <>
      {/* <Header /> */}
      <HeroSection />
      <Applications />
      <AboutSection />
      <Footer />
    </>
  );
};

export default Home;
