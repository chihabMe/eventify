import { useState } from 'react';
import { IEventCategory } from '@/interfaces';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedEvents from '@/components/FeaturedEvents';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import UpcomingEvents from '@/components/UpCompingEvents';

const HomePage = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <FeaturedEvents />
      <UpcomingEvents />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default HomePage;
