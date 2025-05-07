import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
          Discover & Book Amazing Events
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
          Find the perfect events for your interests, book tickets, and create
          unforgettable memories.
        </p>


        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="px-8">
            <Link to="/events">Browse All Events</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-white/10 backdrop-blur-sm"
          >
            <Link to="/register">Create Account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
