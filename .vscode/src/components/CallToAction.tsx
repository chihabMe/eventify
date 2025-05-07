import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Host Your Own Event?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Sign up as an organizer and start creating amazing events for your
          community!
        </p>
        <Button asChild size="lg" variant="secondary" className="px-8">
          <Link to="/register">Get Started</Link>
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
