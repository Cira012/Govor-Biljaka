import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Camera, Leaf } from 'lucide-react';
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
    // You could add a toast notification here if desired
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
        
        {/* Image container - taking up more space */}
        <div className="relative w-full h-48 bg-gradient-to-br from-emerald-50 to-amber-50 overflow-hidden">
          <div className="absolute inset-0 p-2 flex items-center justify-center">
            <Link to={`/vrste/${plant.id}`} className="block w-full h-full">
              <div className="w-full h-full flex items-center justify-center">
                <ImageWithFallback
                  src={plant.image}
                  alt={plant.name}
                  className="max-w-full max-h-full object-contain transition-all duration-500 group-hover:scale-105"
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxHeight: '100%',
                    maxWidth: '100%'
                  }}
                />
              </div>
            </Link>
            
            {/* Camera button for capturing photos */}
            <button
              onClick={handleCaptureClick}
              className="absolute bottom-3 right-3 bg-white/90 p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110 hover:shadow-md"
              aria-label="Snimi fotografiju"
              title="Snimi fotografiju"
            >
              <Camera className="w-5 h-5 text-emerald-700" />
            </button>
            
            {isFlowering && (
              <span className="absolute top-3 left-3 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 text-xs font-medium px-3 py-1.5 rounded-full flex items-center shadow-sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                U cvetu
              </span>
            )}
          </div>
        </div>
        
        {/* Card content */}
        <div className="p-4 flex-1 flex flex-col">
          <Link to={`/vrste/${plant.id}`} className="group-hover:text-emerald-700 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
              {plant.name}
            </h3>
            {plant.scientificName && (
              <p className="text-sm text-emerald-800 font-medium mb-3 italic">
                {plant.scientificName}
              </p>
            )}
          </Link>
          
          <div className="mt-auto">
            {plant.floweringSeason && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Clock className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" />
                <span>{plant.floweringSeason}</span>
              </div>
            )}
            
            {hasLocations && lastSeen && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" />
                <span className="line-clamp-1">
                  {plant.locations[0].location} • {lastSeen}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo Capture Modal */}
      {isModalOpen && (
        <PhotoCaptureModal
          plant={plant}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </>
  );
};

// Helper functions
function isFloweringNow(floweringSeason) {
  if (!floweringSeason) return false;
  
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const monthNames = ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"];
  const currentMonthName = monthNames[currentMonth - 1].toLowerCase();
  
  return floweringSeason.toLowerCase().includes(currentMonthName.substring(0, 3));
}

function getRelativeTime(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'danas';
  if (diffInDays === 1) return 'juče';
  if (diffInDays < 7) return `pre ${diffInDays} dana`;
  if (diffInDays < 30) return `pre ${Math.floor(diffInDays / 7)} nedelje`;
  if (diffInDays < 365) return `pre ${Math.floor(diffInDays / 30)} meseca`;
  
  const years = Math.floor(diffInDays / 365);
  return `pre ${years} ${years === 1 ? 'godine' : 'godina'}`;
}

PlantCard.propTypes = {
  plant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    scientificName: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    locations: PropTypes.array,
    floweringSeason: PropTypes.string,
  }).isRequired,
  index: PropTypes.number,
};

export default PlantCard;
