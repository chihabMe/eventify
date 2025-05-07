// import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import EventCardSkeleton from './EventSkelaton';

const PageSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}

      {/* Hero Section Skeleton */}
      <section className="hero-section">
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-8 w-2/3 mx-auto mb-8" />
          <Skeleton className="h-12 w-80 mx-auto rounded-md mb-8" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-12 w-36 rounded-md" />
            <Skeleton className="h-12 w-36 rounded-md" />
          </div>
        </div>
      </section>

      {/* Featured Events Skeleton */}
      <section className="section-container">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-8">
          <EventCardSkeleton featured={true} />
          <EventCardSkeleton featured={true} />
          <EventCardSkeleton featured={true} />
        </div>
      </section>

      {/* Upcoming Events Skeleton */}
      <section className="section-container bg-gray-50">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <Skeleton className="h-10 w-48" />
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Skeleton className="h-12 w-40 mx-auto" />
        </div>
      </section>

      {/* Call to Action Skeleton */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-10 w-2/3 mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-8 bg-white/20" />
          <Skeleton className="h-12 w-36 mx-auto bg-white/20" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PageSkeleton;
