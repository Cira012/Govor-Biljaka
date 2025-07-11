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
        className="group relative bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col border-2 border-emerald-50 h-full"
        data-testid="plant-card"
        data-plant-id={plant.id}
        style={{
          opacity: 0,
          animation: `fadeIn 0.3s ease-out forwards ${index * 0.05}s`,
          height: '100%',
          width: '100%',
          maxWidth: '320px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '500px' // Increased minimum height to fit more of the image
        }}
      >
        <style jsx>{`
          @keyframes fadeIn {
            to { opacity: 1; }
          }
        `}</style>
        
        {/* Image container with fixed aspect ratio and perfect centering */}
        <div className="relative w-full bg-gradient-to-br from-emerald-50 to-amber-50 overflow-hidden rounded-t-2xl" style={{ height: '380px' }}>
          <Link to={`/vrste/${plant.id}`} className="block w-full h-full group-hover:opacity-95 transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-center p-6">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29-22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-29c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%233d7c40\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                backgroundSize: '30px 30px',
                backgroundPosition: 'center',
                backgroundRepeat: 'repeat',
                pointerEvents: 'none'
              }} />
              
              {/* Plant image with perfect centering */}
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <div className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
                  <ImageWithFallback
                    src={plant.image}
                    alt={plant.name}
                    className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    style={{
                      filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      willChange: 'transform',
                      imageRendering: 'crisp-edges',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto',
                      margin: '0 auto',
                      display: 'block',
                      position: 'relative',
                      zIndex: 1,
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}
                    onError={(e) => {
                      console.error('Error loading image:', plant.image, e);
                    }}
                  />
                </div>
              </div>
            </div>
          </Link>
          
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
        
        <div className="p-5 bg-white border-t border-emerald-100">
          <Link to={`/vrste/${plant.id}`} className="group-hover:text-emerald-700 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1 font-serif">
              {plant.name}
            </h3>
            {plant.scientificName && (
              <p className="text-sm text-emerald-800 font-medium mb-2 italic line-clamp-1">
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

      {isModalOpen && (
        <PhotoCaptureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plant={plant}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
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