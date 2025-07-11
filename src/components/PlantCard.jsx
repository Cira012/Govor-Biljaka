import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Camera } from 'lucide-react';
import PropTypes from 'prop-types';
import ImageWithFallback from './ImageWithFallback';
import PhotoCaptureModal from './PhotoCaptureModal';

const PlantCard = ({ plant, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasLocations = plant.locations && plant.locations.length > 0;
  const isFlowering = isFloweringNow(plant.floweringSeason);
  const lastSeen = hasLocations ? getRelativeTime(plant.locations[0]?.date) : null;

  const handleCaptureClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleUploadSuccess = () => {
    console.log('Photo uploaded successfully!');
  };

  return (
    <>
      <div 
        className="group relative bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 h-full flex flex-col border border-gray-100"
        data-testid="plant-card"
        data-plant-id={plant.id}
        style={{
          opacity: 0,
          animation: `fadeIn 0.3s ease-out forwards ${index * 0.05}s`,
        }}
      >
        <style jsx>{`
          @keyframes fadeIn {
            to { opacity: 1; }
          }
        `}</style>
        
        {/* Image container with enhanced visual design */}
        <div className="relative w-full bg-gradient-to-br from-emerald-50 to-amber-50 overflow-hidden rounded-t-2xl">
          <div className="aspect-w-1 aspect-h-1 w-full">
            <Link to={`/vrste/${plant.id}`} className="block w-full h-full group-hover:opacity-95 transition-opacity duration-300">
              <div className="w-full h-full flex items-center justify-center p-4 md:p-6">
                <div className="relative w-full h-full max-h-56 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ImageWithFallback
                    src={plant.image}
                    alt={plant.name}
                    className="max-w-[90%] max-h-[90%] w-auto h-auto object-contain transition-all duration-300 group-hover:scale-110"
                    style={{
                      filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                      objectFit: 'contain',
                      willChange: 'transform'
                    }}
                  />
                </div>
              </div>
            </Link>
          </div>
          
          <button
            onClick={handleCaptureClick}
            className="absolute bottom-4 right-4 bg-white/90 p-2.5 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 hover:shadow-md z-10 backdrop-blur-sm"
            aria-label="Snimi fotografiju"
            title="Snimi fotografiju"
          >
            <Camera className="w-5 h-5 text-emerald-700" />
          </button>
          
          {isFlowering && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 text-xs font-medium px-3 py-1.5 rounded-full flex items-center shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              U cvetu
            </span>
          )}
        </div>
        
        <div className="p-4 md:p-5 flex-1 flex flex-col bg-white">
          <Link to={`/vrste/${plant.id}`} className="group-hover:text-emerald-700 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1 font-serif">
              {plant.name}
            </h3>
            {plant.scientificName && (
              <p className="text-sm text-emerald-800 font-medium mb-3 italic">
                {plant.scientificName}
              </p>
            )}
          </Link>
          
          <div className="mt-auto space-y-2">
            {plant.floweringSeason && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" />
                <span className="line-clamp-1">{plant.floweringSeason}</span>
              </div>
            )}
            
            {hasLocations && lastSeen && (
              <div className="flex items-start text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">
                  {plant.locations[0].location} • {lastSeen}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <PhotoCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plant={plant}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
};

// Helper functions
const isFloweringNow = (floweringSeason) => {
  if (!floweringSeason) return false;
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  return floweringSeason.includes(month);
};

const getRelativeTime = (dateString) => {
  if (!dateString) return 'Nikada viđeno';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Danas';
  if (diffDays === 1) return 'Juče';
  if (diffDays < 7) return `Pre ${diffDays} dana`;
  if (diffDays < 30) return `Pre ${Math.floor(diffDays / 7)} nedelje`;
  if (diffDays < 365) return `Pre ${Math.floor(diffDays / 30)} meseci`;
  return `Pre ${Math.floor(diffDays / 365)} godina`;
};

PlantCard.propTypes = {
  plant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    scientificName: PropTypes.string,
    image: PropTypes.string,
    floweringSeason: PropTypes.arrayOf(PropTypes.number),
    locations: PropTypes.arrayOf(PropTypes.shape({
      location: PropTypes.string,
      date: PropTypes.string
    }))
  }).isRequired,
  index: PropTypes.number
};

export default PlantCard;