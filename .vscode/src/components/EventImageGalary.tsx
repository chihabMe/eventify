// EventImageGallery.jsx
import { useState } from 'react';

const EventImageGallery = ({ images }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
      <div className="h-96 relative">
        <img
          src={images[activeImageIndex]}
          alt="Event"
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${activeImageIndex === index ? 'bg-white' : 'bg-white/50'
                  }`}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="p-4 flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              className={`w-24 h-16 rounded overflow-hidden ${activeImageIndex === index ? 'ring-2 ring-primary' : ''
                }`}
              onClick={() => setActiveImageIndex(index)}
            >
              <img
                src={image}
                alt={`Event image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventImageGallery;
